/**
 * Represents as bezier curve
 * 
 * @class Curly.Bezier
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate of the start point
 * @param integer Y coordinate of the start point
 * @param integer X coordinate of the end point
 * @param integer Y coordinate of the end point
 * @param integer X coordinate of the first anchor point
 * @param integer Y coordinate of the first anchor point
 * @param integer X coordinate of the second anchor point
 * @param integer Y coordinate of the second anchor point
 */
Curly.Bezier=function(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {
	Curly.Bezier.superclass.constructor.call(this, x0, y0);
	
	/**
	 * X coordinate of the end point
	 * @property x1
	 * @type integer
	 */
	this.x1=x1 || 0;
	
	/**
	 * Y coordinate of the end point
	 * @property y1
	 * @type integer
	 */
	this.y1=y1 || 0;
	
	/**
	 * X coordinate of the first anchor point
	 * @property cp1x
	 * @type integer
	 */
	this.cp1x=cp1x || 0;
	
	/**
	 * Y coordinate of the first anchor point
	 * @property cp1y
	 * @type integer
	 */
	this.cp1y=cp1y || 0;
	
	/**
	 * X coordinate of the second anchor point
	 * @property cp2x
	 * @type integer
	 */
	this.cp2x=cp2x || 0;
	
	/**
	 * Y coordinate of the second anchor point
	 * @property cp2y
	 * @type integer
	 */
	this.cp2y=cp2y || 0;
	
	/** 
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path(this.x, this.y)
			.bezier(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x1, this.y1);
	};
};
Curly.extendClass(Curly.Bezier, Curly.Shape);
