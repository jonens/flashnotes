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
	statusModel.setTimeInterval(statusModel.TIMEOUT);
	statusModel.setLevel(1);	
	statusModel.setPoints(0);
	statusModel.setAttempts(0);
	statusModel.setScore(0);
	statusModel.setLives(statusModel.MAX_LIVES);
	statusView.displayTime("#status_timer", 0);
	notationController.hideNote();
	notationController.drawClef('0');
	$('#start_button').hide();
	$('#stop_button').hide();
	this.displayScore();	
	return this;
}

GameController.prototype.setMode = function (mode){
	statusModel.setMode(mode);
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
			case statusModel.GAME_MODE:			
				this.startTimer(timer_id, statusModel.getTimeInterval(), mode);
				break;
			case statusModel.PRACTICE_MODE:
				notationController.setLedgerLines(3);//req. this; practice mode has no levels
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

GameController.prototype.updateTimer = function (timer_id, time, mode){		
	if (statusModel.getStart() && mode === statusModel.GAME_MODE){
		time -= 1;
		statusModel.setTime(time);
		statusModel.setTimeInterval(time);
		this.startTimer(timer_id, time, mode);	
	}
	else if (statusModel.getStart() && mode === statusModel.PRACTICE_MODE){
		time += 1;
		statusModel.setTime(time);
		this.startTimer(timer_id, time, mode);
	}
}

GameController.prototype.continueGame = function (code, key_id){
	var start = statusModel.getStart();
	var lives, matched;	
	var isGame = (statusModel.getMode() === statusModel.GAME_MODE) ? true : false;
	statusModel.keyCode = code - 65;	
	statusModel.value = notationController.getNoteValue();	
	statusModel.keyId = key_id;
	matched = this.isNoteMatched();	
	if (isGame && !matched){
		statusModel.subLives();		
		lives = statusModel.getLives();
		statusView.updateLivesDisplay();
	}
	if (start && matched){	
		if (this.isMaxLevel){		
			notationController.drawClef(notationController.getRandomClefType());
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
	var nextLevel, level, game_over;
	statusModel.start(false);	
	notationController.hideNote();	
	document.getElementById(statusModel.keyId).blur();	
	if (statusModel.getMode() === statusModel.GAME_MODE){		
		nextLevel = statusModel.getLevelStatus(); //important! call this BEFORE re-setting points
		game_over = (statusModel.getLives() > 0) ? false : true;
		if (nextLevel){		
			statusModel.advanceLevel();
			statusModel.addBonus();			
		}
		this.displaySessionAlert(false, game_over);
	}
	else{
		notationController.setLedgerLines(1);//reset ledgerlines (in case return to game mode)
		$("#stop_button").hide();
		$("#start_button").show();
		this.displaySummary();
	}	
	return this;	
}

/* Call this function only after a timeout (not after user presses stop button) */
GameController.prototype.resetGame = function (){
	statusModel.setTimeout(false);
	statusModel.setTimeInterval(statusModel.TIMEOUT);	
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

/* Use this method to update the game to the next level when in GAME mode,
	ONLY after stopGame() && */
GameController.prototype.updateLevel = function (){
	var level = statusModel.getLevel();	
	if (level === statusModel.MAX_LEVEL){	
		this.isMaxLevel = true;
		notationController.drawClef(notationController.getRandomClefType());
		notationController.setLedgerLines(3);
	}
	else{
		switch (level){
			case 1:
			case 3:
			case 5:
				notationController.drawClef('0');
				break;
			case 2:
			case 4:
			case 6:
				notationController.drawClef('1');
				break;
			case 7:
			case 9:
			case 11:
				notationController.drawClef('2');
				break;
			default:
				notationController.drawClef('3');
				break;
		}
		switch (level){
			case 1:
			case 2:
			case 7:
			case 8:
				notationController.setLedgerLines(1);
				break;
			case 3:
			case 4:
			case 9:
			case 10:
				notationController.setLedgerLines(2);
				break;
			default:
				notationController.setLedgerLines(3);
				break;		
		}	
	}
	if (statusModel.getTimeout()){
		this.resetGame();
	}
	this.displayScore();
	this.displaySessionAlert(1);
}

GameController.prototype.displayPractice = function (){
	this.init();		
	this.setMode(statusModel.PRACTICE_MODE);
	$('#menu_frame').hide();
	$('#game_frame').show();		
	$('#menu_buttons').show();	
	$('#game_status_box').hide();
	$('#stop_button').hide();
	$('#start_button').show();
}

GameController.prototype.displayGame = function (){
	this.init();
	this.setMode(statusModel.GAME_MODE);
	statusView.initLivesDisplay("game_lives", statusModel.MAX_LIVES);	
	this.displaySessionAlert(true, false);		
}

/* Display points, percent, and total score on Status Bar on Game Screen */
GameController.prototype.displayScore = function (){	
	statusView.displayPoints("#status_points", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayPercent("#status_percent", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayScore("#status_score", statusModel.getScore());
	statusView.displayLevel("#status_level", statusModel.getLevel());
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
	if (statusModel.getMode() === statusModel.PRACTICE_MODE){	
		$('#score_summary_row').hide();
		$('#level_summary_row').hide();
		$('#lives_summary_row').hide();
		$('#next_level_row').hide();
		$('#continue_btn').hide();
		$('#time_summary_row').show();
		time = (statusModel.getTime()) ? statusModel.getTime() : 0;
		$('#time_summary').html("" + time + " sec");
	}
	if (statusModel.getMode() === statusModel.GAME_MODE){					
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
	if (statusModel.getMode() === statusModel.GAME_MODE){
		statusView.removeLivesDisplay();
	}
}

/* Display Game_Mode session alerts 
	@param boolean start Display "start_session" button if true, display 
		"end_session" button if false.  
	@param boolean over Display "game_end" if true		*/
GameController.prototype.displaySessionAlert = function (start, over){	
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

