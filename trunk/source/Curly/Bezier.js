/**
 * Stellt eine Bezierkurve dar.
 * 
 * @class Curly.Bezier
 * @extends Curly.Shape
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
Curly.Bezier=function(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {
	Curly.Bezier.superclass.constructor.call(this, x0, y0);
	
	/**
	 * @var integer X-Position des Zielpunktes
	 */
	this.x1=x1 || 0;
	
	/**
	 * @var integer Y-Position des Zielpunktes
	 */
	this.y1=y1 || 0;
	
	/**
	 * @var integer X-Position des ersten Ankerpunktes
	 */
	this.cp1x=cp1x || 0;
	
	/**
	 * @var integer Y-Position des ersten Ankerpunktes
	 */
	this.cp1y=cp1y || 0;
	
	/**
	 * @var integer X-Position des zweiten Ankerpunktes
	 */
	this.cp2x=cp2x || 0;
	
	/**
	 * @var integer Y-Position des zweiten Ankerpunktes
	 */
	this.cp2y=cp2y || 0;
	
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path(this.x, this.y)
			.bezier(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x1, this.y1);
	}
}
Ext.extend(Curly.Bezier, Curly.Shape);
