/**
 * Represents a drawable object which can be specified by a Curly.Path object.
 * 
 * @class Curly.Shape
 * @extends Curly.Drawable
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 */
Curly.Shape=function(x, y) {
	Curly.Shape.superclass.constructor.call(this, x, y);
};
Curly.extendClass(Curly.Shape, Curly.Drawable, {
	/** 
	 * Returns this instance as a Curly.Path object. The returned instance has
	 * to be associated with the given canvas object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	getPath: function(canvas) {},
	/**
	 * Draws this object.
	 * 
	 * @return void
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	draw: function(context, canvas) {
		var path=this.getPath(canvas);
		path.drawFill=this.drawFill;
		path.drawStroke=this.drawStroke;
		canvas.draw(path);
	}
});
