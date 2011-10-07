/**
	A box for drawing  - built on the Raphael.js library.
*/

/** constructor */
Flash.Notes.Box = function (box_id, w, h){	
	if(arguments.length > 0 ){
		this.init (box_id, w, h);	
	}
}

Flash.Notes.Box.prototype.init = function (box_id, w, h){	
	this.x = document.getElementById(box_id).getAttribute('left');
	this.y = document.getElementById(box_id).getAttribute('top');;
	this.width = w;
	this.height = h;
	this.rectangle;
	this.paper = Raphael(box_id, this.width, this.height);
	this.attributes = 	{
		"stroke_width": 0.0,
		"fill": "beige",
		"stroke": "beige"		
	};
	this.bg_attributes = {
		"stroke_width": 0.0,
		"fill": "white",
		"stroke": "white"	
	};	
}

Flash.Notes.Box.prototype.ctx = function(){	
	return this.paper;
}

Flash.Notes.Box.prototype.setStrokeColor = function (color){
	this.attributes.stroke = color;
	return this;
}

Flash.Notes.Box.prototype.setStrokeWidth = function (width){
	this.attributes.stroke_width = width;
	return this;
}

Flash.Notes.Box.prototype.setFill = function (color){
	this.attributes.fill = color;
	return this;
}

Flash.Notes.Box.prototype.fillRect = function (x, y, width, height){
	if (height < 0){
		y += height;
		height = -height;
	}	
	this.rectangle = this.paper.rect(x, y, width, height).attr(this.attributes);
	return this;
}

Flash.Notes.Box.prototype.getRect = function (){
	return this.rectangle;
}