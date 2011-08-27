/* Methods to control the gameplay and properties of a FlashNotes game, and 
   update the StatusModel */
   
/* constructor   */
GameController = function (){
	var xmlResponse, txt, s, t, i;
	//this.xhr;
	this.timerId;
	this.t;
	this.time;
	this.isMaxLevel = false;	
	this.init();	
}

/* Initialize game variables to initial state */
GameController.prototype.init = function (){	
	statusModel.start(false);
	statusModel.setTimeout(false);	
	statusModel.setTimeInterval(cfg.TIMEOUT);
	statusModel.setLevel(1);	
	statusModel.setPoints(0);
	statusModel.setAttempts(0);
	statusModel.setScore(0);	
	statusModel.setLives(cfg.MAX_LIVES);
	statusView.displayTime("#status_timer", 0);
	notationController.hideNote();	
	notationController.drawClef(cfg.TREBLE);
	notationController.setLedgerLines(cfg.MIN_LEDGER);
	$('#start_button').hide();
	$('#stop_button').hide();
	this.initClefs(cfg.TREBLE);
	this.displayScore();	
	return this;
}

GameController.prototype.setMode = function (mode){
	statusModel.setMode(mode);
}

GameController.prototype.initClefs = function (type) {
	var i;
	for (i = 0; i < 4; i++) {
		statusModel.active_clefs[i] = false;
		statusModel.clefButtons[i].removeClass('on');
		statusModel.clefButtons[i].addClass('off');
	}
	statusModel.active_clefs[type] = true;
	statusModel.clefButtons[type].removeClass('off');
	statusModel.clefButtons[type].addClass('on');	
}

GameController.prototype.startGame = function (timer_id){
	var start = statusModel.getStart();
	var key_id = "a";
	var mode = statusModel.getMode();
	statusModel.keyId = key_id;	
	if (!start){		
		statusModel.start(true);
		document.getElementById(key_id).focus();
		switch (mode){
			case cfg.GAME_MODE:
				this.startTimer(timer_id, statusModel.getTimeInterval(), mode);
				break;
			case cfg.PRACTICE_MODE:				
				this.startTimer(timer_id, 0, mode);
				break;
		}		
		notationController.drawNote();
	}
	else{		
		this.stopGame();
	}
}

GameController.prototype.startTimer = function (timer_id, timeOut, mode){	
	if (timeOut < 0){	
		clearTimeout(this.t);
		statusModel.setTimeout(true);		
		this.stopGame();	
	}
	else{
		this.t = setTimeout(function () {
			this.GameController.prototype.updateTimer(timer_id, timeOut, mode) 
			}, 
			1000);
	}	
	statusView.displayTime(timer_id, timeOut);	
	return this;	
}

GameController.prototype.updateTimer = function (timer_id, time, mode) {	
	if (statusModel.getStart() && mode === cfg.GAME_MODE) {
		time -= 1;
		statusModel.setTime(time);
		statusModel.setTimeInterval(time);
		this.startTimer(timer_id, time, mode);	
	}	
	else if (statusModel.getStart() && mode === cfg.PRACTICE_MODE) {
		time += 1;
		statusModel.setTime(time);
		this.startTimer(timer_id, time, mode);
	}
}

GameController.prototype.continueGame = function (code, key_id) {
	var lives, matched,
		start = statusModel.getStart(),
		level = statusModel.getLevel(),
		isGame = (statusModel.getMode() === cfg.GAME_MODE) ? true : false;
	statusModel.keyCode = code - 65;	
	statusModel.value = notationController.getNoteValue();	
	statusModel.keyId = key_id;
	matched = this.isNoteMatched();	
	if (isGame && !matched){
		statusModel.decLives();		
		lives = statusModel.getLives();
		statusView.updateLivesDisplay();
	}
	if (start && matched){	
		if (this.isMaxLevel) {		
			notationController.drawClef(notationController.getRandomClefType(4, 0));
		}
		else {
			if (level >=5 && level <= 8) {
				notationController.drawClef(notationController.getRandomClefType(2, 0));
			}
			if (level >=13 && level <= 16) {
				notationController.drawClef(notationController.getRandomClefType(2, 2));
			}			
		}
		if (!isGame) {
			this.setPracticeLedger();
			notationController.drawClef(statusModel.getClefType());
		}
		notationController.drawNote();
		statusModel.addPoint();
		statusModel.calculateScore();
	}
	if (start){
		statusModel.addAttempt();		
		this.displayScore();
		document.getElementById(key_id).focus();
	}	
}

