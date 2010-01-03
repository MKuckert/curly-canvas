/**
 * Stellt einen linearen Farbverlauf dar. Der Verlauf wird durch eine Gerade
 * zwischen zwei Punkten (x0, y0) bis (x1, y1) beschrieben.
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
		Ext.apply(this, stops);
		stops=stops.stops;
	}
	Curly.Gradient.Linear.superclass.constructor.call(this, stops);
}
Ext.extend(Curly.Gradient.Linear, Curly.Gradient, {
	/**
	 * @var float X-Position des Startpunktes.
	 */
	x0: 0,
	/**
	 * @var float Y-Position des Startpunktes.
	 */
	y0: 0,
	/**
	 * @var float X-Position des Endpunktes.
	 */
	x1: 1,
	/**
	 * @var float Y-Position des Endpunktes.
	 */
	y1: 1,
	/**
	 * Legt die Position des Endpunktes über die übergebene Geradenlänge und
	 * -winkel relativ zum Startpunkt fest.
	 * 
	 * @return Curly.Gradient.Linear
	 * @param float Länge der Gerade
	 * @param float Winkel der Gerade
	 */
	positionLine: function(length, angle) {
		this.x1=length*Math.sin(angle)+this.x0;
		this.y1=length*Math.cos(angle)+this.y0;
	},
	/**
	 * Erstellt eine Farbverlaufsresource für den übergebenen Render-Context.
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
