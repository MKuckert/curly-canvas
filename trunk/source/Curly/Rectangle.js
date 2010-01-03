/**
 * Stellt ein Rechteck dar.
 * 
 * @class Curly.Rectangle
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 * @param integer Breite des Rechtecks.
 * @param integer Höhe des Rechtecks.
 */
Curly.Rectangle=function(x, y, w, h) {
	Curly.Rectangle.superclass.constructor.call(this, x, y);
	
	/**
	 * @var integer Die Breite dieses Objekt.
	 */
	this.w=w || 0;
	
	/**
	 * @var integer Die Höhe dieses Objekt.
	 */
	this.h=h || 0;
	
	/**
	 * Setzt die aktuelle Breite und Höhe dieses Objektes.
	 * 
	 * @return Curly.Shape
	 * @param integer Breite
	 * @param integer Höhe
	 */
	this.resize=function(w, h) {
		this.w=w;
		this.h=h;
		return this;
	}
	
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas.
			path(this.x, this.y).
			rect(this.w, this.h);
	}
}
Ext.extend(Curly.Rectangle, Curly.Shape);
