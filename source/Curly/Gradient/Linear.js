/**
 * Represents a linear color gradient. The gradient is specified by a line with the
 * two points (x0, y0) and (x1, y1)
 * 
 * @class Curly.Gradient.Linear
 * @extends Curly.Gradient
 */
/**
 * @constructor
 * @param Array
 */
Curly.Gradient.Linear=function(stops) {
	if(typeof stops==='object') {
		Curly.extend(this, stops);
		stops=stops.stops;
	}
	Curly.Gradient.Linear.superclass.constructor.call(this, stops);
};
Curly.extendClass(Curly.Gradient.Linear, Curly.Gradient, {
	/**
	 * @var float X coordinate of the start point.
	 */
	x0: 0,
	/**
	 * @var float Y coordinate of the start point.
	 */
	y0: 0,
	/**
	 * @var float X coordinate of the end point.
	 */
	x1: 100,
	/**
	 * @var float Y coordinate of the end point.
	 */
	y1: 100,
	/**
	 * Sets the position of the end point by the given line length and angle
	 * relative to the start point.
	 * 
	 * @return Curly.Gradient.Linear
	 * @param float Length of the line
	 * @param float Angle
	 */
	positionLine: function(length, angle) {
		this.x1=length*Math.sin(angle)+this.x0;
		this.y1=length*Math.cos(angle)+this.y0;
	},
	/**
	 * 
	 * Creates a gradient object for the given rendering context
	 * 
	 * @return CanvasGradient
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	createGradient: function(context, canvas) {
		var gr=context.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
		this.applyColorStops(gr);
		return gr;
	}
});
