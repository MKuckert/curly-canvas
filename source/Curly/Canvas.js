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
		// Support for excanvas
		if(window.G_vmlCanvasManager) {
			G_vmlCanvasManager.initElement(source);
		}
		
		ctx=source.getContext('2d');
	}
	else {
		throw new Curly.Canvas.Error('The given argument is no valid parameter');
	}
	
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
		ctx.font=s.font;
		ctx.textAlign=s.textAlign;
		ctx.textBaseline=s.textBaseline;
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
		ctx.canvas.width=w;
		ctx.canvas.height=h;
		
		// Restore stored image data, if available
		if(data) {
			ctx.putImageData(data, 0, 0);
		}
		
		return this;
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
	 * @param Integer Number of states to remove
	 */
	this.popState=function(n) {
		var state;
		for(var i=0, n=n||1; i<n; i++) {
			state=stateStack.pop();
		}
		return state;
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
			Curly.extend(state, currentState);
		}
		
		this.pushState(new Curly.Canvas.State(Curly.extend(state, changes)));
		return this;
	};
	
	/**
	 * Returns the image data of this canvas as an ImageData object.
	 * 
	 * @return ImageData
	 * @param integer X coordinate for the image clip. Defaults to 0
	 * @param integer Y coordinate for the image clip. Defaults to 0
	 * @param integer Width of the image clip. Defaults to the full width
	 * @param integer Height of the image clip. Defaults to the full height
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
	 * Draws the given element into the canvas element.
	 * 
	 * @return void
	 * @param HtmlImageElement|HtmlCanvasElement|HtmlVideoElement
	 * @param integer Source width
	 * @param integer Source height
	 * @param integer Source x coordinate
	 * @param integer Source y coordinate
	 * @param integer Target x coordinate
	 * @param integer Target y coordinate
	 * @param integer Target width
	 * @param integer Target height
	 * @internal
	 */
	var drawImage=function(el, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
		var tmp=this.useIntCorrection;
		this.useIntCorrection=true;
		this.applyState();
		
		ctx.drawImage(el, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
		
		this.useIntCorrection=tmp;
		this.applyState();
	};
	
	/**
	 * Copies the given image data into this canvas.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param ImageData|Curly.Canvas|CanvasRenderingContext2D
	 * @param integer Target x coordinate. Defaults to 0
	 * @param integer Target y coordinate. Defaults to 0
	 * @param integer Source x coordinate. Defaults to 0
	 * @param integer Source y coordinate. Defaults to 0
	 * @param integer Source width. Defaults to the width of the element
	 * @param integer Source height. Defaults to the height of the element
	 */
	this.copy=function(data, dstX, dstY, srcX, srcY, srcW, srcH) {
		// set defaults
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
		
		// Canvas or RenderingContext
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
			
			drawImage.call(
				this, el,
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
	 * Copies the given image data scaled into this canvas.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param Curly.Canvas|CanvasRenderingContext2D
	 * @param integer Target x coordinate. Defaults to 0
	 * @param integer Target y coordinate. Defaults to 0
	 * @param integer Source x coordinate. Defaults to 0
	 * @param integer Source y coordinate. Defaults to 0
	 * @param integer Target width. Defaults to the full width
	 * @param integer Target height. Defaults to the full height
	 * @param integer Source width. Defaults to the width of the element
	 * @param integer Source height. Defaults to the height of the element
	 */
	this.copyResized=function(data, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH) {
		// set defaults
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
		
		drawImage.call(
			this, el,
			srcX, srcY, srcW, srcH,
			dstX, dstY, dstW, dstH
		);
		
		return this;
	};
	
	/**
	 * Removes any drawn data from this canvas.
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
	 * Creates a new Path object. It's referenced with this canvas object.
	 * 
	 * @return Curly.Path
	 * @param integer X coordinate for the start point of the path
	 * @param integer Y coordinate for the start point of the path
	 */
	this.path=function(x, y) {
		var p=new Curly.Path(x, y);
		p.canvas=this;
		return p;
	};
	
	/**
	 * Creates a new StatefulPath object. It's referenced with this canvas object.
	 * 
	 * @return Curly.StatefulPath
	 * @param integer X coordinate for the start point of the path
	 * @param integer Y coordinate for the start point of the path
	 */
	this.statefulPath=function(x, y) {
		var p=new Curly.StatefulPath(x, y);
		p.canvas=this;
		return p;
	};
	
	/**
	 * Draws the given Drawable object to this canvas.
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
		drawable.draw(ctx, this);
		
		return this;
	};
	
	/**
	 * Sets the clipping region to the given Shape instance.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 * @param Curly.Shape
	 */
	this.clip=function(shape) {
		if(!(shape instanceof Curly.Shape)) {
			throw new Curly.Canvas.Error('The given object is no shape object');
		}
		
		// Restore old state to remove any actually active clipping region
		ctx.restore();
		ctx.save();
		
		var tmp=this.useCorrection;
		this.useCorrection=false;
		setState();
		
		// Draw the shape
		if(!(shape instanceof Curly.Path)) {
			shape=shape.getPath(this);
		}
		
		shape.draw(false, false);	// false to just apply the path and don't render anything
		ctx.clip();
		
		this.useCorrection=tmp;
		setState();
		
		return this;
	};
	
	/**
	 * Expands the current clipping region to the whole canvas instance.
	 * 
	 * @throws Curly.Canvas.Error
	 * @return Curly.Canvas
	 */
	this.unclip=function() {
		return this.clip(new Curly.Rectangle(0, 0, this.getWidth(), this.getHeight()));
	};
	
	this.pushDefaultState();
};

Curly.extendClass(Curly.Canvas, Object);
