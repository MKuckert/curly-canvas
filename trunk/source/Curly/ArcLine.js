/**
 * Stellt einen Kreisbogen ohne Füllung dar.
 * 
 * @class Curly.ArcLine
 * @extends Curly.Arc
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 * @param integer Radius des Kreisbogens
 * @param float Startwinkel
 * @param float Endwinkel
 * @param boolean Flag, ob der Kreisbogen gegen Uhrzeigersinn gezeichnet werden
 *  soll.
 */
Curly.ArcLine=function(x, y, r, sa, ea, acw) {
	Curly.ArcLine.superclass.constructor.apply(this, arguments);
	this.drawFill=false;
}
Ext.extend(Curly.ArcLine, Curly.Arc);
