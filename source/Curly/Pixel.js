/**
 * Stellt einen einzelnen Pixel dar.
 * 
 * @class Curly.Pixel
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 */
Curly.Pixel=function(x, y) {
	Curly.Pixel.superclass.constructor.call(this, x, y);
	
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path(this.x, this.y)
			.dot();
	}
}
Ext.extend(Curly.Pixel, Curly.Shape);
