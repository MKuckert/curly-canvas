/**
 * Represents a drawable text
 * 
 * @class Curly.Text
 */
/**
 * @constructor
 * @param integer X coordinate
 * @param integer Y coordinate
 * @param string The text to draw
 * @param string Font identifier
 */
Curly.Text=function(x, y, text, font) {
	/**
	 * @param string The text to draw
	 */
	this.text=text+"" || '';
	/**
	 * @var string Font identifier
	 */
	this.font=font+"" || Curly.Canvas.State.DEFAULTS.font;
	
	this.drawStroke=false;
	
	Curly.Text.superclass.constructor.call(this, x, y);
};
Curly.extendClass(Curly.Text, Curly.Drawable, {
	/**
	 * @var integer The maximal width of the text to draw
	 */
	maxWidth: undefined,
	/** 
	 * Draws this object to the given canvas object
	 * 
	 * @return void
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	draw: function(context, canvas) {
		canvas.applyState();
		
		var args=[this.text, this.x, this.y];
		if(this.maxWidth!==undefined) {
			args.push(this.maxWidth);
		}
		if(this.drawFill) {
			context.fillText.apply(context, args);
		}
		if(this.drawStroke) {
			context.strokeText.apply(context, args);
		}
	},
	/**
	 * Measures the width of this object in the given canvas object if rendered.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return float
	 * @param Curly.Canvas
	 */
	measureWidth: function(canvas) {
		if(!(canvas instanceof Curly.Canvas)) {
			throw new Curly.Canvas.Error('Invalid canvas instance given');
		}
		
		return canvas.applyState().
			getCtx().
			measureText(this.text).width;
	}
});
