/**
 * Represents an arc of a circle without a filling.
 * 
 * @class Curly.ArcLine
 * @extends Curly.Arc
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
Curly.ArcLine=function(x, y, r, sa, ea, acw) {
	Curly.ArcLine.superclass.constructor.apply(this, arguments);
	this.drawFill=false;
};
Curly.extendClass(Curly.ArcLine, Curly.Arc);
