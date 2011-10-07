/* A Note object */

/* constructor */
/*
	@param number x The x-coordinate of the note
	@param number base The y-coordinate of the lowest possible note - corresponds
			to pos = 0 (==Staff.bottomPos);
	@param number pos The current position of the note relative to the staff; each 
			position corresponds to a note name
	@param number space The distance between two adjacent staff lines	
	@param string src The url of the note image   */
Note = function(x, base, pos, space, src)
{
	this.x = x;
	this.y = base - (pos * space/2.0);	
	this.h = space;
	this.w = 1.6 * this.h;
	this.src = src;
}

/*  @param number y - The y-coord of the first ledger line; if dir = -1, y is 
						above top line; if dir = +1, y is below bottom line.
	@param number num - The number of ledger lines to draw.
	@param number dir - The direction to draw ledger lines: -1 = up (above staff),
							+1 = down (below staff) */
Note.prototype.ledgerPath = function(y, num, dir)
{
	var path = "";
	var left = this.x - this.w/4.0;
	var right = this.x + this.w + this.w/4.0;
	//y = dir * y;
	for (var i=0; i < num; i++)
	{
		var yy = y + i * dir * this.h;		
		path += "M " + left + ", " + yy +
					" L " + right + ", " + yy;
	}
	return path;	
}