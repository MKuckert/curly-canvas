/**
 * Stellt eine quadratische Kurve dar.
 * 
 * @class Curly.QuadCurve
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position des Startpunktes
 * @param integer Y-Position des Startpunktes
 * @param integer X-Position des Zielpunktes
 * @param integer Y-Position des Zielpunktes
 * @param integer X-Position des Ankerpunktes
 * @param integer Y-Position des Ankerpunktes
 */
Curly.QuadCurve=function(x0, y0, x1, y1, cpx, cpy) {
	Curly.QuadCurve.superclass.constructor.call(this, x0, y0);
	
	/**
	 * @var integer X-Position des Zielpunktes
	 */
	this.x1=x1 || 0;
	
	/**
	 * @var integer Y-Position des Zielpunktes
	 */
	this.y1=y1 || 0;
	
	/**
	 * @var integer X-Position des Ankerpunktes
	 */
	this.cpx=cpx || 0;
	
	/**
	 * @var integer Y-Position des Ankerpunktes
	 */
	this.cpy=cpy || 0;
	
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path()
			.moveTo(this.x, this.y)
			.quadCurve(this.cpx, this.cpy, this.x1, this.y1);
	}
}
Ext.extend(Curly.QuadCurve, Curly.Shape);
