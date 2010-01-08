/**
 * Represents a single pixel.
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
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path(this.x, this.y)
			.dot();
	};
};
Curly.extendClass(Curly.Pixel, Curly.Shape);
