/**
 * @class Curly.Gradient.Radial
 * @extends Curly.Gradient
 */
/**
 * @constructor
 * @param Array
 */
Curly.Gradient.Radial=function(stops) {
	if(typeof stops==='object') {
		Ext.apply(this, stops);
		stops=stops.stops;
	}
	Curly.Gradient.Radial.superclass.constructor.call(this, stops);
}
Ext.extend(Curly.Gradient.Radial, Curly.Gradient, {
	/**
	 * @var float X-Position des Mittelpunkt des inneren Kreises.
	 */
	x0: 0,
	/**
	 * @var float Y-Position des Mittelpunkt des inneren Kreises.
	 */
	y0: 0,
	/**
	 * @var float Radius des inneren Kreises.
	 */
	r0: 0,
	/**
	 * @var float X-Position des Mittelpunkt des äußeren Kreises.
	 */
	x1: 0,
	/**
	 * @var float Y-Position des Mittelpunkt des äußeren Kreises.
	 */
	y1: 0,
	/**
	 * @var float Radius des äußeren Kreises.
	 */
	r1: 100,
	/**
	 * Erstellt eine Farbverlaufsresource für den übergebenen Render-Context.
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
