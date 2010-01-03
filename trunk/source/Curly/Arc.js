/**
 * Stellt einen Kreisbogen dar.
 * 
 * @class Curly.Arc
 * @extends Curly.Shape
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
Curly.Arc=function(x, y, r, sa, ea, acw) {
	Curly.Arc.superclass.constructor.call(this, x, y);
	
	/**
	 * @var integer Radius
	 */
	this.radius=r || 0;
	
	/**
	 * @var float Startwinkel
	 */
	this.startAngle=sa || 0;
	
	/**
	 * @var float Endwinkel
	 */
	this.endAngle=ea===undefined ? Math.PI*2 : ea;
	
	/**
	 * @var boolean Flag, ob der Kreisbogen gegen Uhrzeigersinn gezeichnet
	 *  werden soll.
	 */
	this.antiClockwise=!!acw;
	
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas.
			path(this.x, this.y).
			arc(this.radius, this.startAngle, this.endAngle, this.antiClockwise);
	}
}
Ext.extend(Curly.Arc, Curly.Shape);
