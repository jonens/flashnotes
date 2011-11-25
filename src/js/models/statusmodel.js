/**
 * Flash Notes - a web-based musical flash card game
 * 
 * Copyright Jon Ensminger 2011
 * Data model class for game play logic and state.
 */ 

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
	this.top_scores = new Array();
	this.top_times = new Array();
	this.top_date_strings = new Array();
	this.top_time_strings = new Array();
	this.go = false;
	this.lives = 5;
	this.PRACTICE_MODE = 0;
	this.GAME_MODE = 1;
	this.MAX_LEVEL = 13;
	this.MIN_ATTEMPTS = 10;
	this.MIN_PERCENT = 80;
	this.TIMEOUT = 15;
	this.BONUS = 100;
	this.MAX_LIVES = 5;
	this.response_text = "";
	this.value;
	this.keyCode;
	this.keyId;
	this.numOfCodes = 7;
	this.timeInterval = this.TIMEOUT;
	this.timeOut = false;
	this.time;
	this.t;
	this.timerId;
	this.mode;
	this.date;
	this.date_time;
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
	this.score += this.BONUS * this.level;
	return this;
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

StatusModel.prototype.getTimeString = function (){
	//var date = new Date();
	var hour = "" + this.date.getHours();
	var minute = (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes();
	var second = (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds();
	return hour + ":" + minute + ":" + second;
}

StatusModel.prototype.setLevel = function (lvl){
	this.level = lvl;
	return this;
}

StatusModel.prototype.getLevel = function (){
	return this.level;
}

StatusModel.prototype.subLives = function (){
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

StatusModel.prototype.advanceLevel = function (){	
	this.setLevel((this.level < this.MAX_LEVEL) ? this.level += 1 : this.MAX_LEVEL);
	return this;
}

/* This method operates in GAME mode to indicate whether level advances 
	@return True if level advances, false otherwise */
StatusModel.prototype.getLevelStatus = function (){
	return (this.getPercent() >= this.MIN_PERCENT && this.getTimeout() && this.getAttempts() 
			>= this.MIN_ATTEMPTS) ? true : false;
}

/*Checks two values for a match.  Returns true if match, false otherwise. */
StatusModel.prototype.match = function (){
	this.value = this.value % this.numOfCodes;	
	return (this.value === this.keyCode) ? true : false;
}