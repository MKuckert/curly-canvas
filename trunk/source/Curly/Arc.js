/**
 * Represents an arc of a circle.
 * 
 * @class Curly.Arc
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate
 * @param integer Y coordinate
 * @param integer Radius
 * @param float The start angle
 * @param float The end angle
 * @param boolean Flag if the arc should be drawn counter-clockwise
 */
Curly.Arc=function(x, y, r, sa, ea, acw) {
	Curly.Arc.superclass.constructor.call(this, x, y);
	
	/**
	 * Radius
	 * @property radius
	 * @type integer
	 */
	this.radius=r || 0;
	
	/**
	 * The start angle
	 * @property startAngle
	 * @type float
	 */
	this.startAngle=sa || 0;
	
	/**
	 * The end angle
	 * @property endAngle
	 * @type float
	 */
	this.endAngle=ea===undefined ? Math.PI*2 : ea;
	
	/**
	 * Flag if the arc should be drawn counter-clockwise
	 * @property antiClockwise
	 * @type boolean
	 */
	this.antiClockwise=!!acw;
	
	/** 
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas.
			path(this.x, this.y).
			arc(this.radius, this.startAngle, this.endAngle, this.antiClockwise);
	};
};
Curly.extendClass(Curly.Arc, Curly.Shape);
