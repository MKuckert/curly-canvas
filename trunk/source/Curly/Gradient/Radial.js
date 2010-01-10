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
		if(stops.x) {
			stops.x0=stops.x1=stops.x;
			delete stops.x;
		}
		if(stops.y) {
			stops.y0=stops.y1=stops.y;
			delete stops.y;
		}
		if(stops.r) {
			stops.r1=stops.r;
			delete stops.r;
		}
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
