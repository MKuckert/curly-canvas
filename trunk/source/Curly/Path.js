/**
 * Stellt einen zu Objektpfad dar.
 * 
 * @class Curly.Path
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position des Startpunktes
 * @param integer Y-Position des Startpunktes
 */
Curly.Path=function(x, y) {
	Curly.Path.superclass.constructor.call(this, x, y);
	this.comp=[['beginPath']];
	this.pushPosition();
}
Ext.extend(Curly.Path, Curly.Shape, {
	/**
	 * @var Curly.Canvas Mit diesem Pfad referenziertes Canvas-Objekt
	 */
	canvas: null,
	/**
	 * @var integer Die letzte gespeicherte X-Position dieses Objektes.
	 */
	lastX: -1,
	/**
	 * @var integer Die letzte gespeicherte X-Position dieses Objektes.
	 */
	lastY: -1,
	/**
	 * @var array Aktions-Stack dieses Pfades
	 */
	comp: null,
	/**
	 * Schließt den aktuellen Pfad.
	 * 
	 * @return Curly.Path
	 */
	close: function() {
		this.comp.push(['closePath']);
		return this;
	},
	/**
	 * Fügt die aktuelle Position auf den Objekt-Stack, wenn sich diese von der
	 * letzten gespeicherten Position unterscheidet.
	 * 
	 * @return Curly.Path
	 * @param boolean Flag, um eine Speicherung zu provozieren
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
	 * Setzt die aktuelle X- und Y-Position dieses Objektes.
	 * 
	 * @return Curly.Path
	 * @param integer X-Position
	 * @param integer Y-Position
	 */
	moveTo: function(x, y) {
		Curly.Path.superclass.moveTo.call(this, x ,y);
		this.pushPosition();
		return this;
	},
	/**
	 * Setzt die aktuelle X- und Y-Position dieses Objektes ohne dies auf den
	 * Pfadstack zu legen.
	 * 
	 * @return Curly.Path
	 * @param integer X-Position
	 * @param integer Y-Position
	 */
	setPosition: function(x, y) {
		Curly.Path.superclass.moveTo.call(this, x ,y);
		return this;
	},
	/**
	 * Zeichnet eine Linie zu der übergebenen Position.
	 * 
	 * @return Curly.Path
	 * @param float X-Position des Zielpunktes
	 * @param float Y-Position des Zielpunktes
	 */
	lineTo: function(x, y) {
		//this.pushPosition();
		this.comp.push(['lineTo', x, y]);
		this.setPosition(x, y);
		return this;
	},
	/**
	 * Zeichnet ein Rechteck.
	 * 
	 * @return Curly.Path
	 * @param integer Breite des Rechtecks.
	 * @param integer Höhe des Rechtecks.
	 */
	rect: function(w, h) {
		this.pushPosition();
		this.comp.push(['rect', this.x, this.y, w, h]);
		return this;
	},
	/**
	 * Zeichnet einen Kreisbogen mit dem übergebenen Radius relativ zu der
	 * aktuellen Position.
	 * 
	 * @return Curly.Path
	 * @param integer X-Position für den Endpunkt
	 * @param integer Y-Position für den Endpunkt
	 * @param integer Radius des Kreisbogens
	 */
	arcTo: function(x1, y1, r) {
		this.pushPosition();
		this.comp.push(['arcTo', this.x, this.y, x1, y1, r]);
		this.moveTo(x1, y1);
		return this;
	},
	/**
	 * Zeichnet einen Kreisbogen mit dem übergebenen Radius.
	 * 
	 * @return Curly.Path
	 * @param integer Radius des Kreisbogens
	 * @param float Startwinkel
	 * @param float Endwinkel
	 * @param boolean Flag, ob der Kreisbogen gegen Uhrzeigersinn gezeichnet werden
	 *  soll.
	 */
	arc: function(r, sa, se, acw) {
		this.pushPosition();
		this.comp.push(['moveTo', this.x+r, this.y]);
		this.comp.push(['arc', this.x, this.y, r, sa, se, acw]);
		this.moveTo(this.x+r, this.y);
		return this;
	},
	/**
	 * Zeichnet einen einzelnen Pixel an die aktuelle Position.
	 * 
	 * @return Curly.Path
	 */
	dot: function() {
		this.pushPosition();
		// +0.5 damit der Pixel korrekt gezeichnet wird
		this.comp.push(['fillRect', this.x+0.5, this.y+0.5, 1, 1]);
		return this;
	},
	/**
	 * Zeichnet eine quadratische Kurve.
	 * 
	 * @return Curly.Path
	 * @param integer X-Position des Ankerpunktes
	 * @param integer Y-Position des Ankerpunktes
	 * @param integer X-Position des Zielpunktes
	 * @param integer Y-Position des Zielpunktes
	 */
	quadCurve: function(cpx, cpy, x, y) {
		this.pushPosition();
		this.comp.push(['quadraticCurveTo', cpx, cpy, x, y]);
		this.moveTo(x, y);
		return this;
	},
	/**
	 * Zeichnet eine Bezierkurve.
	 * 
	 * @return Curly.Path
	 * @param integer X-Position des ersten Ankerpunktes
	 * @param integer Y-Position des ersten Ankerpunktes
	 * @param integer X-Position des zweiten Ankerpunktes
	 * @param integer Y-Position des zweiten Ankerpunktes
	 * @param integer X-Position des Zielpunktes
	 * @param integer Y-Position des Zielpunktes
	 */
	bezier: function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.pushPosition();
		this.comp.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
		this.moveTo(x, y);
		return this;
	},
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück. Die Pfad-Instanz muss
	 * dabei mit dem übergebenen Canvas-Objekt verknüpft werden.
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
		clone.comp=this.comp.clone();
		return clone;
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
		
		context.beginPath();
		
		Ext.each(this.comp, function(comp) {
			// Array kopieren, um nicht das Original zu ändern
			var a=[].concat(comp);
			var method=a.shift();
			
			context[method].apply(context, a);
		}, this);
		
		if(this.drawFill) {
			context.fill();
		}
		if(this.drawStroke) {
			context.stroke();
		}
		
		return this;
	}
});
