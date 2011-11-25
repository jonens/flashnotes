/** This class controls the browser output for the StatusBar */

/** constructor */
Flash.Notes.StatusView = function (){		
	this.lives_paper;
	this.status_paper
	this.dots = [];
	this.t;
	this.timerId;
	this.interval;
}

Flash.Notes.StatusView.prototype.drawStatusBar = function (x, y, w, h){
	this.status_paper = Raphael(x,y,w,h);
	this.box = this.status_paper.rect(0,0,w,h);
	this.box.attr({stroke:"red", fill:"#202000"});	
}

/** @param string timer_id The html element displaying the timer 
	@param number timeOut The time left in this round (in seconds) */
Flash.Notes.StatusView.prototype.displayTime = function (timer_id, timeOut){	
	var prefix = "00:";
	var timeStr = (timeOut >= 0) ? "" + timeOut : "" + (timeOut + 1);
	if (timeOut < 10){
		prefix = "00:0";
	}
	$(timer_id).html(prefix + timeStr);
}

/** @param string level_id The html element displaying the current game level */
Flash.Notes.StatusView.prototype.displayLevel = function (level_id, lvl){
	var levelStr = "" + lvl;	
	$(level_id).html(levelStr);
}

/** @param string points_id The html element that displays the points
	@param number pts The total points accumulated so far in the game
	@param number att The number of attempts so far in the game */
Flash.Notes.StatusView.prototype.displayPoints = function (points_id, pts, att){
	var percentStr = "" + pts + "/" + att;
	$(points_id).html(percentStr);
}

/** @param string percent_id The html element that displays the percent
	@param number pts The total points accumulated so far in the game
	@param number att The number of attempts so far in the game */
Flash.Notes.StatusView.prototype.displayPercent = function (percent_id, pts, att){
	var percent = (att > 0) ? Math.round(pts/att * 100) : 0;
	var percentStr = "" + percent + "%";
	$(percent_id).html(percentStr);
}

Flash.Notes.StatusView.prototype.displayScore = function (score_id, score){
	var scoreStr = "" + score;
	$(score_id).html(scoreStr);
}

Flash.Notes.StatusView.prototype.displayHiScore = function (hiscore_id, hiscore){
	var hiscoreStr = "" + hiscore;
	$(hiscore_id).html(hiscoreStr);
}

Flash.Notes.StatusView.prototype.initLivesDisplay = function (lives_id, lives){
	var i;
	this.lives_paper = Raphael(lives_id, 60, 20);
	for (i = 0; i < lives; i++){
		this.dots[i] = this.lives_paper.circle(10 * (i + 1), 5, 4.5).attr({fill: "red", 
						stroke: "black"});
	}	
}

Flash.Notes.StatusView.prototype.updateLivesDisplay = function (){
	var length = this.dots.length;
	if (length > 0){
		this.dots[length - 1].remove();
		this.dots.pop();
	}	
}

Flash.Notes.StatusView.prototype.removeLivesDisplay = function (){	
	this.lives_paper.remove();	
}