GameController.prototype.stopGame = function (){
	var next_level, level, game_over;
	statusModel.start(false);	
	notationController.hideNote();	
	document.getElementById(statusModel.keyId).blur();	
	if (statusModel.getMode() === cfg.GAME_MODE){
		next_level = statusModel.isLevelAdvance(); //important! call this BEFORE re-setting points
		game_over = (statusModel.getLives() > 0) ? false : true;
		if (next_level){
			statusModel.advanceLevel();
			statusModel.addBonus();			
		}
		this.displaySessionAlert(false, game_over, next_level);
	}
	else{
		notationController.setLedgerLines(cfg.MIN_LEDGER);//reset ledgerlines (in case return to game mode)
		$("#stop_button").hide();
		$("#start_button").show();
		this.displaySummary();
	}	
	return this;	
}

/* Call this function only after a timeout (not after user presses stop button) */
GameController.prototype.resetGame = function (){
	statusModel.setTimeout(false);
	statusModel.setTimeInterval(cfg.TIMEOUT);
	statusModel.setPoints(0);
	statusModel.setAttempts(0);	
	this.displayScore();
}

GameController.prototype.getStart = function(){
	return statusModel.getStart();
}

GameController.prototype.isNoteMatched = function(){
	var match = statusModel.match();
	return match;
}

GameController.prototype.toggleClef = function (type) {
	var	toggleState = statusModel.toggleClefButton(type);
	switch (toggleState) {
		case cfg.TOGGLE_ON:
			statusModel.clefButtons[type].removeClass('off');
			statusModel.clefButtons[type].addClass('on');
			notationController.drawClef(type);
			break;
		case cfg.TOGGLE_OFF:
			statusModel.clefButtons[type].removeClass('on');
			statusModel.clefButtons[type].addClass('off');
			notationController.drawClef(statusModel.getClefType());
			break;
		default:
			break;
	}
}

GameController.prototype.setPracticeLedger = function () {
	var pct = statusModel.getPercent(),
		att = statusModel.getAttempts(),
		numlines = notationController.getLedgerLines();
	if (pct >= cfg.P_HIGH_PCT && (att % cfg.PRACTICE_ATT === 0) && 
				numlines < cfg.MAX_LEDGER) {		
		notationController.setLedgerLines(numlines + 1);
	}
	if (pct < cfg.P_LOW_PCT && numlines > cfg.MIN_LEDGER) {		
		notationController.setLedgerLines(numlines - 1);
	}
}
		
/* Use this method to update the game to the next level when in GAME mode,
	ONLY after stopGame() && */
GameController.prototype.updateLevel = function (){
	var level = statusModel.getLevel(),
		ledger_num = ((level % 2) === 0) ? (level/2 - 1) : Math.floor(level/2),
		clef_type;
	statusModel.setGameClefTypes();
	clef_type = statusModel.getClefType();
	ledger_num = ledger_num % 4;	
	if (level === cfg.MAX_LEVEL) {
		this.isMaxLevel = true;
		notationController.drawClef(notationController.getRandomClefType(4, 0));
		notationController.setLedgerLines(3);
	}
	else{		
		switch (clef_type) {
			case cfg.RANDOM_TB:
				notationController.drawClef(notationController.getRandomClefType(2, 0));
				break;
			case cfg.RANDOM_AT:
				notationController.drawClef(notationController.getRandomClefType(2, 2));
				break;
			default:
				notationController.drawClef(clef_type);
				break;
		}		
		notationController.setLedgerLines(ledger_num);
	}
	if (statusModel.getTimeout()){
		this.resetGame();
	}
	this.displayScore();
	this.displaySessionAlert(true, false, false);
}

GameController.prototype.displayPractice = function (){
	this.init();
	this.setMode(cfg.PRACTICE_MODE);
	$('#menu_frame').hide();
	$('#status_level_label').html("");
	$('#status_level').html("");
	$('#game_frame').show();		
	$('#menu_buttons').show();
	$('#game_status_box').hide();
	$('#stop_button').hide();
	$('#start_button').show();
}

GameController.prototype.displayGame = function (){
	this.init();
	this.setMode(cfg.GAME_MODE);
	statusView.initLivesDisplay("game_lives", cfg.MAX_LIVES);
	this.displaySessionAlert(true, false, false);		
}

