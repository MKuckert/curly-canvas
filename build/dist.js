var Curly={};

/**
 * Merges the given object into the object in the first argument.
 * 
 * @return {Object} The resulting object. Same as targetObj
 * @param {Object} targetObj
 * @param {Object} sourceObj
 * @param {Object} sourceObj2
 * ...
 */
Curly.extend=function(targetObj, sourceObj) {
	for(var i=1; i<arguments.length; i++) {
		for(var k in arguments[i]) {
			targetObj[k]=arguments[i][k];
		}
	}
	return targetObj;
};

/**
 * This method enables extending of classes
 * You may provide an implementation of your own framework here
 * 
 * @return {Object} Same as child
 * @param {Object} child The child class
 * @param {Object} parent The parent class
 * @param {Object} methods Methods to extend the child class
 */
Curly.extendClass=function(child, parent, methods) {
	parent.prototype.constructor=parent;
	var extendHelper=function(){};
	extendHelper.prototype=parent.prototype;
	child.prototype=new extendHelper();
	Curly.extend(child.prototype, parent.prototype, methods[i]);
	child.superclass=parent.prototype;
	return child;
};

/**
 * Clones the given array
 * 
 * @return {Array}
 * @param {Array}
 */
Curly.cloneArray=function(ar) {
    var clone=[];
    for(var i=0; i<ar.length; i++) {
        if(ar[i] instanceof Array) {
            clone.push(ar[i].clone());
        }
        else {
            clone.push(ar[i]);
        }
    }
    return clone;
};
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
	};
};
/**
 * @class Curly.Canvas.State
 */
Curly.Canvas.State=function(config) {
	Curly.extend(this, Curly.Canvas.State.DEFAULTS, config||{});
};
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
 * Represents a drawable object. It implements the draw method to perform a draw
 * operation on a canvas object.
 * 
 * @class Curly.Drawable
 */
/**
 * @constructor
 * @param integer X coordinate
 * @param integer Y coordinate
 */
Curly.Drawable=function(x, y) {
	/**
	 * @var integer X coordinate
	 */
	this.x=x || 0;
	
	/**
	 * @var integer Y coordinate
	 */
	this.y=y || 0;
};
Curly.extend(Curly.Drawable, {
	/**
	 * @var boolean Flag, if this object should draw a filling.
	 */
	drawFill: true,
	/**
	 * @var boolean Flag, if this object should draw a border line.
	 */
	drawStroke: true,
	/**
	 * Returns the x and y coordinate of this object as an array.
	 * 
	 * @return Array
	 */
	getXY: function() {
		return [this.x, this.x];
	},
	/**
	 * Sets the x and y coordinate of this object with an array value.
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
	 * Draws this object to the given canvas object
	 * 
	 * @return void
	 * @param CanvasRenderingContext2D
	 * @param Curly.Canvas
	 */
	draw: function(context, canvas) {}
});
/**
 * Represents a drawable object which can be specified by a Curly.Path object.
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
};
Curly.extendClass(Curly.Shape, Curly.Drawable, {
	/** 
	 * Returns this instance as a Curly.Path object. The returned instance has
	 * to be associated with the given canvas object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	getPath: function(canvas) {},
	/**
	 * Draws this object.
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
/**
 * Represents a rectangle.
 * 
 * @class Curly.Rectangle
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate
 * @param integer Y coordinate
 * @param integer Width of this object
 * @param integer Height of this object
 */
