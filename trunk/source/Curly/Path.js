/**
 * Represents a drawing path. All operations performed with this path are
 * buffered. Use the draw method to draw the path to a canvas object.
 * 
 * @class Curly.Path
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate of the start point
 * @param integer Y coordinate of the start point
 */
Curly.Path=function(x, y) {
	Curly.Path.superclass.constructor.call(this, x, y);
	this.comp=[['beginPath']];
	this.pushPosition();
};
Curly.extendClass(Curly.Path, Curly.Shape, {
	/**
	 * @var Curly.Canvas The referenced canvas object of this path
	 */
	canvas: null,
	/**
	 * @var integer The last stored X coordinate of this object
	 */
	lastX: -1,
	/**
	 * @var integer The last stored Y coordinate of this object
	 */
	lastY: -1,
	/**
	 * @var array Action stack of this path
	 */
	comp: null,
	/**
	 * Closes the current path
	 * 
	 * @return Curly.Path
	 */
	close: function() {
		this.comp.push(['closePath']);
		return this;
	},
	/**
	 * Adds the current position to the action stack if it's different to the last stored position.
	 * 
	 * @return Curly.Path
	 * @param boolean Path true to force a save operation
	 */
	pushPosition: function(forceSave) {
		if(this.lastX!=this.x || this.lastY!=this.y || forceSave) {
			this.comp.push(['moveTo', this.x, this.y]);
			this.lastX=this.x;
			this.lastY=this.y;
		}
		return this;
	},
	/**
	 * Sets the current x and y coordinates for this object.
	 * 
	 * @return Curly.Path
	 * @param integer X coordinate
	 * @param integer Y coordinate
	 */
	moveTo: function(x, y) {
		Curly.Path.superclass.moveTo.call(this, x ,y);
		this.pushPosition();
		return this;
	},
	/**
	 * Sets the current x and y coordinates for this object without adding it to the action stack
	 * 
	 * @return Curly.Path
	 * @param integer X coordinate
	 * @param integer Y coordinate
	 */
	setPosition: function(x, y) {
		Curly.Path.superclass.moveTo.call(this, x ,y);
		return this;
	},
	/**
	 * Draws a line to the given position.
	 * 
	 * @return Curly.Path
	 * @param float X coordinate of the end point
	 * @param float Y coordinate of the end point
	 */
	lineTo: function(x, y) {
		//this.pushPosition();
		this.comp.push(['lineTo', x, y]);
		this.setPosition(x, y);
		return this;
	},
	/**
	 * Draws a rectangle.
	 * 
	 * @return Curly.Path
	 * @param integer Width of the rectangle
	 * @param integer Height of the rectangle
	 */
	rect: function(w, h) {
		this.pushPosition();
		this.comp.push(['rect', this.x, this.y, w, h]);
		return this;
	},
	/**
	 * Draws an arc of a circle with the given radius relative to the current position
	 * 
	 * @return Curly.Path
	 * @param integer X coordinate of the end point
	 * @param integer Y coordinate of the end point
	 * @param integer Radius
	 */
	arcTo: function(x1, y1, r) {
		this.pushPosition();
		this.comp.push(['arcTo', this.x, this.y, x1, y1, r]);
		this.moveTo(x1, y1);
		return this;
	},
	/**
	 * Draws an arc of a circle with the given radius
	 * 
	 * @return Curly.Path
	 * @param integer Radius
	 * @param float The start angle
	 * @param float The end angle
	 * @param boolean Flag if the arc should be drawn counter-clockwise
	 */
	arc: function(r, sa, se, acw) {
		this.pushPosition();
		this.comp.push(['moveTo', this.x+r, this.y]);
		this.comp.push(['arc', this.x, this.y, r, sa, se, acw]);
		this.moveTo(this.x+r, this.y);
		return this;
	},
	/**
	 * Draws a single pixel.
	 * 
	 * @return Curly.Path
	 */
	dot: function() {
		this.pushPosition();
		// +0.5 to draw the pixel correctly
		// TODO: Needed with Canvas.x/yCorrection??
		this.comp.push(['fillRect', this.x+0.5, this.y+0.5, 1, 1]);
		return this;
	},
	/**
	 * Draws a quadratic curve.
	 * 
	 * @return Curly.Path
	 * @param integer X coordinate of the anchor point
	 * @param integer Y coordinate of the anchor point
	 * @param integer X coordinate of the end point
	 * @param integer Y coordinate of the end point
	 */
	quadCurve: function(cpx, cpy, x, y) {
		this.pushPosition();
		this.comp.push(['quadraticCurveTo', cpx, cpy, x, y]);
		this.moveTo(x, y);
		return this;
	},
	/**
	 * Draws a bezier curve.
	 * 
	 * @return Curly.Path
	 * @param integer X coordinate of the first anchor point
	 * @param integer Y coordinate of the first anchor point
	 * @param integer X coordinate of the second anchor point
	 * @param integer Y coordinate of the second anchor point
	 * @param integer X coordinate of the end point
	 * @param integer Y coordinate of the end point
	 */
	bezier: function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.pushPosition();
		this.comp.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
		this.moveTo(x, y);
		return this;
	},
	/**
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	getPath: function(canvas) {
		if(canvas===this.canvas) {
			return this;
		}
		
		var clone=new this.constructor();
		clone.canvas=canvas;
		clone.comp=Curly.cloneArray(this.comp);
		return clone;
	},
	/** 
	 * Draws this object.
	 * 
	 * @return Curly.Path
	 * @param CanvasRenderingContext2D|boolean Rendering context or a Flag if a
	 *  filling should be rendered
	 * @param Curly.Canvas|boolean Canvas or Flag if a stroke should be rendered.
	 * @todo Clean this up
	 */
	draw: function(context, canvas) {
		if(!(canvas instanceof Curly.Canvas)) {
			this.drawFill=!(context===false);
			this.drawStroke=!(canvas===false);
			
			if(this.canvas instanceof Curly.Canvas) {
				canvas=this.canvas;
				context=canvas.getCtx();
			}
			else {
				throw new Curly.Canvas.Error('No canvas given');
			}
		}
		
		context.beginPath();
		
		for(var i in this.comp) {
			// Copy the array to not modify the original
			var a=[].concat(this.comp[i]);
			var method=a.shift();
			
			context[method].apply(context, a);
		}
		
		if(this.drawFill) {
			context.fill();
		}
		if(this.drawStroke) {
			context.stroke();
		}
		
		return this;
	}
});

