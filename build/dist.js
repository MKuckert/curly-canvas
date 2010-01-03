var Curly={}

Array.prototype.clone=function() {
    var clone=[];
    for(var i=0; i<this.length; i++) {
        if(this[i] instanceof Array) {
            clone.push(this[i].clone());
        }
        else {
            clone.push(this[i]);
        }
    }
    return clone;
}/**
 * @class Curly.Canvas
 */
/**
 * @constructor
 * @param HtmlElement|CanvasRenderingContext2D
 * 
 * Stellt Methoden für den Zugriff auf einen Canvas-Renderingcontext bereit.
 * @link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#canvasrenderingcontext2d
 */
Curly.Canvas=function(source) {
	Curly.Canvas.superclass.constructor.call(this);
	
	var self=this;
	var ctx=null;
	var stateStack=[];
	
	/**
	 * Gibt die Canvas-Renderingcontext-Instanz zurück.
	 * 
	 * @return CanvasRenderingContext2D
	 * @internal
	 */
	this.getCtx=function() {
		return ctx;
	}
	
	if(typeof source=='string') {
		source=document.getElementById(source);
		if(!source) {
			throw new Curly.Canvas.Error('The given argument is no valid element id');
		}
	}
	else if(source instanceof Ext.Element) {
		source=source.dom;
	}
	
	if(source instanceof CanvasRenderingContext2D) {
		ctx=source;
	}
	else if(source instanceof Element && source.tagName.toLowerCase()=='canvas') {
		ctx=source.getContext('2d');
	}
	else {
		throw new Curly.Canvas.Error('The given argument is no valid parameter');
	}
	
	this.addEvents({
		/**
		 * @event beforedraw
		 * @param Curly.Drawable
		 * @param Curly.Canvas
		 */
		beforedraw:		true,
		/**
		 * @event afterdraw
		 * @param Curly.Drawable
		 * @param Curly.Canvas
		 */
		afterdraw:		true
	});
	
	/**
	 * @var float Korrekturverschiebung in X-Richtung, die für jeden Zustand
	 * hinzugefügt wird. Diese Verschiebung wird für Linien mit einer Dicke von
	 * einem Pixel benötigt, damit diese während des Zeichnens auf einer
	 * Koordinate mit ganzzahligem Wert scharf gerendert wird.
	 */
	this.xCorrection=0.5;
	
	/**
	 * @var float Korrekturverschiebung in Y-Richtung, die für jeden Zustand
	 * hinzugefügt wird.
	 */
	this.yCorrection=0.5;
	
	/**
	 * @var boolean Flag, ob die Korrekturverschiebung angewendet werden soll.
	 */
	this.useCorrection=true;
	
	/**
	 * @var boolean Flag, ob die Korrekturverschiebung nur mit
	 *  Integerwerten angewendet werden soll.
	 */
	this.useIntCorrection=false;
	
	/**
	 * Gibt den Zeichenstil zu dem übergebenen Objekt zurück.
	 * 
	 * @return Object
	 * @param Object
	 */
	var determineStyle=function(o) {
		if(o instanceof Curly.Gradient) {
			return o.createGradient(ctx, this);
		}
		else {
			return o;
		}
	}
	
	/**
	 * Überträgt die Daten des aktuellen Zustands auf das Canvas-Objekt.
	 * 
	 * @private
	 */
	var setState=function() {
		var s;
		if(stateStack.length<=0) {
			s=Curly.Canvas.State.DEFAULTS;
			stateStack.push(s);
		}
		else {
			s=stateStack[stateStack.length-1];
		}
		
		// Transformation anwenden oder zurücksetzen
		var t=s.transform;
		if(!Ext.isArray(t) || t.length<6) {
			t=Curly.Canvas.State.IDENTITY_MATRIX;
		}
		ctx.setTransform(t[0], t[1], t[2], t[3], t[4], t[5]);
		
		ctx.scale(s.scaleX, s.scaleY);
		ctx.rotate(s.rotate);
		
		var tx=s.translateX, ty=s.translateY;
		if(self.useCorrection) {
			if(self.useIntCorrection) {
				tx+=parseInt(self.xCorrection);
				ty+=parseInt(self.yCorrection);
			}
			else {
				tx+=self.xCorrection;
				ty+=self.yCorrection;
			}
		}
		
		ctx.translate(tx, ty);
		
		ctx.globalAlpha=s.alpha;
		ctx.globalCompositeOperation=s.compositeOperation;
		ctx.lineWidth=s.lineWidth;
		ctx.lineCap=s.lineCap;
		ctx.lineJoin=s.lineJoin;
		ctx.miterLimit=s.miterLimit;
		ctx.shadowOffsetX=s.shadowOffsetX;
		ctx.shadowOffsetY=s.shadowOffsetY;
		ctx.shadowBlur=s.shadowBlur;
		ctx.shadowColor=s.shadowColor;
		ctx.strokeStyle=determineStyle(s.strokeStyle);
		ctx.fillStyle=determineStyle(s.fillStyle);
		
		// TODO:
		//font;
		//textAlign;
		//textBaseline;
	}
	
	/**
	 * Gibt das HtmlElement-Objekt zu dem Canvas zurück.
	 * 
	 * @return HtmlElement
	 */
	this.getElement=function() {
		return ctx.canvas;
	}
	
	/**
	 * Gibt die Breite des Canvas zurück.
	 * 
	 * @return integer
	 */
	this.getWidth=function() {
		return ctx.canvas.width;
	}
	
	/**
	 * Setzt die Breite des Canvas.
	 * 
	 * @return Curly.Canvas
	 * @param integer
	 */
	this.setWidth=function(v) {
		return this.setDimensions([v, this.getHeight()]);
	}
	
	/**
	 * Gibt die Höhe des Canvas zurück.
	 * 
	 * @return integer
	 */
	this.getHeight=function() {
		return ctx.canvas.height;
	}
	
	/**
	 * Setzt die Höhe des Canvas.
	 * 
	 * @return Curly.Canvas
	 * @param integer
	 */
	this.setHeight=function(v) {
		return this.setDimensions([this.getWidth(), v]);
	}
	
	/**
	 * Gibt die Dimensionen des Canvas als Array zurück.
	 * 
	 * @return Array
	 */
	this.getDimensions=function() {
		return [this.getWidth(), this.getHeight()];
	}
	
	/**
	 * Setzt die Dimensionen des Canvas als Array.
	 * 
	 * @return Curly.Canvas
	 * @param Array
	 */
	this.setDimensions=function(dim) {
		var w=dim[0], h=dim[1];
		
		// Aktuelle Bilddaten sichern
		var data=ctx.getImageData(
			0, 0,
			Math.min(this.getWidth(), w),
			Math.min(this.getHeight(), h)
		);
		
		// Canvas vergrößern
		Ext.fly(ctx.canvas).set({
			width:		w,
			height:		h
		});
		
		// Bilddaten zurückschreiben
		ctx.putImageData(data, 0, 0);
		
		return this;
	}
	
	// Aufrufe optimieren: XY-Cache und auf move-Event reagieren?
	/**
	 * Konvertiert die übergebene globale X-Koordinate in das lokale
	 * Koordinatensystem.
	 * 
	 * @return integer
	 * @param integer
	 */
	this.globalToLocalX=function(x) {
		return x-Ext.fly(this.getElement()).getX();
	}
	
	/**
	 * Konvertiert die übergebene globale Y-Koordinate in das lokale
	 * Koordinatensystem.
	 * 
	 * @return integer
	 * @param integer
	 */
	this.globalToLocalY=function(y) {
		return y-Ext.fly(this.getElement()).getY();
	}
	
	/**
	 * Konvertiert die übergebene globale Koordinate in das lokale
	 * Koordinatensystem.
	 * 
	 * @return Array
	 * @param Array
	 */
	this.globalToLocal=function(ar) {
		return [
			this.globalToLocalX(ar[0]),
			this.globalToLocalY(ar[1])
		];
	}
	
	/**
	 * Konvertiert die übergebene lokale X-Koordinate in das globale
	 * Koordinatensystem.
	 * 
	 * @return integer
	 * @param integer
	 */
	this.localToGlobalX=function(x) {
		return x+Ext.fly(this.getElement()).getX();
	}
	
	/**
	 * Konvertiert die übergebene lokale Y-Koordinate in das globale
	 * Koordinatensystem.
	 * 
	 * @return integer
	 * @param integer
	 */
	this.localToGlobalY=function(y) {
		return y+Ext.fly(this.getElement()).getY();
	}
	
	/**
	 * Konvertiert die übergebene lokale Koordinate in das globale
	 * Koordinatensystem.
	 * 
	 * @return Array
	 * @param Array
	 */
	this.localToGlobal=function(ar) {
		return [
			this.localToGlobalX(ar[0]),
			this.localToGlobalY(ar[1])
		];
	}
	
	/**
	 * Gibt den auf dem Zustandsstapel höchsten Zustand zurück.
	 * 
	 * @return Curly.Canvas.State oder undefined
	 */
	this.getState=function() {
		if(stateStack.length<=0) {
			return undefined;
		}
		else {
			return stateStack[stateStack.length-1];
		}
	}
	
	/**
	 * Fügt dem Zustandsstapel den übergebenen Zustand hinzu.
	 * 
	 * @return Curly.Canvas
	 * @param Curly.Canvas.State
	 */
	this.pushState=function(state) {
		stateStack.push(state);
		return this;
	}
	
	/**
	 * Entfernt den obersten Zustand vom Zustandsstapel.
	 * 
	 * @return Curly.Canvas.State oder undefined wenn der Stapel leer ist.
	 */
	this.popState=function() {
		return stateStack.pop();
	}
	
	/**
	 * Entfernt die obersten i Zustände vom Zustandsstapel. Wird kein Parameter
	 * übergeben, werden alle Zustände entfernt.
	 * 
	 * @return Curly.Canvas
	 * @param integer
	 */
	this.popStates=function(i) {
		if(i===undefined) {
			stateStack=[];
		}
		else {
			stateStack.splice(stateStack.length-i, i);
		}
		
		return this;
	}
	
	/**
	 * Fügt dem Zustandsstapel einen neuen Standard-Zustand hinzu.
	 * 
	 * @return Curly.Canvas
	 * @param Curly.Canvas.State
	 */
	this.pushDefaultState=function() {
		return this.pushState(new Curly.Canvas.State());
	}
	
	/**
	 * Setzt den aktuellen Zustand auf den obersten Zustand vom Zustandsstapel.
	 * 
	 * @return Curly.Canvas
	 */
	this.applyState=function() {
		setState();
		return this;
	}
	
	/**
	 * Dupliziert den aktuellen Zustand, nimmt die übergebenen Änderungen vor
	 * und fügt diesen anschließend dem Zustandsstapel hinzu.
	 * 
	 * @return Curly.Canvas
	 * @param Object|String
	 * @param String
	 */
	this.overwriteState=function(changes) {
		if(typeof changes=='string') {
			var tmp={}
			tmp[changes]=arguments[1];
			changes=tmp;
		}
		var state=Ext.apply({}, changes, this.getState());
		state=new Curly.Canvas.State(state);
		this.pushState(state);
		return this;
	}
	
	/**
	 * Gibt die Bilddaten dieser Zeichenfläche als ImageData-Objekt zurück.
	 * 
	 * @return ImageData
	 * @param integer X-Koordinate für die Bilddatenrückgabe.
	 * @param integer Y-Koordinate für die Bilddatenrückgabe.
	 * @param integer Breite der Bilddatenrückgabe.
	 * @param integer Höhe der Bilddatenrückgabe.
	 */
	this.getImageData=function(x, y, w, h) {
		if(x===undefined) {
			x=0;
		}
		if(y===undefined) {
			y=0;
		}
		if(w===undefined) {
			w=this.getWidth();
		}
		if(h===undefined) {
			h=this.getHeight();
		}
		
		return ctx.getImageData(x, y, w, h);
	}
	
	/**
	 * Zeichnet das übergebene Element auf dieses Canvas-Element.
	 * 
	 * @return void
	 * @param HtmlImageElement|HtmlCanvasElement|HtmlVideoElement
	 * @param integer Quell-Breite
	 * @param integer Quell-Höhe
	 * @param integer Quell-X-Koordinate
	 * @param integer Quell-Y-Koordinate
	 * @param integer Ziel-X-Koordinate
	 * @param integer Ziel-Y-Koordinate
	 * @param integer Ziel-Breite
	 * @param integer Ziel-Höhe
	 * @internal
	 */
	this.drawImage=function(el, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
		// Nur Integer-Transformation vornehmen, damit es zu keinen unschönen Verschiebungen kommt
		var tmp=this.useIntCorrection;
		this.useIntCorrection=true;
		this.applyState();
		
		ctx.drawImage(el, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
		
		this.useIntCorrection=tmp;
		this.applyState();
	}
	
	/**
	 * Kopiert die übergebenen Bilddaten in dieses Bild.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param ImageData|Curly.Canvas|CanvasRenderingContext2D
	 * @param integer Ziel-X-Koordinate
	 * @param integer Ziel-Y-Koordinate
	 * @param integer Quell-X-Koordinate
	 * @param integer Quell-Y-Koordinate
	 * @param integer Quell-Breite
	 * @param integer Quell-Höhe
	 */
	this.copy=function(data, dstX, dstY, srcX, srcY, srcW, srcH) {
		// Standardparameter setzen
		if(srcX===undefined) {
			srcX=0;
		}
		if(srcY===undefined) {
			srcY=0;
		}
		if(dstX===undefined) {
			dstX=0;
		}
		if(dstY===undefined) {
			dstY=0;
		}
		
		// Canvas oder RenderingContext
		var isCanvas=(data instanceof Curly.Canvas);
		var isContext=(data instanceof CanvasRenderingContext2D);
		if(isCanvas || isContext || data instanceof Element) {
			var elW, elH;
			if(isCanvas) {
				el=data.getElement();
			}
			else if(isContext) {
				el=data.canvas;
			}
			else {
				el=data;
				var fly=Ext.fly(el);
				elW=fly.getWidth();
				elH=fly.getHeight();
			}
			
			if(srcW===undefined) {
				srcW=elW ? elW : el.width;
			}
			if(srcH===undefined) {
				srcH=elH ? elH : el.height
			}
			
			this.drawImage(
				el,
				srcX, srcY, srcW, srcH,
				dstX, dstY, srcW, srcH
			);
		}
		// ImageData: Maximalgröße validieren
		else {
			if(data.width>this.getWidth()+dstX) {
				throw new Curly.Canvas.Error('The width attribute of the given ImageData is too big');
			}
			else if(data.height>this.getHeight()+dstY) {
				throw new Curly.Canvas.Error('The width attribute of the given ImageData is too big');
			}
			
			ctx.putImageData(data, dstX, dstY);
		}
		
		return this;
	}
	
	/**
	 * Kopiert die übergebenen Bilddaten skaliert in dieses Bild.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param Curly.Canvas|CanvasRenderingContext2D
	 * @param integer Ziel-X-Koordinate
	 * @param integer Ziel-Y-Koordinate
	 * @param integer Quell-X-Koordinate
	 * @param integer Quell-Y-Koordinate
	 * @param integer Ziel-Breite
	 * @param integer Ziel-Höhe
	 * @param integer Quell-Breite
	 * @param integer Quell-Höhe
	 */
	this.copyResized=function(data, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH) {
		// Standardparameter setzen
		if(srcX===undefined) {
			srcX=0;
		}
		if(srcY===undefined) {
			srcY=0;
		}
		if(dstX===undefined) {
			dstX=0;
		}
		if(dstY===undefined) {
			dstY=0;
		}
		if(dstW===undefined) {
			dstW=this.getWidth();
		}
		if(dstH===undefined) {
			dstH=this.getHeight();
		}
		
		if(data instanceof Curly.Canvas) {
			el=data.getElement();
		}
		else {
			el=data.canvas;
		}
		
		if(srcW===undefined) {
			srcW=el.width;
		}
		if(srcH===undefined) {
			srcH=el.height
		}
		
		this.drawImage(
			el,
			srcX, srcY, srcW, srcH,
			dstX, dstY, dstW, dstH
		);
		
		return this;
	}
	
	/**
	 * Verwirft alle gezeichneten Daten dieses Canvas.
	 * 
	 * @return Curly.Canvas
	 */
	this.clear=function() {
		var tmp=this.useCorrection;
		this.useCorrection=false;
		
		setState();
		ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
		this.useCorrection=tmp;
		
		return this;
	}
	
	/**
	 * Erstellt ein neues Pfad-Objekt.
	 * 
	 * @return Curly.Path
	 * @param integer X-Position für den Startpunkt des Pfades
	 * @param integer X-Position für den Endpunkt des Pfades
	 */
	this.path=function(x, y) {
		var p=new Curly.Path(x, y);
		p.canvas=this;
		return p;
	}
	
	/**
	 * Erstellt ein neues zustandsänderndes Pfad-Objekt.
	 * 
	 * @return Curly.StatefulPath
	 * @param integer X-Position für den Startpunkt des Pfades
	 * @param integer X-Position für den Endpunkt des Pfades
	 */
	this.statefulPath=function(x, y) {
		var p=new Curly.StatefulPath(x, y);
		p.canvas=this;
		return p;
	}
	
	/**
	 * Zeichnet das übergebene Objekt auf dieses Canvas-Objekt.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param Curly.Drawable
	 */
	this.draw=function(drawable) {
		if(!(drawable instanceof Curly.Drawable)) {
			throw new Curly.Canvas.Error('The given object is no drawable object');
		}
		
		setState();
		
		if(!this.fireEvent('beforedraw', drawable, this)) {
			return this;
		}
		
		drawable.draw(ctx, this);
		
		this.fireEvent('afterdraw', drawable, this);
		
		return this;
	}
	
	/**
	 * Setzt Clipping Region auf die übergebene Shape-Instanz.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param Curly.Shape
	 */
	this.clip=function(shape) {
		if(!(shape instanceof Curly.Shape)) {
			throw new Curly.Canvas.Error('The given object is no shape object');
		}
		
		if(!this.fireEvent('beforeclip', shape, this)) {
			return this;
		}
		
		// Alten Zustand wiederherstellen, um Clipping Region zu verwerfen
		ctx.restore();
		ctx.save();
		
		var tmp=this.useCorrection;
		this.useCorrection=false;
		setState();
		
		// Pfad zeichen
		if(!(shape instanceof Curly.Path)) {
			shape=shape.getPath(this);
		}
		
		shape.draw(false, false);	// false für Zeichnen ohne Füllung und Rahmen
		ctx.clip();
		
		this.useCorrection=tmp;
		setState();
		
		this.fireEvent('afterclip', shape, this);
		
		return this;
	}
	
	/**
	 * Weitet Clipping Region auf das gesamte Canvas-Objekt aus.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 */
	this.unclip=function() {
		return this.clip(new Curly.Rectangle(0, 0, this.getWidth(), this.getHeight()));
	}
	
	this.pushDefaultState();
}
Ext.extend(Curly.Canvas, Ext.util.Observable);
/**
 * @class Curly.Canvas.Error
 */
/**
 * @constructor
 * @param string
 */
Curly.Canvas.Error=function(msg) {
	this.msg=msg;
	this.toString=function() {
		return this.msg;
	}
}
/**
 * @class Curly.Canvas.State
 */
Curly.Canvas.State=function(config) {
	Ext.apply(this, config, Curly.Canvas.State.DEFAULTS);
}
Curly.Canvas.State.IDENTITY_MATRIX=[1,0,0,1,0,0];
Curly.Canvas.State.OP_SOURCE_OVER='source-over';
Curly.Canvas.State.OP_SOURCE_IN='source-in';
Curly.Canvas.State.OP_SOURCE_OUT='source-out';
Curly.Canvas.State.OP_SOURCE_atop='source-atop';
Curly.Canvas.State.OP_DESTINATION_OVER='destination-over';
Curly.Canvas.State.OP_DESTINATION_IN='destination-in';
Curly.Canvas.State.OP_DESTINATION_OUT='destination-out';
Curly.Canvas.State.OP_DESTINATION_atop='destination-atop';
Curly.Canvas.State.OP_LIGHTER='lighter';
Curly.Canvas.State.OP_COPY='copy';
Curly.Canvas.State.OP_XOR='xor';
Curly.Canvas.State.CAP_BUTT='butt';
Curly.Canvas.State.CAP_ROUND='round';
Curly.Canvas.State.CAP_SQUARE='square';
Curly.Canvas.State.JOIN_ROUND='round';
Curly.Canvas.State.JOIN_BEVEL='bevel';
Curly.Canvas.State.JOIN_MITER='miter';
Curly.Canvas.State.DEFAULTS={
	scaleX:				1.0,
	scaleY:				1.0,
	rotate:				0,
	translateX:			0,
	translateY:			0,
	transform:			null,
	compositeOperation:	Curly.Canvas.State.OP_SOURCE_OVER,
	lineWidth:			1.0,
	lineCap:			Curly.Canvas.State.CAP_BUTT,
	lineJoin:			Curly.Canvas.State.JOIN_ROUND,
	miterLimit:			10,
	alpha:				1.0,
	strokeStyle:		'black',
	fillStyle:			'black',
	shadowOffsetX:		0.0,
	shadowOffsetY:		0.0,
	shadowBlur:			0.0,
	shadowColor:		'black'
};
Curly.Canvas.State.COLOR_TRANSPARENT='rgba(0,0,0,0)';
Curly.Transparent='rgba(0,0,0,0)';
/**
 * Repräsentiert ein Objekt, welches auf einem Canvas-Objekt gezeichnet werden
 * kann.
 * 
 * @class Curly.Drawable
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 */
Curly.Drawable=function(x, y) {
	/**
	 * @var integer Die aktuelle X-Position dieses Objektes.
	 */
	this.x=x || 0;
	
	/**
	 * @var integer Die aktuelle X-Position dieses Objektes.
	 */
	this.y=y || 0;
}
Curly.Drawable=Ext.extend(Curly.Drawable, {
	/**
	 * @var boolean Flag, ob dieses Objekt eine Füllung zeichnen soll.
	 */
	drawFill: true,
	/**
	 * @var boolean Flag, ob dieses Objekt eine Außenlinie zeichnen soll.
	 */
	drawStroke: true,
	/**
	 * Gibt die aktuelle X- und Y-Position dieses Objektes als Array zurück.
	 * 
	 * @return Array
	 */
	getXY: function() {
		return [this.x, this.x];
	},
	/**
	 * Setzt die aktuelle X- und Y-Position dieses Objektes.
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
	 * Zeichnet dieses Objekt auf den übergebenen Zeichenkontext.
	 * 
	 * @return void
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	draw: function(context, canvas) {}
});
/**
 * Repräsentiert ein Objekt, welches auf einem Canvas-Objekt gezeichnet werden
 * kann und dessen Zeichenpfad als Curly.Path-Objekt ausgedrückt wird.
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
}
Ext.extend(Curly.Shape, Curly.Drawable, {
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück. Die Pfad-Instanz muss
	 * dabei mit dem übergebenen Canvas-Objekt verknüpft werden.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	getPath: function(canvas) {},
	/** 
	 * Zeichnet dieses Objekt auf den übergebenen Zeichenkontext.
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
/**
 * Stellt eine Bezierkurve dar.
 * 
 * @class Curly.Bezier
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position des Startpunktes
 * @param integer Y-Position des Startpunktes
 * @param integer X-Position des Zielpunktes
 * @param integer Y-Position des Zielpunktes
 * @param integer X-Position des ersten Ankerpunktes
 * @param integer Y-Position des ersten Ankerpunktes
 * @param integer X-Position des zweiten Ankerpunktes
 * @param integer Y-Position des zweiten Ankerpunktes
 */
Curly.Bezier=function(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {
	Curly.Bezier.superclass.constructor.call(this, x0, y0);
	
	/**
	 * @var integer X-Position des Zielpunktes
	 */
	this.x1=x1 || 0;
	
	/**
	 * @var integer Y-Position des Zielpunktes
	 */
	this.y1=y1 || 0;
	
	/**
	 * @var integer X-Position des ersten Ankerpunktes
	 */
	this.cp1x=cp1x || 0;
	
	/**
	 * @var integer Y-Position des ersten Ankerpunktes
	 */
	this.cp1y=cp1y || 0;
	
	/**
	 * @var integer X-Position des zweiten Ankerpunktes
	 */
	this.cp2x=cp2x || 0;
	
	/**
	 * @var integer Y-Position des zweiten Ankerpunktes
	 */
	this.cp2y=cp2y || 0;
	
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path(this.x, this.y)
			.bezier(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x1, this.y1);
	}
}
Ext.extend(Curly.Bezier, Curly.Shape);
/**
 * Stellt eine Bezierkurve als Linie dar.
 * 
 * @class Curly.BezierLine
 * @extends Curly.Bezier
 */
/**
 * @constructor
 * @param integer X-Position des Startpunktes
 * @param integer Y-Position des Startpunktes
 * @param integer X-Position des Zielpunktes
 * @param integer Y-Position des Zielpunktes
 * @param integer X-Position des ersten Ankerpunktes
 * @param integer Y-Position des ersten Ankerpunktes
 * @param integer X-Position des zweiten Ankerpunktes
 * @param integer Y-Position des zweiten Ankerpunktes
 */
Curly.BezierLine=function(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {
	Curly.BezierLine.superclass.constructor.apply(this, arguments);
	this.drawFill=false;
}
Ext.extend(Curly.BezierLine, Curly.Bezier);
/**
 * Stellt eine quadratische Kurve dar.
 * 
 * @class Curly.QuadCurve
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position des Startpunktes
 * @param integer Y-Position des Startpunktes
 * @param integer X-Position des Zielpunktes
 * @param integer Y-Position des Zielpunktes
 * @param integer X-Position des Ankerpunktes
 * @param integer Y-Position des Ankerpunktes
 */
Curly.QuadCurve=function(x0, y0, x1, y1, cpx, cpy) {
	Curly.QuadCurve.superclass.constructor.call(this, x0, y0);
	
	/**
	 * @var integer X-Position des Zielpunktes
	 */
	this.x1=x1 || 0;
	
	/**
	 * @var integer Y-Position des Zielpunktes
	 */
	this.y1=y1 || 0;
	
	/**
	 * @var integer X-Position des Ankerpunktes
	 */
	this.cpx=cpx || 0;
	
	/**
	 * @var integer Y-Position des Ankerpunktes
	 */
	this.cpy=cpy || 0;
	
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path()
			.moveTo(this.x, this.y)
			.quadCurve(this.cpx, this.cpy, this.x1, this.y1);
	}
}
Ext.extend(Curly.QuadCurve, Curly.Shape);
/**
 * Stellt einen Kreisbogen dar.
 * 
 * @class Curly.Arc
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 * @param integer Radius des Kreisbogens
 * @param float Startwinkel
 * @param float Endwinkel
 * @param boolean Flag, ob der Kreisbogen gegen Uhrzeigersinn gezeichnet werden
 *  soll.
 */
Curly.Arc=function(x, y, r, sa, ea, acw) {
	Curly.Arc.superclass.constructor.call(this, x, y);
	
	/**
	 * @var integer Radius
	 */
	this.radius=r || 0;
	
	/**
	 * @var float Startwinkel
	 */
	this.startAngle=sa || 0;
	
	/**
	 * @var float Endwinkel
	 */
	this.endAngle=ea===undefined ? Math.PI*2 : ea;
	
	/**
	 * @var boolean Flag, ob der Kreisbogen gegen Uhrzeigersinn gezeichnet
	 *  werden soll.
	 */
	this.antiClockwise=!!acw;
	
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas.
			path(this.x, this.y).
			arc(this.radius, this.startAngle, this.endAngle, this.antiClockwise);
	}
}
Ext.extend(Curly.Arc, Curly.Shape);
/**
 * Stellt einen Kreisbogen ohne Füllung dar.
 * 
 * @class Curly.ArcLine
 * @extends Curly.Arc
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 * @param integer Radius des Kreisbogens
 * @param float Startwinkel
 * @param float Endwinkel
 * @param boolean Flag, ob der Kreisbogen gegen Uhrzeigersinn gezeichnet werden
 *  soll.
 */
Curly.ArcLine=function(x, y, r, sa, ea, acw) {
	Curly.ArcLine.superclass.constructor.apply(this, arguments);
	this.drawFill=false;
}
Ext.extend(Curly.ArcLine, Curly.Arc);
/**
 * @class Curly.Gradient
 * 
 * Stellt einen Farbverlauf dar.
 */
/**
 * @constructor
 * @param Array
 */
Curly.Gradient=function(stops) {
	this.stops=[];
	if(Ext.isArray(stops)) {
		Ext.each(stops, function(stop) {
			this.addColorStop(stop.offset, stop.color);
		}, this);
	}
	else if(typeof stops==='object') {
		this.addColorStop(stops.offset, stops.color);
	}
}
/** 
 * Fügt diesem Farbverlauf eine Farbe hinzu.
 * 
 * @return Curly.Gradient
 * @param float Position der Farbe. Wert zwischen 0 und 1.
 * @param string Farbwert
 */
Curly.Gradient.prototype.addColorStop=function(offset, color) {
	this.stops.push({offset:offset, color:color});
	return this;
}

/**
 * Erstellt eine Farbverlaufsresource für den übergebenen Render-Context.
 * 
 * @return CanvasGradient
 * @param CanvasRenderingContext2D
 * @param Curly.Canvas
 * @internal
 */
Curly.Gradient.prototype.createGradient=function(context, canvas) {
	throw new Curly.Canvas.Error('Not implemented');
}

/**
 * Fügt die Farbpositionen dieses Farbverlaufs der übergebenen Resource hinzu.
 * 
 * @return Curly.Gradient
 * @param CanvasGradient
 * @internal
 */
Curly.Gradient.prototype.applyColorStops=function(gradient) {
	Ext.each(this.stops, function(stop) {
		gradient.addColorStop(stop.offset, stop.color);
	}, this);
}
/**
 * Stellt einen linearen Farbverlauf dar. Der Verlauf wird durch eine Gerade
 * zwischen zwei Punkten (x0, y0) bis (x1, y1) beschrieben.
 * 
 * @class Curly.Gradient.Linear
 * @extends Curly.Gradient
 */
/**
 * @constructor
 * @param Array
 */
Curly.Gradient.Linear=function(stops) {
	if(typeof stops==='object') {
		Ext.apply(this, stops);
		stops=stops.stops;
	}
	Curly.Gradient.Linear.superclass.constructor.call(this, stops);
}
Ext.extend(Curly.Gradient.Linear, Curly.Gradient, {
	/**
	 * @var float X-Position des Startpunktes.
	 */
	x0: 0,
	/**
	 * @var float Y-Position des Startpunktes.
	 */
	y0: 0,
	/**
	 * @var float X-Position des Endpunktes.
	 */
	x1: 1,
	/**
	 * @var float Y-Position des Endpunktes.
	 */
	y1: 1,
	/**
	 * Legt die Position des Endpunktes über die übergebene Geradenlänge und
	 * -winkel relativ zum Startpunkt fest.
	 * 
	 * @return Curly.Gradient.Linear
	 * @param float Länge der Gerade
	 * @param float Winkel der Gerade
	 */
	positionLine: function(length, angle) {
		this.x1=length*Math.sin(angle)+this.x0;
		this.y1=length*Math.cos(angle)+this.y0;
	},
	/**
	 * Erstellt eine Farbverlaufsresource für den übergebenen Render-Context.
	 * 
	 * @return CanvasGradient
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	createGradient: function(context, canvas) {
		var gr=context.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
		this.applyColorStops(gr);
		return gr;
	}
});
/**
 * @class Curly.Gradient.Radial
 * @extends Curly.Gradient
 */
/**
 * @constructor
 * @param Array
 */
Curly.Gradient.Radial=function(stops) {
	if(typeof stops==='object') {
		Ext.apply(this, stops);
		stops=stops.stops;
	}
	Curly.Gradient.Radial.superclass.constructor.call(this, stops);
}
Ext.extend(Curly.Gradient.Radial, Curly.Gradient, {
	/**
	 * @var float X-Position des Mittelpunkt des inneren Kreises.
	 */
	x0: 0,
	/**
	 * @var float Y-Position des Mittelpunkt des inneren Kreises.
	 */
	y0: 0,
	/**
	 * @var float Radius des inneren Kreises.
	 */
	r0: 0,
	/**
	 * @var float X-Position des Mittelpunkt des äußeren Kreises.
	 */
	x1: 0,
	/**
	 * @var float Y-Position des Mittelpunkt des äußeren Kreises.
	 */
	y1: 0,
	/**
	 * @var float Radius des äußeren Kreises.
	 */
	r1: 100,
	/**
	 * Erstellt eine Farbverlaufsresource für den übergebenen Render-Context.
	 * 
	 * @return CanvasGradient
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	createGradient: function(context, canvas) {
		var gr=context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
		this.applyColorStops(gr);
		return gr;
	}
});
/**
 * Zeichnet ein Smiley
 * 
 * @class Curly.Smiley
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 * @param Object Weitere Konfigurationen
 */
Curly.Smiley=function(x, y, config) {
	Curly.Smiley.superclass.constructor.apply(this, arguments);
	Ext.apply(this, config);
}
Ext.extend(Curly.Smiley, Curly.Shape, {
	/**
	 * @var String Hauptfarbe des Smiley
	 */
	mainColor: 'yellow',
	/**
	 * @var String Rahmenfarbe
	 */
	borderColor: 'black',
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	getPath: function(canvas) {
		return canvas.
			statefulPath().
			setState({
				lineWidth:		1,
				fillStyle:		this.mainColor,
				strokeStyle:	this.borderColor
			}).
			add(new Curly.Arc(150, 75, 50)).
			setState('fillStyle', 'black').
			add(new Curly.Arc(130, 60, 10)).
			add(new Curly.Arc(170, 60, 10)).
			setState({
				fillStyle:		Curly.Transparent,
				strokeStyle:	'red',
				lineWidth:		2
			}).
			add(new Curly.Bezier(120, 90, 180, 90, 130, 115, 170, 115)).
			setState({
				lineWidth:		1
			});
	}
});
