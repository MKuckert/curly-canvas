/**
 * Stellt einen Pfad dar, welcher Änderungen am Canvas-Zustand vornehmen und
 * untergeordnete Drawable-Objekte zeichnen kann.
 * 
 * @class Curly.StatefulPath
 * @extends Curly.Path
 */
/**
 * @constructor
 * @param integer X-Position des Startpunktes
 * @param integer Y-Position des Startpunktes
 * @param Curly.Canvas Mit diesem Pfad referenziertes Canvas-Objekt
 */
Curly.StatefulPath=function(x, y, canvas) {
	Curly.StatefulPath.superclass.constructor.apply(this, arguments);
}
Ext.extend(Curly.StatefulPath, Curly.Path, {
	/**
	 * Zeichnet das übergebene Drawable-Element.
	 * 
	 * @return Curly.Path
	 * @param Curly.Drawable
	 */
	add: function(drawable) {
		this.comp.push(drawable);
		return this;
	},
	/**
	 * Überschreibt den aktuellen Canvas-Zustand.
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
	 * Zeichnet dieses Objekt auf den übergebenen Zeichenkontext.
	 * 
	 * @return Curly.Path
	 * @param CanvasRenderingContext2D|boolean Renderkontext oder Flag, ob die
	 *  Füllung gerendert werden soll.
	 * @param Curly.Canvas|boolean Canvas oder Flag, ob die Linie gerendert
	 *  werden soll.
	 * @todo Aufräumen
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
		}
		
		context.beginPath();
		
		Ext.each(this.comp, function(comp) {
			// Array kopieren, um nicht das Original zu ändern
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
		}, this);
		
		render();
		context.closePath();
		
		return this;
	}
});
