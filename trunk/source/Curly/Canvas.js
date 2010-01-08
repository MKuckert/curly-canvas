/**
 * @class Curly.Canvas
 */
/**
 * @constructor
 * @param HtmlElement|CanvasRenderingContext2D
 * 
 * Provides methods to work with a canvas 2d rendering context
 * @link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#canvasrenderingcontext2d
 */
Curly.Canvas=function(source) {
	Curly.Canvas.superclass.constructor.call(this);
	
	var self=this;
	var ctx=null;
	var stateStack=[];
	
	/**
	 * Returns the rendering context.
	 * 
	 * @return CanvasRenderingContext2D
	 * @internal
	 */
	this.getCtx=function() {
		return ctx;
	};
	
	if(typeof source=='string') {
		source=document.getElementById(source);
		if(!source) {
			throw new Curly.Canvas.Error('The given argument is no valid element id');
		}
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
	
	// TODO: Refactor Canvas::addEvents
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
	 * @var float Correcting for the x coordinate. Is applied to every canvas state.
	 * This Correction is required for lines with a line thickness of one pixel so the
	 * drawing operation is not blured by the antialiasing.
	 */
	this.xCorrection=0.5;
	
	/**
	 * @var float Correcting for the y coordinate.
	 */
	this.yCorrection=0.5;
	
	/**
	 * @var boolean Flag if the coordinate correction should be applied.
	 */
	this.useCorrection=true;
	
	/**
	 * @var boolean Flag if the coordinate correction should only use integer values.
	 */
	this.useIntCorrection=false;
	
	/**
	 * Returns the drawing style to the given object.
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
	};
	
	/**
	 * Applies the current state to the canvas.
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
		
		// Apply or reset transformation
		var t=s.transform;
		if(!(t instanceof Array) || t.length<6) {
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
	};
	
	/**
	 * Returns the HtmlElement object to the canvas
	 * 
	 * @return HtmlElement
	 */
	this.getElement=function() {
		return ctx.canvas;
	};
	
	/**
	 * Returns the width of the canvas.
	 * 
	 * @return integer
	 */
	this.getWidth=function() {
		return ctx.canvas.width;
	};
	
	/**
	 * Sets the width of the canvas.
	 * 
	 * @return Curly.Canvas
	 * @param integer
	 */
	this.setWidth=function(v) {
		return this.setDimensions([v, this.getHeight()]);
	};
	
	/**
	 * Returns the height of the canvas.
	 * 
	 * @return integer
	 */
	this.getHeight=function() {
		return ctx.canvas.height;
	};
	
	/**
	 * Sets the height of the canvas.
	 * 
	 * @return Curly.Canvas
	 * @param integer
	 */
	this.setHeight=function(v) {
		return this.setDimensions([this.getWidth(), v]);
	};
	
	/**
	 * Returns the dimensions of the canvas as an array.
	 * 
	 * @return Array
	 */
	this.getDimensions=function() {
		return [this.getWidth(), this.getHeight()];
	};
	
	/**
	 * Sets the dimensions of the canvas with an array as value.
	 * 
	 * @return Curly.Canvas
	 * @param Array
	 */
	this.setDimensions=function(dim) {
		var w=dim[0], h=dim[1];
		
		// Store current image data, if available
		var data=null;
		if(ctx.getImageData) {
			data=ctx.getImageData(
				0, 0,
				Math.min(this.getWidth(), w),
				Math.min(this.getHeight(), h)
			);
		}

		// Resize the canvas
		// TODO: Remove Ext.fly
		Ext.fly(ctx.canvas).set({
			width:		w,
			height:		h
		});
		
		// Restore stored image data, if available
		if(data) {
			ctx.putImageData(data, 0, 0);
		}
		
		return this;
	};
	
	// TODO: Improve call: XY-Cache and move-Event
	/**
	 * Converts the given global x coordinate into the local coordinate system.
	 * 
	 * @return integer
	 * @param integer
	 */
	this.globalToLocalX=function(x) {
		// TODO: Remove Ext.fly
		return x-Ext.fly(this.getElement()).getX();
	};
	
	/**
	 * Converts the given global y coordinate into the local coordinate system.
	 * 
	 * @return integer
	 * @param integer
	 */
	this.globalToLocalY=function(y) {
		// TODO: Remove Ext.fly
		return y-Ext.fly(this.getElement()).getY();
	};
	
	/**
	 * Converts the given global coordinate into the local coordinate system.
	 * 
	 * @return Array
	 * @param Array
	 */
	this.globalToLocal=function(ar) {
		return [
			this.globalToLocalX(ar[0]),
			this.globalToLocalY(ar[1])
		];
	};
	
	/**
	 * Converts the given local x coordinate into the global coordinate system.
	 * 
	 * @return integer
	 * @param integer
	 */
	this.localToGlobalX=function(x) {
		// TODO: Remove Ext.fly
		return x+Ext.fly(this.getElement()).getX();
	};
	
	/**
	 * Converts the given local y coordinate into the global coordinate system.
	 * 
	 * @return integer
	 * @param integer
	 */
	this.localToGlobalY=function(y) {
		// TODO: Remove Ext.fly
		return y+Ext.fly(this.getElement()).getY();
	};
	
	/**
	 * Converts the given local coordinate into the global coordinate system.
	 * 
	 * @return Array
	 * @param Array
	 */
	this.localToGlobal=function(ar) {
		return [
			this.localToGlobalX(ar[0]),
			this.localToGlobalY(ar[1])
		];
	};
	
	/**
	 * Returns the current state.
	 * 
	 * @return Curly.Canvas.State or undefined
	 */
	this.getState=function() {
		if(stateStack.length<=0) {
			return undefined;
		}
		else {
			return stateStack[stateStack.length-1];
		}
	};
	
	/**
	 * Adds the given state to the state stack.
	 * 
	 * @return Curly.Canvas
	 * @param Curly.Canvas.State
	 */
	this.pushState=function(state) {
		stateStack.push(state);
		return this;
	};
	
	/**
	 * Removes the current state from the state stack.
	 * 
	 * @return Curly.Canvas.State or undefined if the stack is empty.
	 */
	this.popState=function() {
		return stateStack.pop();
	};
	
	/**
	 * Removes the top i states from the state stack. If no parameter is given the stack will be completely flushed.
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
	};
	
	/**
	 * Adds a default state to the state stack.
	 * 
	 * @return Curly.Canvas
	 * @param Curly.Canvas.State
	 */
	this.pushDefaultState=function() {
		return this.pushState(new Curly.Canvas.State());
	};
	
	/**
	 * Applies the topmost state of the state stack to the canvas.
	 * 
	 * @return Curly.Canvas
	 */
	this.applyState=function() {
		setState();
		return this;
	};
	
	/**
	 * Duplicates the current state and applies the given changes to it. After
	 * that the resulting state is added to the state stack.
	 * 
	 * @return Curly.Canvas
	 * @param Object|String
	 * @param String
	 */
	this.overwriteState=function(changes) {
		if(typeof changes=='string') {
			var tmp={};
			tmp[changes]=arguments[1];
			changes=tmp;
		}
		
		var state={};
		var currentState=this.getState();
		if(currentState!=undefined) {
			Curly.extend(state, currentState[i]);
		}
		
		this.pushState(new Curly.Canvas.State(Curly.extend(state, changes)));
		return this;
	};
	
	/**
	 * Gibt die Bilddaten dieser Zeichenfl�che als ImageData-Objekt zur�ck.
	 * 
	 * @return ImageData
	 * @param integer X-Koordinate f�r die Bilddatenr�ckgabe.
	 * @param integer Y-Koordinate f�r die Bilddatenr�ckgabe.
	 * @param integer Breite der Bilddatenr�ckgabe.
	 * @param integer H�he der Bilddatenr�ckgabe.
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
	};
	
	/**
	 * Zeichnet das �bergebene Element auf dieses Canvas-Element.
	 * 
	 * @return void
	 * @param HtmlImageElement|HtmlCanvasElement|HtmlVideoElement
	 * @param integer Quell-Breite
	 * @param integer Quell-H�he
	 * @param integer Quell-X-Koordinate
	 * @param integer Quell-Y-Koordinate
	 * @param integer Ziel-X-Koordinate
	 * @param integer Ziel-Y-Koordinate
	 * @param integer Ziel-Breite
	 * @param integer Ziel-H�he
	 * @internal
	 */
	this.drawImage=function(el, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
		// Nur Integer-Transformation vornehmen, damit es zu keinen unsch�nen Verschiebungen kommt
		var tmp=this.useIntCorrection;
		this.useIntCorrection=true;
		this.applyState();
		
		ctx.drawImage(el, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
		
		this.useIntCorrection=tmp;
		this.applyState();
	};
	
	/**
	 * Kopiert die �bergebenen Bilddaten in dieses Bild.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param ImageData|Curly.Canvas|CanvasRenderingContext2D
	 * @param integer Ziel-X-Koordinate
	 * @param integer Ziel-Y-Koordinate
	 * @param integer Quell-X-Koordinate
	 * @param integer Quell-Y-Koordinate
	 * @param integer Quell-Breite
	 * @param integer Quell-H�he
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
				elW=el.offsetWidth;
				elH=el.offsetHeight;
			}
			
			if(srcW===undefined) {
				srcW=elW ? elW : el.width;
			}
			if(srcH===undefined) {
				srcH=elH ? elH : el.height;
			}
			
			this.drawImage(
				el,
				srcX, srcY, srcW, srcH,
				dstX, dstY, srcW, srcH
			);
		}
		// ImageData: Validate maximal width
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
	};
	
	/**
	 * Kopiert die �bergebenen Bilddaten skaliert in dieses Bild.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param Curly.Canvas|CanvasRenderingContext2D
	 * @param integer Ziel-X-Koordinate
	 * @param integer Ziel-Y-Koordinate
	 * @param integer Quell-X-Koordinate
	 * @param integer Quell-Y-Koordinate
	 * @param integer Ziel-Breite
	 * @param integer Ziel-H�he
	 * @param integer Quell-Breite
	 * @param integer Quell-H�he
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
			srcH=el.height;
		}
		
		this.drawImage(
			el,
			srcX, srcY, srcW, srcH,
			dstX, dstY, dstW, dstH
		);
		
		return this;
	};
	
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
	};
	
	/**
	 * Erstellt ein neues Pfad-Objekt.
	 * 
	 * @return Curly.Path
	 * @param integer X-Position f�r den Startpunkt des Pfades
	 * @param integer X-Position f�r den Endpunkt des Pfades
	 */
	this.path=function(x, y) {
		var p=new Curly.Path(x, y);
		p.canvas=this;
		return p;
	};
	
	/**
	 * Erstellt ein neues zustands�nderndes Pfad-Objekt.
	 * 
	 * @return Curly.StatefulPath
	 * @param integer X-Position f�r den Startpunkt des Pfades
	 * @param integer X-Position f�r den Endpunkt des Pfades
	 */
	this.statefulPath=function(x, y) {
		var p=new Curly.StatefulPath(x, y);
		p.canvas=this;
		return p;
	};
	
	/**
	 * Zeichnet das �bergebene Objekt auf dieses Canvas-Objekt.
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
	};
	
	/**
	 * Setzt Clipping Region auf die �bergebene Shape-Instanz.
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
		
		shape.draw(false, false);	// false f�r Zeichnen ohne F�llung und Rahmen
		ctx.clip();
		
		this.useCorrection=tmp;
		setState();
		
		this.fireEvent('afterclip', shape, this);
		
		return this;
	};
	
	/**
	 * Weitet Clipping Region auf das gesamte Canvas-Objekt aus.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 */
	this.unclip=function() {
		return this.clip(new Curly.Rectangle(0, 0, this.getWidth(), this.getHeight()));
	};
	
	this.pushDefaultState();
};
