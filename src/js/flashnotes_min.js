function Merge(a,b){for(var c in b)a[c]=b[c];return a}function randomPos(a){return Math.floor(Math.random()*a)};AjaxUtilities=function(){var a,b,c=!1;this.createXHR=function(){a=new XMLHttpRequest};this.getXHR=function(){return a};this.open=function(b,e){try{a.open(b,e,!0)}catch(f){c=!1}};this.send=function(b,e){try{a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.send(e)}catch(f){c=!1}};this.onChange=function(){var d,e,f;if(a.readyState===4){if(a.status===200||a.statusText==="OK"){c=!0;b=a.responseXML;e=b.getElementsByTagName("score");f=b.getElementsByTagName("time");ds=b.getElementsByTagName("date_string");
ts=b.getElementsByTagName("time_string");for(d=0;d<e.length;d++)statusModel.top_scores[d]=e[d].childNodes[0].nodeValue,statusModel.top_times[d]=f[d].childNodes[0].nodeValue,statusModel.top_date_strings[d]=ds[d].childNodes[0].nodeValue,statusModel.top_time_strings[d]=ts[d].childNodes[0].nodeValue}else c=!1;gameController.displayFinalScore(c);$("#main_menu_button").show()}}};$(document).ready(function(){if(Modernizr.canvas){var a="a,b,c,d,e,f,g".split(",");statusModel=new StatusModel;statusView=new StatusView;notationController=new NotationController(1);gameController=new GameController;$("#stop").hide();$("#menu_frame").show();$("#practice_button").click(function(){gameController.displayPractice()});$("#play_button").click(function(){gameController.displayGame()});$("#instructions_button").click(function(){$("#menu_frame").hide();$("#instructions_frame").show()});$("#back_button").click(function(){$("#instructions_frame").hide();
$("#menu_frame").show()});$("#start_button").click(function(){gameController.getStart()||($(this).hide(),$("#stop_button").show());gameController.startGame("#status_timer")});$("#stop_button").click(function(){gameController.getStart()&&($(this).hide(),$("#start_button").show());gameController.stopGame()});$(".inputBtn").keydown(function(b){var c=b.keyCode;c==="13"&&b.preventDefault();c>=65&&c<=71&&(b=a[c-65],gameController.continueGame(c,b))});$(".inputBtn").click(function(){var b=$(this).attr("value").charCodeAt(0);
gameController.continueGame(b,a[b-65])});$(".clefBtn").click(function(){var a=$(this).attr("value");notationController.drawClef(a);$("#a").focus()});$("#session_start_button").click(function(){$("#session_frame").hide();statusModel.setTimeout(!1);$("#game_frame").show();gameController.startGame("#status_timer")});$("#session_end_button").click(function(){$("#session_frame").hide();gameController.displaySummary()});$("#game_end_button").click(function(){$("#session_frame").hide();gameController.processFinalScore()});
$("#sum_continue_button").click(function(){$("#summary_frame").hide();$("#session_frame").hide();!statusModel.getTimeout()&&statusModel.getMode()===statusModel.GAME_MODE&&gameController.startGame("#timer");statusModel.getTimeout()?gameController.updateLevel():$("#game_frame").show();$("#a").focus()});$("#quit_button").click(function(){$("#summary_frame").hide();statusModel.getMode()===statusModel.GAME_MODE?(gameController.processFinalScore(),gameController.removeLivesDisplay(),$("#score_display_frame").show()):
$("#menu_frame").show()});$("#main_menu_button").click(function(){$("#score_display_frame").hide();$("#main_menu_button").hide();gameController.init();$("#menu_frame").show()});$("button").hover(function(){$(this).css({opacity:1})},function(){$(this).css({opacity:0.9})})}else $("#menu_frame").hide(),$("#nocanvas_frame").show()});GameController=function(){this.isMaxLevel=!1;this.init()};
GameController.prototype.init=function(){statusModel.start(!1);statusModel.setTimeout(!1);statusModel.setTimeInterval(statusModel.TIMEOUT);statusModel.setLevel(1);statusModel.setPoints(0);statusModel.setAttempts(0);statusModel.setScore(0);statusModel.setLives(statusModel.MAX_LIVES);statusView.displayTime("#status_timer",0);notationController.hideNote();notationController.drawClef("0");$("#start_button").hide();$("#stop_button").hide();this.displayScore();return this};
GameController.prototype.setMode=function(a){statusModel.setMode(a)};GameController.prototype.startGame=function(a){var b=statusModel.getStart(),c=statusModel.getMode();statusModel.keyId="a";if(b)this.stopGame();else{statusModel.start(!0);document.getElementById("a").focus();switch(c){case statusModel.GAME_MODE:this.startTimer(a,statusModel.getTimeInterval(),c);break;case statusModel.PRACTICE_MODE:notationController.setLedgerLines(3),this.startTimer(a,0,c)}notationController.drawNote()}};
GameController.prototype.startTimer=function(a,b,c){b<0?(clearTimeout(this.t),statusModel.setTimeout(!0),this.stopGame()):this.t=setTimeout(function(){this.GameController.prototype.updateTimer(a,b,c)},1E3);statusView.displayTime(a,b);return this};
GameController.prototype.updateTimer=function(a,b,c){statusModel.getStart()&&c===statusModel.GAME_MODE?(b-=1,statusModel.setTime(b),statusModel.setTimeInterval(b),this.startTimer(a,b,c)):statusModel.getStart()&&c===statusModel.PRACTICE_MODE&&(b+=1,statusModel.setTime(b),this.startTimer(a,b,c))};
GameController.prototype.continueGame=function(a,b){var c=statusModel.getStart(),d,e=statusModel.getMode()===statusModel.GAME_MODE?!0:!1;statusModel.keyCode=a-65;statusModel.value=notationController.getNoteValue();statusModel.keyId=b;d=this.isNoteMatched();e&&!d&&(statusModel.subLives(),statusModel.getLives(),statusView.updateLivesDisplay());c&&d&&(this.isMaxLevel&&notationController.drawClef(notationController.getRandomClefType()),notationController.drawNote(),statusModel.addPoint(),statusModel.calculateScore());
c&&(statusModel.addAttempt(),this.displayScore(),document.getElementById(b).focus())};
GameController.prototype.stopGame=function(){var a,b;statusModel.start(!1);notationController.hideNote();document.getElementById(statusModel.keyId).blur();statusModel.getMode()===statusModel.GAME_MODE?(a=statusModel.getLevelStatus(),b=statusModel.getLives()>0?!1:!0,a&&(statusModel.advanceLevel(),statusModel.addBonus()),this.displaySessionAlert(!1,b)):(notationController.setLedgerLines(1),$("#stop_button").hide(),$("#start_button").show(),this.displaySummary());return this};
GameController.prototype.resetGame=function(){statusModel.setTimeout(!1);statusModel.setTimeInterval(statusModel.TIMEOUT);statusModel.setPoints(0);statusModel.setAttempts(0);this.displayScore()};GameController.prototype.getStart=function(){return statusModel.getStart()};GameController.prototype.isNoteMatched=function(){return statusModel.match()};
GameController.prototype.updateLevel=function(){var a=statusModel.getLevel();if(a===statusModel.MAX_LEVEL)this.isMaxLevel=!0,notationController.drawClef(notationController.getRandomClefType()),notationController.setLedgerLines(3);else{switch(a){case 1:case 3:case 5:notationController.drawClef("0");break;case 2:case 4:case 6:notationController.drawClef("1");break;case 7:case 9:case 11:notationController.drawClef("2");break;default:notationController.drawClef("3")}switch(a){case 1:case 2:case 7:case 8:notationController.setLedgerLines(1);
break;case 3:case 4:case 9:case 10:notationController.setLedgerLines(2);break;default:notationController.setLedgerLines(3)}}statusModel.getTimeout()&&this.resetGame();this.displayScore();this.displaySessionAlert(1)};GameController.prototype.displayPractice=function(){this.init();this.setMode(statusModel.PRACTICE_MODE);$("#menu_frame").hide();$("#game_frame").show();$("#menu_buttons").show();$("#game_status_box").hide();$("#stop_button").hide();$("#start_button").show()};
GameController.prototype.displayGame=function(){this.init();this.setMode(statusModel.GAME_MODE);statusView.initLivesDisplay("game_lives",statusModel.MAX_LIVES);this.displaySessionAlert(!0,!1)};
GameController.prototype.displayScore=function(){statusView.displayPoints("#status_points",statusModel.getPoints(),statusModel.getAttempts());statusView.displayPercent("#status_percent",statusModel.getPoints(),statusModel.getAttempts());statusView.displayScore("#status_score",statusModel.getScore());statusView.displayLevel("#status_level",statusModel.getLevel());statusView.displayHiScore("#hi_score",statusModel.getHiScore())};
GameController.prototype.displaySummary=function(){var a;$("#game_frame").hide();statusView.displayPoints("#point_summary",statusModel.getPoints(),statusModel.getAttempts());statusView.displayPercent("#percent_summary",statusModel.getPoints(),statusModel.getAttempts());statusModel.getMode()===statusModel.PRACTICE_MODE&&($("#score_summary_row").hide(),$("#level_summary_row").hide(),$("#lives_summary_row").hide(),$("#next_level_row").hide(),$("#continue_btn").hide(),$("#time_summary_row").show(),a=
statusModel.getTime()?statusModel.getTime():0,$("#time_summary").html(""+a+" sec"));statusModel.getMode()===statusModel.GAME_MODE&&(statusView.displayScore("#score_summary",statusModel.getScore()),$("#time_summary_row").hide(),$("#score_summary_row").show(),$("#level_summary_row").show(),$("#lives_summary_row").show(),$("#next_level_row").show(),$("#level_summary").html(""+statusModel.getLevel()),$("#lives_summary").html(""+statusModel.getLives()));$("#summary_frame").show()};
GameController.prototype.removeLivesDisplay=function(){statusModel.getMode()===statusModel.GAME_MODE&&statusView.removeLivesDisplay()};
GameController.prototype.displaySessionAlert=function(a,b){$("#menu_frame").hide();$("#instructions_frame").hide();$("#summary_frame").hide();$("#game_frame").hide();$("#menu_buttons").hide();$("#session_frame").show();$("#game_status_box").show();a&&!b?($("#session_start_header").html("Level "+statusModel.getLevel()),$("#session_end").hide(),$("#game_end").hide(),$("#session_start").show()):b?($("#session_start").hide(),$("#session_end").hide(),$("#game_end").show()):($("#session_start").hide(),
$("#game_end").hide(),$("#session_end").show())};
GameController.prototype.processFinalScore=function(){var a,b;a=statusModel.getScore();var c,d;statusModel.setDate();b=statusModel.getDateTime();c=statusModel.getDateString();d=statusModel.getTimeString();b="score="+a+"&time="+b+"&date_string="+c+"&time_string="+d;Modernizr.localstorage&&(c=statusModel.getHiScore(),a=c>a?c:a);statusModel.setHiScore(a);$("#score_text").html("Please wait . . . retrieving scores");ajaxUtilities.createXHR();a=ajaxUtilities.getXHR();ajaxUtilities.open("POST","php/get_scores.php");
a.onreadystatechange=ajaxUtilities.onChange;ajaxUtilities.send("POST",b)};
GameController.prototype.displayFinalScore=function(a){var b,c,d,e="",f="",g="your score: "+statusModel.getScore(),h=statusModel.top_scores.length;if(a)for(a=0;a<h;a++)b=parseInt(statusModel.top_scores[a]),c=statusModel.top_date_strings[a],d=parseInt(statusModel.top_times[a]),b===statusModel.getScore()&&d===statusModel.getDateTime()?(e+='<span class="your_scores">****'+b+"</span><br />",f+='<span class="your_scores">'+c+"</span><br />",g="**** your score"):(e+=b+"<br />",f+=c+"<br />");else e+="unavailable",
f+="unavailable";$("#score_display_frame").show();$("#top_scores").html(e);$("#top_dates").html(f);$("#top_score_footer").html(g)};NotationController=function(a){this.nm=new NotationModel;this.nv=new NotationView("staff_box",350,240);this.llShow=this.noteShow=!1;this.drawStaff();this.setLedgerLines(a)};
NotationController.prototype.drawStaff=function(){this.staffPaper=this.nv.paper;this.nv.box.fillRect(this.nv.RECT_X,this.nv.RECT_Y,this.nv.RECT_W,this.nv.RECT_H);this.staffBox=this.nv.box.getRect();this.staffPaper.path(this.nv.staffPath());this.clefObj=this.nv.clef(this.nv.TREBLE);this.nm.setClefType(this.nv.TREBLE);this.nm.setNoteValOffset(this.nm.TREBLE_OFFSET);this.clefImg=this.staffPaper.image(this.clefObj.src,this.clefObj.x,this.clefObj.y,this.clefObj.w,this.clefObj.h);this.staffPaper.image("images/fn_logo.png",
this.nv.RECT_X-42,this.nv.RECT_Y,40,this.nv.RECT_H)};
NotationController.prototype.drawClef=function(a){switch(a){case "0":this.clefObj=this.nv.clef(this.nv.TREBLE);this.nm.setClefType(this.nv.TREBLE);this.nm.setNoteValOffset(this.nm.TREBLE_OFFSET);break;case "1":this.clefObj=this.nv.clef(this.nv.BASS);this.nm.setClefType(this.nv.BASS);this.nm.setNoteValOffset(this.nm.BASS_OFFSET);break;case "2":this.clefObj=this.nv.clef(this.nv.ALTO);this.nm.setClefType(this.nv.ALTO);this.nm.setNoteValOffset(this.nm.ALTO_OFFSET);break;case "3":this.clefObj=this.nv.clef(this.nv.TENOR),
this.nm.setClefType(this.nv.TENOR),this.nm.setNoteValOffset(this.nm.TENOR_OFFSET)}this.clefImg.hide();this.clefImg=this.staffPaper.image(this.clefObj.src,this.clefObj.x,this.clefObj.y,this.clefObj.w,this.clefObj.h);this.clefImg.show()};
NotationController.prototype.drawNote=function(){var a=randomPos(this.nv.PROPS.numPos),b=this.nv.note(a,this.nv.staff);this.nm.setNotePos(a);this.noteShow&&this.noteImg.hide();this.noteImg=this.staffPaper.image(b.src,b.x,b.y,b.w,b.h);this.noteImg.show();this.noteShow=!0;if(this.llShow)this.ledgerLineImg.hide(),this.llShow=!1;a=this.nv.staff.ledgerLines(a);if(a!=0)this.ledgerLineImg=this.staffPaper.path(this.nv.ledgerLinePath(a,b)),this.ledgerLineImg.show(),this.llShow=!0};
NotationController.prototype.hideNote=function(){if(this.llShow)this.ledgerLineImg.hide(),this.llShow=!1;this.noteShow&&this.noteImg.hide()};NotationController.prototype.getNoteValue=function(){return this.nm.getNoteValue()};NotationController.prototype.setLedgerLines=function(a){this.nm.setLedgerLines(a);this.nv.PROPS.ledgerLines=a;this.nv.PROPS.numPos=11+4*a;this.nv.staff.setLedgerLines(a);this.nv.staff.setNumOfPositions()};NotationController.prototype.getLedgerLines=function(){return this.nm.getLedgerLines()};
NotationController.prototype.getRandomClefType=function(){return this.nv.randomClefType()};NotationModel=function(){this.ledgerLines=this.valOffset=this.notePos=0;this.clefType=this.noteValue=-1;this.TREBLE_OFFSET=10;this.BASS_OFFSET=12;this.ALTO_OFFSET=11;this.TENOR_OFFSET=9};NotationModel.prototype.getNoteValue=function(){return this.noteValue=this.notePos+(this.valOffset-2*this.ledgerLines)};NotationModel.prototype.setClefType=function(a){this.clefType=a;return this};NotationModel.prototype.getClefType=function(){return this.clefType};
NotationModel.prototype.setNoteValOffset=function(a){this.valOffset=a;return this};NotationModel.prototype.getNoteValOffset=function(){return this.valOffset};NotationModel.prototype.setNotePos=function(a){this.notePos=a;return this};NotationModel.prototype.getNotePos=function(){return this.notePos};NotationModel.prototype.setLedgerLines=function(a){this.ledgerLines=a;return this};NotationModel.prototype.getLedgerLines=function(){return this.ledgerLines};StatusModel=function(){if(Modernizr.localstorage){var a=parseInt(localStorage.getItem("hiscore"));this.hi_score=a?a:0}else this.hi_score=0;this.obj=this;this.score=this.level=this.attempts=this.points=0;this.top_scores=[];this.top_times=[];this.top_date_strings=[];this.top_time_strings=[];this.go=!1;this.lives=5;this.PRACTICE_MODE=0;this.GAME_MODE=1;this.MAX_LEVEL=13;this.MIN_ATTEMPTS=10;this.MIN_PERCENT=80;this.TIMEOUT=15;this.BONUS=100;this.MAX_LIVES=5;this.response_text="";this.numOfCodes=7;this.timeInterval=
this.TIMEOUT;this.timeOut=!1};StatusModel.prototype.start=function(a){this.go=a;return this};StatusModel.prototype.getStart=function(){return this.go};StatusModel.prototype.setMode=function(a){this.mode=a;return this};StatusModel.prototype.getMode=function(){return this.mode};StatusModel.prototype.setTimeInterval=function(a){this.timeInterval=a;return this};StatusModel.prototype.getTimeInterval=function(){return this.timeInterval};StatusModel.prototype.setTime=function(a){this.time=a;return this};
StatusModel.prototype.getTime=function(){return this.time};StatusModel.prototype.setTimeout=function(a){this.timeOut=a;return this};StatusModel.prototype.getTimeout=function(){return this.timeOut};StatusModel.prototype.addPoint=function(){this.points+=1;return this};StatusModel.prototype.setPoints=function(a){this.points=a;return this};StatusModel.prototype.getPoints=function(){return this.points};StatusModel.prototype.addAttempt=function(){this.attempts+=1;return this};
StatusModel.prototype.setAttempts=function(a){this.attempts=a};StatusModel.prototype.getAttempts=function(){return this.attempts};StatusModel.prototype.getPercent=function(){return Math.floor(this.points/this.attempts*100)};StatusModel.prototype.calculateScore=function(){this.score+=this.points*this.level;return this};StatusModel.prototype.addBonus=function(){this.score+=this.BONUS*this.level;return this};StatusModel.prototype.setScore=function(a){this.score=a;return this};
StatusModel.prototype.getScore=function(){return this.score};StatusModel.prototype.getHiScore=function(){return this.hi_score};StatusModel.prototype.setHiScore=function(a){this.hi_score=a;Modernizr.localstorage&&localStorage.setItem("hiscore",this.hi_score);return this};StatusModel.prototype.setDate=function(){this.date=new Date;this.date_time=this.date.getTime()};StatusModel.prototype.getDateTime=function(){return this.date_time};
StatusModel.prototype.getDateString=function(){var a=""+(this.date.getMonth()+1),b=this.date.getDate()<10?"0"+this.date.getDate():this.date.getDate();return a+"-"+b+"-"+this.date.getFullYear()};StatusModel.prototype.getTimeString=function(){var a=""+this.date.getHours(),b=this.date.getMinutes()<10?"0"+this.date.getMinutes():this.date.getMinutes(),c=this.date.getSeconds()<10?"0"+this.date.getSeconds():this.date.getSeconds();return a+":"+b+":"+c};
StatusModel.prototype.setLevel=function(a){this.level=a;return this};StatusModel.prototype.getLevel=function(){return this.level};StatusModel.prototype.subLives=function(){this.lives-=1;if(this.lives<0)this.lives=0;return this};StatusModel.prototype.setLives=function(a){this.lives=a;return this};StatusModel.prototype.getLives=function(){return this.lives};StatusModel.prototype.advanceLevel=function(){this.setLevel(this.level<this.MAX_LEVEL?this.level+=1:this.MAX_LEVEL);return this};
StatusModel.prototype.getLevelStatus=function(){return this.getPercent()>=this.MIN_PERCENT&&this.getTimeout()&&this.getAttempts()>=this.MIN_ATTEMPTS?!0:!1};StatusModel.prototype.match=function(){this.value%=this.numOfCodes;return this.value===this.keyCode?!0:!1};Box=function(a,b,c){arguments.length>0&&this.init(a,b,c)};Box.prototype.init=function(a,b,c){this.x=document.getElementById(a).getAttribute("left");this.y=document.getElementById(a).getAttribute("top");this.width=b;this.height=c;this.paper=Raphael(a,this.width,this.height);this.attributes={stroke_width:0,fill:"beige",stroke:"beige"};this.bg_attributes={stroke_width:0,fill:"white",stroke:"white"}};Box.prototype.ctx=function(){return this.paper};
Box.prototype.setStrokeColor=function(a){this.attributes.stroke=a;return this};Box.prototype.setStrokeWidth=function(a){this.attributes.stroke_width=a;return this};Box.prototype.setFill=function(a){this.attributes.fill=a;return this};Box.prototype.fillRect=function(a,b,c,d){d<0&&(b+=d,d=-d);this.rectangle=this.paper.rect(a,b,c,d).attr(this.attributes);return this};Box.prototype.getRect=function(){return this.rectangle};Clef=function(a,b,c,d,e){this.src=e;this.x=a+0.35*c;this.y=b;this.offset=this.w=this.h=0;switch(d){case 0:this.y=b-1.25*c;this.h=6.7*c;this.w=0.4*this.h;this.offset=10;break;case 1:this.h=3.4*c;this.w=0.69*this.h;this.offset=12;break;case 2:this.h=4*c;this.w=0.8*this.h;this.offset=11;break;case 3:this.y=b-c,this.h=4*c,this.w=0.7*this.h,this.offset=9}};NotationView=function(a,b,c){this.PROPS={numLines:5,space:14,ledgerLines:1,numPos:15};this.box=new Box(a,b,c);this.paper=this.box.ctx();this.TREBLE=0;this.BASS=1;this.ALTO=2;this.TENOR=3;this.clefArray=[this.TREBLE,this.BASS,this.ALTO,this.TENOR];this.RECT_X=42;this.RECT_Y=0;this.RECT_W=b-42;this.RECT_H=(6+2*this.PROPS.ledgerLines+this.PROPS.numLines+1)*this.PROPS.space;this.STAFF_X=this.RECT_X+10;this.STAFF_Y=this.RECT_Y+(4+this.PROPS.ledgerLines)*this.PROPS.space;this.STAFF_W=this.RECT_W-20;this.staff=
new Staff(this.STAFF_X,this.STAFF_Y,this.STAFF_W,this.PROPS);this.valueOffset=this.clefType=this.notePos=-1};NotationView.prototype.staffPath=function(){return this.staff.path()};
NotationView.prototype.clef=function(a){var b;switch(a){case this.TREBLE:b=new Clef(this.STAFF_X,this.STAFF_Y,this.PROPS.space,a,"images/treble.png");break;case this.BASS:b=new Clef(this.STAFF_X,this.STAFF_Y,this.PROPS.space,a,"images/bass.png");break;case this.ALTO:b=new Clef(this.STAFF_X,this.STAFF_Y,this.PROPS.space,a,"images/c_clef.png");break;case this.TENOR:b=new Clef(this.STAFF_X,this.STAFF_Y,this.PROPS.space,a,"images/c_clef.png")}return b};
NotationView.prototype.randomClefType=function(){return""+this.clefArray[Math.round(Math.random()*100)%4]};NotationView.prototype.note=function(a,b){var c=new Note(this.STAFF_X+this.STAFF_W/2,b.bottomPos(),a,this.PROPS.space,"images/whole.png");this.pos=a;return c};NotationView.prototype.ledgerLinePath=function(a,b){var c=0,d=Math.abs(a),e="";a>0&&(c=1);a<0&&(c=-1);switch(c){case 1:e+=b.ledgerPath(this.STAFF_Y+5*this.PROPS.space,d,c);break;case -1:e+=b.ledgerPath(this.STAFF_Y-this.PROPS.space,d,c)}return e};Note=function(a,b,c,d,e){this.x=a;this.y=b-c*d/2;this.h=d;this.w=1.6*this.h;this.src=e};Note.prototype.ledgerPath=function(a,b,c){for(var d="",e=this.x-this.w/4,f=this.x+this.w+this.w/4,g=0;g<b;g++){var h=a+g*c*this.h;d+="M "+e+", "+h+" L "+f+", "+h}return d};Staff=function(a,b,c,d){this.x=a;this.y=b;this.w=c;this.props={numOfLines:5,space:18,ledgerLines:3,numOfPositions:23};this.TREBLE=0;this.BASS=1;this.ALTO=2;this.TENOR=3;Merge(this.props,d)};Staff.prototype.path=function(){for(var a="",b=this.getNumOfLines(),c=this.x,d=this.x+this.w,e=0;e<b;e++){var f=this.y+e*this.getSpace();a+="M "+c+" "+f+" L "+d+" "+f}return a};Staff.prototype.getProps=function(){return this.props};Staff.prototype.setNumOfLines=function(a){this.props.numOfLines=a;return this};
Staff.prototype.setSpace=function(a){this.props.space=a;return this};Staff.prototype.setLedgerLines=function(a){this.props.ledgerLines=a;return this};Staff.prototype.setNumOfPositions=function(){this.props.numOfPositions=2*(this.getNumOfLines+2*this.getLedgerLines())+1;return this};Staff.prototype.getNumOfLines=function(){return this.props.numOfLines};Staff.prototype.getSpace=function(){return this.props.space};Staff.prototype.getLedgerLines=function(){return this.props.ledgerLines};
Staff.prototype.getNumOfPositions=function(){return this.props.numOfPositions};Staff.prototype.bottomPos=function(){return this.y+(this.getNumOfLines()-1+this.getLedgerLines())*this.getSpace()};Staff.prototype.topPos=function(){return this.y-(this.getLedgerLines()+1)*this.getSpace()};Staff.prototype.ledgerLines=function(a){var b=2*this.getLedgerLines()-1,c=2*(this.getLedgerLines()+this.getNumOfLines())+1,d=0;a<=b&&(d=1+Math.floor((b-a)/2));a>=c&&(d=-1-Math.floor((a-c)/2));return d};
Staff.prototype.getPosY=function(a){return a>this.getNumOfPositions()-1?this.getTopPos():a<0?this.getBottomPos():this.getBottomPos()+a*(this.getSpace()/2)};StatusView=function(){this.dots=[]};StatusView.prototype.drawStatusBar=function(a,b,c,d){this.status_paper=Raphael(a,b,c,d);this.box=this.status_paper.rect(0,0,c,d);this.box.attr({stroke:"red",fill:"#202000"})};StatusView.prototype.displayTime=function(a,b){var c="00:",d=b>=0?""+b:""+(b+1);b<10&&(c="00:0");$(a).html(c+d)};StatusView.prototype.displayLevel=function(a,b){var c;$(a).html(""+b)};StatusView.prototype.displayPoints=function(a,b,c){$(a).html(""+b+"/"+c)};
StatusView.prototype.displayPercent=function(a,b,c){b=""+(c>0?Math.round(b/c*100):0)+"%";$(a).html(b)};StatusView.prototype.displayScore=function(a,b){var c;$(a).html(""+b)};StatusView.prototype.displayHiScore=function(a,b){var c;$(a).html(""+b)};StatusView.prototype.initLivesDisplay=function(a,b){var c;this.lives_paper=Raphael(a,60,20);for(c=0;c<b;c++)this.dots[c]=this.lives_paper.circle(10*(c+1),5,4.5).attr({fill:"red",stroke:"black"})};
StatusView.prototype.updateLivesDisplay=function(){var a=this.dots.length;a>0&&(this.dots[a-1].remove(),this.dots.pop())};StatusView.prototype.removeLivesDisplay=function(){this.lives_paper.remove()};
