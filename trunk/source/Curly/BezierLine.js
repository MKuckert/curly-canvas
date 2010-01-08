/**
 * Represents as bezier curve as a single stroke
 * 
 * @class Curly.BezierLine
 * @extends Curly.Bezier
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
Curly.BezierLine=function(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {
	Curly.BezierLine.superclass.constructor.apply(this, arguments);
	this.drawFill=false;
};
Curly.extendClass(Curly.BezierLine, Curly.Bezier);
