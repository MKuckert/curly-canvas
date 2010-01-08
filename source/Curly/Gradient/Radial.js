/**
 * Represents a radial color gradient.
 * 
 * @class Curly.Gradient.Radial
 * @extends Curly.Gradient
 */
/**
 * @constructor
 * @param Array
 */
Curly.Gradient.Radial=function(stops) {
	if(typeof stops==='object') {
		Curly.extend(this, stops);
		stops=stops.stops;
	}
	Curly.Gradient.Radial.superclass.constructor.call(this, stops);
};
Curly.extendClass(Curly.Gradient.Radial, Curly.Gradient, {
	/**
	 * @var float X coordinate of the center of the inner circle.
	 */
	x0: 0,
	/**
	 * @var float Y coordinate of the center of the inner circle.
	 */
	y0: 0,
	/**
	 * @var float Radius of the inner circle
	 */
	r0: 0,
	/**
	 * @var float X coordinate of the center of the outer circle.
	 */
	x1: 0,
	/**
	 * @var float Y coordinate of the center of the outer circle.
	 */
	y1: 0,
	/**
	 * @var float Radius of the outer circle
	 */
	r1: 100,
	/**
	 * Creates a gradient object for the given rendering context
	 * 
	 * @return CanvasGradient
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	createGradient: function(context, canvas) {
		var gr=context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
		this.applyColorStops(gr);
		return gr;
	}
});
