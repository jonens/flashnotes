/* This class sets and gets current value(s) associated with the 
	notation area of the screen  */

/* constructor */
NotationModel = function()
{
	this.notePos = 0;
	this.valOffset = 0;
	this.ledgerLines = 0;
	this.noteValue =  -1;
	this.clefType = -1;
	this.clefArray = [cfg.TREBLE, cfg.BASS, cfg.ALTO, cfg.TENOR];
}

NotationModel.prototype.getNoteValue = function() {
	this.noteValue =  this.notePos + (this.valOffset - 2 * this.ledgerLines);
	return this.noteValue;
}

NotationModel.prototype.setClefType = function(ctype) {
	this.clefType = ctype;
	return this;	
}

NotationModel.prototype.getClefType = function() {
	return this.clefType;
}

NotationModel.prototype.setNoteValOffset = function(offset) {
	this.valOffset = offset;
	return this;
}

NotationModel.prototype.getNoteValOffset = function() {
	return this.valOffset;
}

NotationModel.prototype.setNotePos = function(pos) {
	this.notePos = pos;
	return this;
}

NotationModel.prototype.getNotePos = function() {
	return this.notePos;
}

NotationModel.prototype.setLedgerLines = function(num) {
	this.ledgerLines = num;
	return this;
}

NotationModel.prototype.getLedgerLines = function() {
	return this.ledgerLines;
}

NotationModel.prototype.randomClefType = function (range, offset){
	var index = Math.round(Math.random() * 100) % range;
	var type = this.clefArray[index + offset];
	return type;
}

/* Returns a clef type based on a randomly chosen set of clef types
	@param number indices An array of numbers representing indices into the 
	clefArray */
NotationModel.prototype.practiceClefType = function (indices) {
	var clef_types = new Array();
	var index = Math.round(Math.random() * 100) % range;
	var type = this.clefArray[index + offset];
	return type;
}

NotationModel.prototype.getImgUrl = function (type) {	
	switch(type) {		
		case cfg.TREBLE:
			return "images/treble.png";
			break;		
		case cfg.BASS:
			return "images/bass.png";
			break;		
		case cfg.ALTO:
			return "images/c_clef.png";
			break;		
		case cfg.TENOR:
			return "images/c_clef.png";
			break;
		default:			
			return "images/treble.png";
			break;
	}
}

NotationModel.prototype.getClefOffset = function (type) {
	switch(type) {		
		case cfg.TREBLE:
			return cfg.TREBLE_OFFSET;
			break;		
		case cfg.BASS:			
			return cfg.BASS_OFFSET;
			break;
		case cfg.ALTO:			
			return cfg.ALTO_OFFSET;
			break;
		case cfg.TENOR:			
			return cfg.TENOR_OFFSET;
			break;
		default:			
			return cfg.TREBLE_OFFSET;
			break;
	}
}