/* Display points, percent, and total score on Status Bar on Game Screen */
GameController.prototype.displayScore = function (){	
	statusView.displayPoints("#status_points", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayPercent("#status_percent", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayScore("#status_score", statusModel.getScore());
	if (statusModel.getMode() === cfg.GAME_MODE) {
		statusView.displayLevel("#status_level", statusModel.getLevel());
	}
	statusView.displayHiScore("#hi_score", statusModel.getHiScore());
}

/* Display points, percent, and total score on Summary Screen*/
GameController.prototype.displaySummary = function (){	
	var time;
	$('#game_frame').hide();
	statusView.displayPoints("#point_summary", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayPercent("#percent_summary", statusModel.getPoints(), 
		statusModel.getAttempts());	
	if (statusModel.getMode() === cfg.PRACTICE_MODE) {
		$('#score_summary_row').hide();
		$('#level_summary_row').hide();
		$('#lives_summary_row').hide();
		$('#next_level_row').hide();
		$('#continue_btn').hide();
		$('#time_summary_row').show();
		time = (statusModel.getTime()) ? statusModel.getTime() : 0;
		$('#time_summary').html("" + time + " sec");
	}	
	if (statusModel.getMode() === cfg.GAME_MODE) {
		statusView.displayScore("#score_summary", statusModel.getScore());
		$('#time_summary_row').hide();
		$('#score_summary_row').show();
		$('#level_summary_row').show();
		$('#lives_summary_row').show();
		$('#next_level_row').show();
		$('#level_summary').html("" + statusModel.getLevel());
		$('#lives_summary').html("" + statusModel.getLives());		
	}
	$('#summary_frame').show();
}

GameController.prototype.removeLivesDisplay = function (){
	if (statusModel.getMode() === cfg.GAME_MODE) {
		statusView.removeLivesDisplay();
	}
}

/* Display Game_Mode session alerts 
	@param boolean start Display "start_session" button if true, display 
		"end_session" button if false.  
	@param boolean over Display "game_end" if true		*/
GameController.prototype.displaySessionAlert = function (start, over, nextLevel){
	$('#menu_frame').hide();
	$('#instructions_frame').hide();
	$('#summary_frame').hide();
	$('#game_frame').hide();		
	$('#menu_buttons').hide();
	$('#session_frame').show();
	$('#game_status_box').show();	
	if (start && !over){
		$('#session_start_header').html("Level " + statusModel.getLevel());		
		$('#session_end').hide();
		$('#game_end').hide();				
		$('#session_start').show();
	}
	else if (!over){
		$('#session_start').hide();
		$('#game_end').hide();
		$('#lives').html("" + statusModel.getLives() + " lives left");
		$('#session_end').show();
	}
	else{
		$('#session_start').hide();
		$('#session_end').hide();
		$('#game_end').show();
	}
}

GameController.prototype.processFinalScore = function (){
	var xhr, hiScore, 
		scoreStr,
		currentScore = statusModel.getScore(),
		storedScore,
		time,
		date_string,
		time_string;
	statusModel.setDate();
	time = statusModel.getDateTime();
	date_string = statusModel.getDateString();
	time_string = statusModel.getTimeString();
	scoreStr = "score=" + currentScore + "&time=" + time + "&date_string=" + 
					date_string + "&time_string=" + time_string;	
	if (Modernizr.localstorage){
		storedScore = statusModel.getHiScore();
		hiScore = (storedScore > currentScore) ? storedScore : currentScore;
		statusModel.setHiScore(hiScore);
	}
	else{
		hiScore = currentScore;
		statusModel.setHiScore(hiScore);
	}
	$('#score_text').html("Please wait . . . retrieving scores");
	ajaxUtilities.createXHR();
	xhr = ajaxUtilities.getXHR();	
	ajaxUtilities.open("POST", "php/get_scores.php");
	xhr.onreadystatechange = ajaxUtilities.onChange;
	ajaxUtilities.send("POST", scoreStr);	
}

GameController.prototype.displayFinalScore = function (success){
	var i, score, date, time,		
		scores = "",
		dates = "",
		footer_string = "your score: " + statusModel.getScore(),
		length = statusModel.top_scores.length;
	if (success) {
		for (i = 0; i < length; i++){
			score = parseInt(statusModel.top_scores[i]);
			date = statusModel.top_date_strings[i];
			time = parseInt(statusModel.top_times[i]);
			if (score === statusModel.getScore() && time === statusModel.getDateTime()){				
				scores += "<span class=\"your_scores\">****" + score + "</span><br />";
				dates += "<span class=\"your_scores\">" + date + "</span><br />";
				footer_string = "**** your score";
			}
			else {
				scores += score + "<br />";
				dates += date + "<br />";
			}
		}
	}
	else {
		scores += "unavailable";
		dates += "unavailable";
	}	
	$('#score_display_frame').show();	
	$('#top_scores').html(scores);
	$('#top_dates').html(dates);
	$('#top_score_footer').html(footer_string);
}

