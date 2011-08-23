/* This class controls the browser output for the Notation area */

/* constructor */
NotationView = function (box_id, w, h){
	this.PROPS = {
		numLines: 5,
		space: 14.0,
		ledgerLines: 1,		
		numPos: 15
	};	
	this.box = new Box(box_id, w, h);
	this.paper = this.box.ctx();
	this.TREBLE = 0;
	this.BASS = 1;
	this.ALTO = 2;
	this.TENOR = 3;
	this.clefArray = [this.TREBLE, this.BASS, this.ALTO, this.TENOR];
	this.RECT_X = 42;
	this.RECT_Y = 0;
	this.RECT_W = w - 42;
	this.RECT_H = (6 + 2 * this.PROPS.ledgerLines + this.PROPS.numLines + 1) * 
						this.PROPS.space;
	this.STAFF_X = this.RECT_X + 10;
	this.STAFF_Y = this.RECT_Y + (4 + this.PROPS.ledgerLines) * this.PROPS.space;
	this.STAFF_W = this.RECT_W - 20;
	this.staff = new Staff(this.STAFF_X, this.STAFF_Y, this.STAFF_W, this.PROPS);	
	this.notePos = -1;
	this.clefType = -1;
	this.valueOffset = -1;
}

/* Return the SVG path (string) for the staff lines */
NotationView.prototype.staffPath = function (){	
	return this.staff.path();	
}

/* Set proerties for this staff.
	@param number type Clef type code
	Note: v_offset is a numerical offset to the current note position
	on the staff so that button-value / note-position matching will have proper
	values based on clef and number of ledger lines  */
NotationView.prototype.clef = function (type){	
	var c;	
	switch(type)
	{
		case this.TREBLE:			
			c = new Clef(this.STAFF_X, this.STAFF_Y, this.PROPS.space, type, 
						"images/treble.png");
			break;
		case this.BASS:
			c = new Clef(this.STAFF_X, this.STAFF_Y, this.PROPS.space, type, 
						"images/bass.png");
			break;
		case this.ALTO:
			c = new Clef(this.STAFF_X, this.STAFF_Y, this.PROPS.space, type, 
						"images/c_clef.png");
			break;
		case this.TENOR:
			c = new Clef(this.STAFF_X, this.STAFF_Y, this.PROPS.space, type, 
						"images/c_clef.png");
			break;
	}	
	return c;
}

NotationView.prototype.randomClefType = function (){
	var index = Math.round(Math.random() * 100) % 4;
	var type = "" + this.clefArray[index];
	return type;
}

NotationView.prototype.note = function (pos, staff){
	var note = new Note((this.STAFF_X + this.STAFF_W/2), 
						staff.bottomPos(),								
						 pos,
						 this.PROPS.space, 
						 "images/whole.png");
	this.pos = pos;
	return note;
}

NotationView.prototype.ledgerLinePath = function (lines, note){				
	var dir = 0;
	var num = Math.abs(lines);
	var path = "";
	if (lines > 0){
		dir = 1;
	}
	if (lines < 0){
		dir = -1;
	}	
	switch (dir)
	{
		case 1:
			path += note.ledgerPath((this.STAFF_Y + 5 * this.PROPS.space), num, dir); 
			break;
		case -1:
			path += note.ledgerPath(this.STAFF_Y - this.PROPS.space, num, dir); //move
			break;
		default:
			break;
	}
	return path;
}