Curly.Rectangle=function(x, y, w, h) {
	Curly.Rectangle.superclass.constructor.call(this, x, y);
	
	/**
	 * @var integer Width of this object.
	 */
	this.w=w || 0;
	
	/**
	 * @var integer Height of this object
	 */
	this.h=h || 0;
	
	/**
	 * Sets the current height and width of this object
	 * 
	 * @return Curly.Shape
	 * @param integer
	 * @param integer
	 */
	this.resize=function(w, h) {
		this.w=w;
		this.h=h;
		return this;
	};
	
	/** 
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas.
			path(this.x, this.y).
			rect(this.w, this.h);
	};
};
Curly.extendClass(Curly.Rectangle, Curly.Shape);
/**
 * Represents a single pixel.
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
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path(this.x, this.y)
			.dot();
	};
};
Curly.extendClass(Curly.Pixel, Curly.Shape);
/**
 * Represents as bezier curve
 * 
 * @class Curly.Bezier
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate of the start point
 * @param integer Y coordinate of the start point
 * @param integer X coordinate of the end point
 * @param integer Y coordinate of the end point
 * @param integer X coordinate of the first anchor point
 * @param integer Y coordinate of the first anchor point
 * @param integer X coordinate of the second anchor point
 * @param integer Y coordinate of the second anchor point
 */
Curly.Bezier=function(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {
	Curly.Bezier.superclass.constructor.call(this, x0, y0);
	
	/**
	 * @var integer X coordinate of the end point
	 */
	this.x1=x1 || 0;
	
	/**
	 * @var integer Y coordinate of the end point
	 */
	this.y1=y1 || 0;
	
	/**
	 * @var integer X coordinate of the first anchor point
	 */
	this.cp1x=cp1x || 0;
	
	/**
	 * @var integer Y coordinate of the first anchor point
	 */
	this.cp1y=cp1y || 0;
	
	/**
	 * @var integer X coordinate of the second anchor point
	 */
	this.cp2x=cp2x || 0;
	
	/**
	 * @var integer Y coordinate of the second anchor point
	 */
	this.cp2y=cp2y || 0;
	
	/** 
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path(this.x, this.y)
			.bezier(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x1, this.y1);
	};
};
Curly.extendClass(Curly.Bezier, Curly.Shape);
/**
 * Represents as bezier curve as a single stroke
 * 
 * @class Curly.BezierLine
 * @extends Curly.Bezier
 */
/**
 * @constructor
 * @param integer X coordinate of the start point
 * @param integer Y coordinate of the start point
 * @param integer X coordinate of the end point
 * @param integer Y coordinate of the end point
 * @param integer X coordinate of the first anchor point
 * @param integer Y coordinate of the first anchor point
 * @param integer X coordinate of the second anchor point
 * @param integer Y coordinate of the second anchor point
 */
Curly.BezierLine=function(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y) {
	Curly.BezierLine.superclass.constructor.apply(this, arguments);
	this.drawFill=false;
};
Curly.extendClass(Curly.BezierLine, Curly.Bezier);
/**
 * Represents a quadratic curve
 * 
 * @class Curly.QuadCurve
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate of the start point
 * @param integer Y coordinate of the start point
 * @param integer X coordinate of the end point
 * @param integer Y coordinate of the end point
 * @param integer X coordinate of the anchor point
 * @param integer Y coordinate of the anchor point
 */
Curly.QuadCurve=function(x0, y0, x1, y1, cpx, cpy) {
	Curly.QuadCurve.superclass.constructor.call(this, x0, y0);
	
	/**
	 * @var integer X coordinate of the end point
	 */
	this.x1=x1 || 0;
	
	/**
	 * @var integer Y coordinate of the end point
	 */
	this.y1=y1 || 0;
	
	/**
	 * @var integer X coordinate of the anchor point
	 */
	this.cpx=cpx || 0;
	
	/**
	 * @var integer Y coordinate of the anchor point
	 */
	this.cpy=cpy || 0;
	
	/**
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas
			.path()
			.moveTo(this.x, this.y)
			.quadCurve(this.cpx, this.cpy, this.x1, this.y1);
	};
};
Curly.extendClass(Curly.QuadCurve, Curly.Shape);
/**
 * Represents an arc of a circle.
 * 
 * @class Curly.Arc
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X coordinate
 * @param integer Y coordinate
 * @param integer Radius
 * @param float The start angle
 * @param float The end angle
 * @param boolean Flag if the arc should be drawn counter-clockwise
 */
Curly.Arc=function(x, y, r, sa, ea, acw) {
	Curly.Arc.superclass.constructor.call(this, x, y);
	
	/**
	 * @var integer Radius
	 */
	this.radius=r || 0;
	
	/**
	 * @var float The start angle
	 */
	this.startAngle=sa || 0;
	
	/**
	 * @var float The end angle
	 */
	this.endAngle=ea===undefined ? Math.PI*2 : ea;
	
	/**
	 * @var boolean Flag if the arc should be drawn counter-clockwise
	 */
	this.antiClockwise=!!acw;
	
	/** 
	 * Returns this instance as a Curly.Path object.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	this.getPath=function(canvas) {
		return canvas.
			path(this.x, this.y).
			arc(this.radius, this.startAngle, this.endAngle, this.antiClockwise);
	};
};
Curly.extendClass(Curly.Arc, Curly.Shape);
/**
 * Represents an arc of a circle without a filling.
 * 
 * @class Curly.ArcLine
 * @extends Curly.Arc
 */
/**
 * @constructor
 * @param integer X coordinate
 * @param integer Y coordinate
 * @param integer Radius
 * @param float The start angle
 * @param float The end angle
 * @param boolean Flag if the arc should be drawn counter-clockwise
 */
Curly.ArcLine=function(x, y, r, sa, ea, acw) {
	Curly.ArcLine.superclass.constructor.apply(this, arguments);
	this.drawFill=false;
};
Curly.extendClass(Curly.ArcLine, Curly.Arc);
/**
 * Represents a color gradient
 * 
 * @class Curly.Gradient
 */
/**
 * @constructor
 * @param Array
 */
Curly.Gradient=function(stops) {
	this.stops=[];
	
	if(stops instanceof Array) {
		for(var i=0, n=this.length; i<n; i++) {
			this.addColorStop(stops[i].offset, stops[i].color);
		}
	}
	else if(typeof stops==='object') {
		this.addColorStop(stops.offset, stops.color);
	}
};
/**
 * Adds a color stop to this gradient.
 * 
 * @return Curly.Gradient
 * @param float Position of the color (in the interval [0, 1])
 * @param string The color
 */
Curly.Gradient.prototype.addColorStop=function(offset, color) {
	this.stops.push({offset:offset, color:color});
	return this;
};

/**
 * Creates a gradient object for the given rendering context
 * 
 * @return CanvasGradient
 * @param CanvasRenderingContext2D
 * @param Curly.Canvas
 * @internal
 */
Curly.Gradient.prototype.createGradient=function(context, canvas) {
	throw new Curly.Canvas.Error('Not implemented');
};

/**
 * Adds the color stops of the gradient to the given gradient object.
 * 
 * @return Curly.Gradient
 * @param CanvasGradient
 * @internal
 */
Curly.Gradient.prototype.applyColorStops=function(gradient) {
	for(var i=0, n=this.stops.length; i<n; i++) {
		gradient.addColorStop(this.stops[i].offset, this.stops[i].color);
	}
};
/**
 * Represents a linear color gradient. The gradient is specified by a line with the
 * two points (x0, y0) and (x1, y1)
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
		Curly.extend(this, stops);
		stops=stops.stops;
	}
	Curly.Gradient.Linear.superclass.constructor.call(this, stops);
};
Curly.extendClass(Curly.Gradient.Linear, Curly.Gradient, {
	/**
	 * @var float X coordinate of the start point.
	 */
	x0: 0,
	/**
	 * @var float Y coordinate of the start point.
	 */
	y0: 0,
	/**
	 * @var float X coordinate of the end point.
	 */
	x1: 1,
	/**
	 * @var float Y coordinate of the end point.
	 */
	y1: 1,
	/**
	 * Sets the position of the end point by the given line length and angle
	 * relative to the start point.
	 * 
	 * @return Curly.Gradient.Linear
	 * @param float Length of the line
	 * @param float Angle
	 */
	positionLine: function(length, angle) {
		this.x1=length*Math.sin(angle)+this.x0;
		this.y1=length*Math.cos(angle)+this.y0;
	},
	/**
	 * 
	 * Creates a gradient object for the given rendering context
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
 * Represents a radial color gradient.
 * 
 * @class Curly.Gradient.Radial
 * @extends Curly.Gradient
 */
/**
 * @constructor
 * @param Array
 */
Curly.Gradient.Radial=function(stops) {
	if(typeof stops==='object') {
		Curly.extend(this, stops);
		stops=stops.stops;
	}
	Curly.Gradient.Radial.superclass.constructor.call(this, stops);
};
Curly.extendClass(Curly.Gradient.Radial, Curly.Gradient, {
	/**
	 * @var float X coordinate of the center of the inner circle.
	 */
	x0: 0,
	/**
	 * @var float Y coordinate of the center of the inner circle.
	 */
	y0: 0,
	/**
	 * @var float Radius of the inner circle
	 */
	r0: 0,
	/**
	 * @var float X coordinate of the center of the outer circle.
	 */
	x1: 0,
	/**
	 * @var float Y coordinate of the center of the outer circle.
	 */
	y1: 0,
	/**
	 * @var float Radius of the outer circle
	 */
	r1: 100,
	/**
	 * Creates a gradient object for the given rendering context
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
 * Draws a smiley
 * 
 * @class Curly.Smiley
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 * @param Object Additional configurations
 */
Curly.Smiley=function(x, y, config) {
	Curly.Smiley.superclass.constructor.apply(this, arguments);
	Curly.extend(this, config);
};
Curly.extendClass(Curly.Smiley, Curly.Shape, {
	/**
	 * @var String Main color of the smiley
	 */
	mainColor: 'yellow',
	/**
	 * @var String Color of the border
	 */
	borderColor: 'black',
	/** 
	 * Returns this instance as a Curly.Path object.
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
