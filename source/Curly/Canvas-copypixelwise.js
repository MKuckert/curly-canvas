/**
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
	 * hinzugefügt wird.
	 */
	this.translateX=0.5;
	
	/**
	 * @var float Korrekturverschiebung in Y-Richtung, die für jeden Zustand
	 * hinzugefügt wird.
	 */
	this.translateY=0.5;
	
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
		ctx.translate(s.translateX+self.translateX, s.translateY+self.translateY);
		
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
	 * Kopiert die übergebenen Bilddaten in dieses Bild.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param ImageData|Curly.Canvas|CanvasRenderingContext2D
	 * @param integer X-Koordinate für den Kopieroffset
	 * @param integer Y-Koordinate für den Kopieroffset
	 * @todo Unterstützung für canvas-Element, image-Element und Ext.Element
	 */
	this.copy=function(data, x, y) {
		var xget=0, yget=0, w, h, dataW, dataH;
		if(x===undefined) {
			x=0;
		}
		if(y===undefined) {
			y=0;
		}
		
		// Negative Offsets behandeln
		if(x<0) {
			xget=-x;
			x=0;
		}
		if(y<0) {
			yget=-y;
			y=0;
		}
		
		// Canvas oder RenderingContext
		var isCanvas=(data instanceof Curly.Canvas);
		if(isCanvas || data instanceof CanvasRenderingContext2D) {
			if(isCanvas) {
				dataW=data.getWidth();
				dataH=data.getHeight();
			}
			else {
				dataW=data.canvas.width;
				dataH=data.canvas.height;
			}
			
			var mx=Math.max(x, xget), my=Math.max(y, yget);
			w=Math.min(this.getWidth(),  dataW-mx);
			h=Math.min(this.getHeight(), dataH-my);
			
			// Bilddaten holen
			data=data.getImageData(xget, yget, w, h);
		}
		// ImageData: Maximalgröße validieren
		else {
			if(data.width>this.getWidth()+x) {
				throw new Curly.Canvas.Error('The width attribute of the given ImageData is too big');
			}
			else if(data.height>this.getHeight()+y) {
				throw new Curly.Canvas.Error('The width attribute of the given ImageData is too big');
			}
		}
		
		if(typeof data!=='object') {
			throw new Curly.Canvas.Error('The given argument is invalid');
		}
		
		ctx.putImageData(data, x, y);
		
		return this;
	}
	
	/**
	 * Verwirft alle gezeichneten Daten dieses Canvas.
	 * 
	 * @return Curly.Canvas
	 */
	this.clear=function() {
		ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
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
		return new Curly.Path(x, y, this);
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
	
	this.pushDefaultState();
}
Ext.extend(Curly.Canvas, Ext.util.Observable);
