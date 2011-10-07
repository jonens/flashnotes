/** A Staff object */

/** constructor */
Flash.Notes.Staff = function (x, y, w, props){
	this.x = x;
	this.y = y;
	this.w = w;		
	
	//note: ledgerLines applies once above, and once below staff
	this.props = {
		numOfLines: 5,
		space: 18.0,
		ledgerLines: 3,
		numOfPositions: 23
	};
	
	//clef identifiers
	this.TREBLE = 0;
	this.BASS = 1;
	this.ALTO = 2;
	this.TENOR = 3;	
	Merge(this.props, props);	
}

Flash.Notes.Staff.prototype.path = function (){
	var sp = " ";
	var M = "M ";
	var L = "L ";	
	var path = "";	
	var nol = this.getNumOfLines();
	var x = this.x;
	var xx = this.x+this.w;	
	for (var i=0; i<nol; i++)
	{
		var yy = this.y + i*this.getSpace();
		path += M + x + sp + yy + sp + L + xx + sp + yy;
	}
	return path;
}

Flash.Notes.Staff.prototype.getProps = function (){		
	return this.props;
}

Flash.Notes.Staff.prototype.setNumOfLines = function (num){
	this.props.numOfLines = num;
	return this;
}

Flash.Notes.Staff.prototype.setSpace = function (sp){
	this.props.space = sp;
	return this;
}

Flash.Notes.Staff.prototype.setLedgerLines = function (num){
	this.props.ledgerLines = num;
	return this;
}

Flash.Notes.Staff.prototype.setNumOfPositions = function (){
	this.props.numOfPositions = 2 * (this.getNumOfLines + 2*this.getLedgerLines()) + 1;	
	return this;
}

Flash.Notes.Staff.prototype.getNumOfLines = function (){
	return this.props.numOfLines;
}

Flash.Notes.Staff.prototype.getSpace = function (){
	return this.props.space;
}

Flash.Notes.Staff.prototype.getLedgerLines = function (){
	return this.props.ledgerLines;
}

Flash.Notes.Staff.prototype.getNumOfPositions = function (){
	return this.props.numOfPositions;
}

Flash.Notes.Staff.prototype.bottomPos = function (){
	var position = this.y + (((this.getNumOfLines() - 1) + 
						this.getLedgerLines()) * this.getSpace());
	return position;
}

Flash.Notes.Staff.prototype.topPos = function (){
	return this.y - 
		((this.getLedgerLines() + 1) * this.getSpace());
}

Flash.Notes.Staff.prototype.ledgerLines = function (pos){
	var maxPosBelow = 2 * (this.getLedgerLines()) - 1;
	var minPosAbove = 2 * (this.getLedgerLines() + this.getNumOfLines()) + 1;
	var numLedLines = 0;
	if (pos <= maxPosBelow){
		numLedLines = 1 + Math.floor((maxPosBelow - pos)/2);
	}
	if (pos >= minPosAbove){
		numLedLines = -1 - Math.floor((pos - minPosAbove)/2);
	}
	return numLedLines;
}

/** Return the current y-coordinate for the given note position */
Flash.Notes.Staff.prototype.getPosY = function (pos){
	if (pos > (this.getNumOfPositions() - 1)){
		return this.getTopPos();
	}
	if (pos < 0){
		return this.getBottomPos();
	}
	return this.getBottomPos() + (pos*(this.getSpace()/2.0));
}

