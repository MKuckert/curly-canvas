/**
 * Represents a drawable object. It implements the draw method to perform a draw
 * operation on a canvas object.
 * 
 * @class Curly.Drawable
 */
/**
 * @constructor
 * @param integer X coordinate
 * @param integer Y coordinate
 */
Curly.Drawable=function(x, y) {
	/**
	 * X coordinate
	 * @property x
	 * @type integer
	 */
	this.x=x || 0;
	
	/**
	 * Y coordinate
	 * @property y
	 * @type integer
	 */
	this.y=y || 0;
};
Curly.extendClass(Curly.Drawable, Object, {
	/**
	 * Flag, if this object should draw a filling.
	 * @property drawFill
	 * @type boolean
	 */
	drawFill: true,
	/**
	 * Flag, if this object should draw a border line.
	 * @property drawStroke
	 * @type boolean
	 */
	drawStroke: true,
	/**
	 * Returns the x and y coordinate of this object as an array.
	 * 
	 * @return Array
	 */
	getXY: function() {
		return [this.x, this.x];
	},
	/**
	 * Sets the x and y coordinate of this object with an array value.
	 * 
	 * @return Curly.Drawable
	 * @param integer X-Position
	 * @param integer Y-Position
	 */
	moveTo: function(x, y) {
		this.x=x;
		this.y=y;
		return this;
	},
	/** 
	 * Draws this object to the given canvas object
	 * 
	 * @return void
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	draw: function(context, canvas) {}
});
