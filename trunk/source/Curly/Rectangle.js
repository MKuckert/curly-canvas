/**
 * Represents a rectangle.
 * 
 * @class Curly.Rectangle
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate
 * @param integer Y coordinate
 * @param integer Width of this object
 * @param integer Height of this object
 */
Curly.Rectangle=function(x, y, w, h) {
	Curly.Rectangle.superclass.constructor.call(this, x, y);
	
	/**
	 * @var integer Width of this object.
	 */
	this.w=w || 0;
	
	/**
	 * @var integer Height of this object
	 */
	this.h=h || 0;
	
	/**
	 * Sets the current height and width of this object
	 * 
	 * @return Curly.Shape
	 * @param integer
	 * @param integer
	 */
	this.resize=function(w, h) {
		this.w=w;
		this.h=h;
		return this;
	};
	
	/** 
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas.
			path(this.x, this.y).
			rect(this.w, this.h);
	};
};
Curly.extendClass(Curly.Rectangle, Curly.Shape);
