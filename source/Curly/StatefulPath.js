/**
 * Extends the path to enable changing of the canvas state and drawing of
 * ancillary Drawable objects.
 * 
 * @class Curly.StatefulPath
 * @extends Curly.Path
 */
/**
 * @constructor
 * @param integer X coordinate of the start point
 * @param integer Y coordinate of the start point
 * @param Curly.Canvas
 */
Curly.StatefulPath=function(x, y, canvas) {
	Curly.StatefulPath.superclass.constructor.apply(this, arguments);
};
Curly.extendClass(Curly.StatefulPath, Curly.Path, {
	/**
	 * Draws the given Drawable element.
	 * 
	 * @return Curly.Path
	 * @param Curly.Drawable
	 */
	add: function(drawable) {
		this.comp.push(drawable);
		return this;
	},
	/**
	 * Overwrites the current canvas state.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas.State|String
	 * @param String
	 */
	setState: function(state, value) {
		if(typeof state==='string') {
			var tmp={};
			tmp[state]=value;
			state=tmp;
		}
		this.comp.push(['overwriteState', state]);
		this.comp.push(['applyState']);
		this.pushPosition(true);
		return this;
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
		
		var self=this;
		var render=function() {
			if(self.drawFill) {
				context.fill();
			}
			if(self.drawStroke) {
				context.stroke();
			}
		};
		
		context.beginPath();
		
		var comp;
		for(var i in this.comp) {
			comp=this.comp[i];
			
			// Copy the array to not modify the original
			var a=[].concat(comp);
			var method=a.shift();
			
			if(method instanceof Curly.Drawable) {
				render();
				context.closePath();
				canvas.draw(method);
				context.beginPath();
			}
			else if(!context[method]) {
				if(!canvas[method]) {
					throw new Curly.Canvas.Error('Method '+method+' not found');
				}
				
				render();
				context.closePath();
				canvas[method].apply(canvas, a);
				context.beginPath();
			}
			else {
				context[method].apply(context, a);
			}
		}
		
		render();
		context.closePath();
		
		return this;
	}
});
