/**
 * Represents a quadratic curve
 * 
 * @class Curly.QuadCurve
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate of the start point
 * @param integer Y coordinate of the start point
 * @param integer X coordinate of the end point
 * @param integer Y coordinate of the end point
 * @param integer X coordinate of the anchor point
 * @param integer Y coordinate of the anchor point
 */
Curly.QuadCurve=function(x0, y0, x1, y1, cpx, cpy) {
	Curly.QuadCurve.superclass.constructor.call(this, x0, y0);
	
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
	 * X coordinate of the anchor point
	 * @property cpx
	 * @type integer
	 */
	this.cpx=cpx || 0;
	
	/**
	 * Y coordinate of the anchor point
	 * @property cpy
	 * @type integer
	 */
	this.cpy=cpy || 0;
	
	/**
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path()
			.moveTo(this.x, this.y)
			.quadCurve(this.cpx, this.cpy, this.x1, this.y1);
	};
};
Curly.extendClass(Curly.QuadCurve, Curly.Shape);
