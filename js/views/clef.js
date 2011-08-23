/* A Clef object */

/* constructor */
Clef = function(x, y, space, type, src)
{
	var TREBLE = 0;
	var BASS = 1;
	var ALTO = 2;
	var TENOR = 3;
	this.src = src;
	this.x = x + 0.35 * space;
	this.y = y;
	this.h = 0;
	this.w = 0;	
	this.offset = 0;
	switch(type)
	{
		case TREBLE:
			//alert("type TREBLE");
			this.y = y - 1.25 * space;
			this.h = 6.7 * space;
			this.w = 0.4 * this.h;	
			this.offset = 10;
		break;
		case BASS:
			this.h = 3.4 * space;
			this.w = 0.69 * this.h;
			this.offset = 12;
		break;
		case ALTO:
			this.h = 4.0 * space;
			this.w = 0.8 * this.h;
			this.offset = 11;
		break;
		case TENOR:
			this.y = y - space;
			this.h = 4.0 * space;
			this.w = 0.7 * this.h;
			this.offset = 9;
		break;	
	}
}