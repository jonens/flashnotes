/* Provides basic control functions for games */

/* constructor */
StatusModel = function(){
	if (Modernizr.localstorage){
		var score = parseInt(localStorage.getItem("hiscore"));
		this.hi_score = (score) ? score : 0;
	}
	else {
		this.hi_score = 0;
	}
	this.obj = this;
	this.points = 0;
	this.attempts = 0;
	this.level = 0;	
	this.score = 0;
	this.bonus = 0;
	this.top_scores = new Array();
	this.top_times = new Array();
	this.top_date_strings = new Array();
	this.top_time_strings = new Array();
	this.go = false;
	this.lives = 5;
	this.value;
	this.keyCode;
	this.keyId;
	this.numOfCodes = 7;//Only letter names of notes: A - G	
	this.timeInterval = cfg.TIMEOUT;
	this.timeOut = false;
	this.session_count = 0;
	this.time;
	this.t;
	this.timerId;
	this.mode;
	this.date;
	this.date_time;
	this.active_clefs = [
		true,			//treble
		false,			//bass
		false,			//alto
		false			//tenor
	];
	this.clefArray = [cfg.TREBLE, cfg.BASS, cfg.ALTO, cfg.TENOR];
	this.clefButtons = [$('#treble_button'), $('#bass_button'), $('#alto_button'),
							$('#tenor_button')];
}

/* @param boolean go Toggles game play  */
StatusModel.prototype.start = function (go){
	this.go = go;
	return this;
}

StatusModel.prototype.getStart = function (){
	return this.go;
}

StatusModel.prototype.setMode = function (mode){
	this.mode = mode;	
	return this;
}

StatusModel.prototype.getMode = function (){
	return this.mode;
}

StatusModel.prototype.setTimeInterval = function (num){
	this.timeInterval = num;
	return this;
}

StatusModel.prototype.getTimeInterval = function (){
	return this.timeInterval;
}

StatusModel.prototype.setTime = function (time){
	this.time = time;
	return this;
}

StatusModel.prototype.getTime = function (){
	return this.time;
}

/* Set a boolean indicating whether timeOut */
StatusModel.prototype.setTimeout = function (timeout){
	this.timeOut = timeout;
	return this;
}

/* Get a boolean indicating whether timeOut */
StatusModel.prototype.getTimeout = function (){
	return this.timeOut;
}

StatusModel.prototype.addPoint = function (){	
	this.points += 1;
	return this;
}

StatusModel.prototype.setPoints = function (num){	
	this.points = num;	
	return this;
}

StatusModel.prototype.getPoints = function (){
	return this.points;
}

StatusModel.prototype.addAttempt = function (){
	this.attempts += 1;
	return this;
}

StatusModel.prototype.setAttempts = function (num){
	this.attempts = num;
}

StatusModel.prototype.getAttempts = function (){
	return this.attempts;
}

StatusModel.prototype.getPercent = function (){
	return Math.floor((this.points /this.attempts) * 100);
}

/* Helper function.  Should be "private" [don't call externally) */
StatusModel.prototype.calculateScore = function(){
	this.score += (this.points * this.level);
	return this;
}

StatusModel.prototype.addBonus = function (){
	this.bonus = cfg.BONUS * this.level;
	this.score += this.bonus;
	return this;
}

StatusModel.prototype.getBonus = function (){
	return this.bonus;
}

StatusModel.prototype.setScore = function (num){
	this.score = num;
	return this;
}

StatusModel.prototype.getScore = function (){
	return this.score;
}

StatusModel.prototype.getHiScore = function (){
	return this.hi_score;
}

StatusModel.prototype.setHiScore = function (num){
	this.hi_score = num;
	if (Modernizr.localstorage){
		localStorage.setItem("hiscore", this.hi_score);
	}
	return this;
}

StatusModel.prototype.setDate = function (){
	this.date = new Date();
	this.date_time = this.date.getTime();
}

StatusModel.prototype.getDateTime = function (){
	return this.date_time;
}

