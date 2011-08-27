/* Methods to control the display and properties of a notation view, and update 
	the NotationModel   */

/* constructor - @param number num The number of ledgerlines to start with */
NotationController = function (num)
{
	//this.nm = new NotationModel();
	this.nv = new NotationView("staff_box", 350, 240);
	this.clefObj;
	this.clefImg;
	this.staffBox;
	this.staffPaper;
	this.noteImg;
	this.ledgerLineImg;
	this.noteShow = false;
	this.llShow = false;
	this.drawStaff();
	this.setLedgerLines(num);
}

/* Draw a new staff on the Raphael canvas */
NotationController.prototype.drawStaff = function ()
{
	this.staffPaper = this.nv.paper;			
	this.nv.box.fillRect(this.nv.RECT_X, this.nv.RECT_Y, this.nv.RECT_W, this.nv.RECT_H);
	this.staffBox = this.nv.box.getRect();	
	var staff = this.staffPaper.path(this.nv.staffPath());	
	this.clefObj = this.nv.clef(cfg.TREBLE, notationModel.getImgUrl(cfg.TREBLE));	
	notationModel.setClefType(cfg.TREBLE);
	notationModel.setNoteValOffset(cfg.TREBLE_OFFSET);
	this.clefImg = this.staffPaper.image(this.clefObj.src, this.clefObj.x, this.clefObj.y, 
						this.clefObj.w, this.clefObj.h);	
	var logo = this.staffPaper.image("images/fn_logo.png", this.nv.RECT_X - 42, 
						this.nv.RECT_Y, 40, this.nv.RECT_H);
}

NotationController.prototype.drawClef = function (type)
{	
	this.clefObj = this.nv.clef(type, notationModel.getImgUrl(type));
	notationModel.setClefType(type);
	notationModel.setNoteValOffset(notationModel.getClefOffset(type));	
	this.clefImg.hide();
	this.clefImg = this.staffPaper.image(this.clefObj.src, this.clefObj.x, 
						this.clefObj.y, this.clefObj.w, this.clefObj.h);
	this.clefImg.show();
}

NotationController.prototype.drawNote = function ()
{
	var pos = randomPos(this.nv.PROPS.numPos),	
		note = this.nv.note(pos, this.nv.staff),
		ledgerLines, ll_path;
	notationModel.setNotePos(pos);
	if (this.noteShow) this.noteImg.hide();
	this.noteImg = this.staffPaper.image(note.src, note.x, note.y, note.w, note.h);
	this.noteImg.show();
	this.noteShow = true;
	if (this.llShow) 
	{
		this.ledgerLineImg.hide();
		this.llShow = false;
	}	
	ledgerLines = this.nv.staff.ledgerLines(pos);
	if (ledgerLines != 0)
	{
		ll_path = this.nv.ledgerLinePath(ledgerLines, note);
		this.ledgerLineImg = this.staffPaper.path(ll_path);
		this.ledgerLineImg.show();
		this.llShow = true;
	}
}

NotationController.prototype.hideNote = function ()
{		
	if (this.llShow) 
	{
		this.ledgerLineImg.hide();
		this.llShow = false;
	}
	if (this.noteShow) this.noteImg.hide();
}

NotationController.prototype.getNoteValue = function ()
{
	return notationModel.getNoteValue();
}

/* @param number num = the number of ledger lines to draw above or below the staff */
NotationController.prototype.setLedgerLines = function (num)
{
	notationModel.setLedgerLines(num);
	this.nv.PROPS.ledgerLines = num;
	this.nv.PROPS.numPos = 11 + 4*num;
	this.nv.staff.setLedgerLines(num);
	this.nv.staff.setNumOfPositions();
}

NotationController.prototype.getLedgerLines = function ()
{
	return notationModel.getLedgerLines();
}

NotationController.prototype.getRandomClefType = function (range, offset)
{
	return notationModel.randomClefType(range, offset);
}

