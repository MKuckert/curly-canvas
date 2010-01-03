/**
 * Stellt eine Bezierkurve als Linie dar.
 * 
 * @class Curly.BezierLine
 * @extends Curly.Bezier
 */
/**
 * @constructor
 * @param integer X-Position des Startpunktes
 * @param integer Y-Position des Startpunktes
 * @param integer X-Position des Zielpunktes
 * @param integer Y-Position des Zielpunktes
 * @param integer X-Position des ersten Ankerpunktes
 * @param integer Y-Position des ersten Ankerpunktes
 * @param integer X-Position des zweiten Ankerpunktes
 * @param integer Y-Position des zweiten Ankerpunktes
 */
Curly.BezierLine=function(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {
	Curly.BezierLine.superclass.constructor.apply(this, arguments);
	this.drawFill=false;
}
Ext.extend(Curly.BezierLine, Curly.Bezier);