StatusModel.prototype.getDateString = function (){
	//var date = new Date();
	var month = "" + (this.date.getMonth() + 1);
	var day = (this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate();	
	return month + "-" + day + "-" + this.date.getFullYear();
}

StatusModel.prototype.getTimeString = function () {
	var hour = "" + this.date.getHours();
	var minute = (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes();
	var second = (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds();
	return hour + ":" + minute + ":" + second;
}

StatusModel.prototype.setLevel = function (lvl) {
	this.level = lvl;	
	if (this.level > cfg.BONUS_LEVEL) {
		cfg.BONUS += cfg.BONUS_INC;
	}
	return this;
}

StatusModel.prototype.getLevel = function () {
	return this.level;
}

StatusModel.prototype.advanceLevel = function (){	
	this.setLevel((this.level < cfg.MAX_LEVEL) ? this.level += 1 : cfg.MAX_LEVEL);
	return this;
}

/* This method operates in GAME mode to indicate whether level advances 
	@return true if level advances, false otherwise */
StatusModel.prototype.isLevelAdvance = function (){	
	var advance = ((this.getPercent() >= cfg.MIN_PERCENT) && (this.getTimeout()) && 
				(this.getAttempts() >= cfg.MIN_ATTEMPTS)) ? true : false;
	return advance;
}

StatusModel.prototype.setGameClefTypes = function () {
	var sel, sw,
		level = this.getLevel();
	if (level <= cfg.TIER_1) {
		sw = (level % 2 === 0);
		sel = [!sw, sw, false, false]; //treble || bass only
	}
	if (level > cfg.TIER_1 && level <= cfg.TIER_2) {
		sel = [true, true, false, false]; //treble || bass only
	}
	if (level > cfg.TIER_2 && level <= cfg.TIER_3) {
		sw = (level % 2 === 0);
		sel = [false, false, !sw, sw]; //alto || tenor only
	}
	if (level > cfg.TIER_3 && level <= cfg.TIER_4) {
		sel = [false, false, true, true]; //alto || tenor only
	}
	if (level > cfg.TIER_4) {
		sel = [true, true, true, true]; //any clef
	}
	this.set_clef(sel);
}

StatusModel.prototype.set_clef = function (selections) {
	var i;
	for (i = 0; i < 4; i++) {
		this.active_clefs[i] = selections[i];
	}
}

StatusModel.prototype.getClefType = function () {
	var i, j,
		clef_index_array = [],
		count = 0;
	for (i = 0; i < 4; i++) {
		if (this.active_clefs[i] === true) {			
			clef_index_array[count] = i;
			count += 1;
		}		
	}
	if (clef_index_array.length === 1) {
		i = clef_index_array[0];		
	}
	else {
		j = Math.round(Math.random() * 100) % (clef_index_array.length);		
		i = clef_index_array[j];
	}
	return this.clefArray[i];	
}

// Toggle the clef buttons; if only one button is "on", don't toggle.
StatusModel.prototype.toggleClefButton = function (type) {
	var i, count = 0;
	if (this.active_clefs[type]) {
		for (i = 0; i < 4; i++) {
			count += (this.active_clefs[i] === true) ? 1 : 0;
		}
		if (count === 1) {
			return cfg.TOGGLE_NONE;
		}
	}
	this.active_clefs[type] = !this.active_clefs[type];
	return (this.active_clefs[type]) ? cfg.TOGGLE_ON : cfg.TOGGLE_OFF;
}

StatusModel.prototype.decLives = function (){
	this.lives -= 1;
	if (this.lives < 0){
		this.lives = 0;
	}
	return this;
}

StatusModel.prototype.setLives = function (num){
	this.lives = num;
	return this;
}

StatusModel.prototype.getLives = function (){
	return this.lives;
}

/*Checks two values for a match.  Returns true if match, false otherwise. */
StatusModel.prototype.match = function (){
	this.value = this.value % this.numOfCodes;	
	return (this.value === this.keyCode) ? true : false;
}