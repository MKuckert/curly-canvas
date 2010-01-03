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
