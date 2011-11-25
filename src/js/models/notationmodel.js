/**
 * Flash Notes - a web-based musical flash card game
 * 
 * Copyright Jon Ensminger 2011
 * 
 * Data model class for musical notation.
 */ 

/* constructor */
NotationModel = function()
{
	this.notePos = 0;
	this.valOffset = 0;
	this.ledgerLines = 0;
	this.noteValue =  -1;
	this.clefType = -1;
	this.TREBLE_OFFSET = 10;
	this.BASS_OFFSET = 12;
	this.ALTO_OFFSET = 11;
	this.TENOR_OFFSET = 9;
}

NotationModel.prototype.getNoteValue = function()
{
	this.noteValue =  this.notePos + (this.valOffset - 2*this.ledgerLines);
	return this.noteValue;
}

NotationModel.prototype.setClefType = function(ctype)
{
	this.clefType = ctype;
	return this;	
}

NotationModel.prototype.getClefType = function()
{
	return this.clefType;
}

NotationModel.prototype.setNoteValOffset = function(offset)
{
	this.valOffset = offset;
	return this;
}

NotationModel.prototype.getNoteValOffset = function()
{
	return this.valOffset;
}

NotationModel.prototype.setNotePos = function(pos)
{
	this.notePos = pos;
	return this;
}

NotationModel.prototype.getNotePos = function()
{
	return this.notePos;
}

NotationModel.prototype.setLedgerLines = function(num)
{
	this.ledgerLines = num;
	return this;
}

NotationModel.prototype.getLedgerLines = function()
{
	return this.ledgerLines;
}