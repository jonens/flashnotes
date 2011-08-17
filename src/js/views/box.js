/*
	A box for drawing  - built on the Raphael.js library.
*/

/* constructor */
Box = function (box_id, w, h){	
	if(arguments.length > 0 ){
		this.init (box_id, w, h);	
	}
}

Box.prototype.init = function (box_id, w, h){	
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

Box.prototype.ctx = function(){	
	return this.paper;
}

Box.prototype.setStrokeColor = function (color){
	this.attributes.stroke = color;
	return this;
}

Box.prototype.setStrokeWidth = function (width){
	this.attributes.stroke_width = width;
	return this;
}

Box.prototype.setFill = function (color){
	this.attributes.fill = color;
	return this;
}

Box.prototype.fillRect = function (x, y, width, height){
	if (height < 0){
		y += height;
		height = -height;
	}	
	this.rectangle = this.paper.rect(x, y, width, height).attr(this.attributes);
	return this;
}

Box.prototype.getRect = function (){
	return this.rectangle;
}