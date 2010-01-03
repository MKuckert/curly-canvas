var Curly={}
Array.prototype.clone=function(){var clone=[];for(var i=0;i<this.length;i++){if(this[i]instanceof Array){clone.push(this[i].clone());}
else{clone.push(this[i]);}}
return clone;}
Curly.Canvas=function(source){Curly.Canvas.superclass.constructor.call(this);var self=this;var ctx=null;var stateStack=[];this.getCtx=function(){return ctx;}
if(typeof source=='string'){source=document.getElementById(source);if(!source){throw new Curly.Canvas.Error('The given argument is no valid element id');}}
else if(source instanceof Ext.Element){source=source.dom;}
if(source instanceof CanvasRenderingContext2D){ctx=source;}
else if(source instanceof Element&&source.tagName.toLowerCase()=='canvas'){ctx=source.getContext('2d');}
else{throw new Curly.Canvas.Error('The given argument is no valid parameter');}
this.addEvents({beforedraw:true,afterdraw:true});this.xCorrection=0.5;this.yCorrection=0.5;this.useCorrection=true;this.useIntCorrection=false;var determineStyle=function(o){if(o instanceof Curly.Gradient){return o.createGradient(ctx,this);}
else{return o;}}
var setState=function(){var s;if(stateStack.length<=0){s=Curly.Canvas.State.DEFAULTS;stateStack.push(s);}
else{s=stateStack[stateStack.length-1];}
var t=s.transform;if(!Ext.isArray(t)||t.length<6){t=Curly.Canvas.State.IDENTITY_MATRIX;}
ctx.setTransform(t[0],t[1],t[2],t[3],t[4],t[5]);ctx.scale(s.scaleX,s.scaleY);ctx.rotate(s.rotate);var tx=s.translateX,ty=s.translateY;if(self.useCorrection){if(self.useIntCorrection){tx+=parseInt(self.xCorrection);ty+=parseInt(self.yCorrection);}
else{tx+=self.xCorrection;ty+=self.yCorrection;}}
ctx.translate(tx,ty);ctx.globalAlpha=s.alpha;ctx.globalCompositeOperation=s.compositeOperation;ctx.lineWidth=s.lineWidth;ctx.lineCap=s.lineCap;ctx.lineJoin=s.lineJoin;ctx.miterLimit=s.miterLimit;ctx.shadowOffsetX=s.shadowOffsetX;ctx.shadowOffsetY=s.shadowOffsetY;ctx.shadowBlur=s.shadowBlur;ctx.shadowColor=s.shadowColor;ctx.strokeStyle=determineStyle(s.strokeStyle);ctx.fillStyle=determineStyle(s.fillStyle);}
this.getElement=function(){return ctx.canvas;}
this.getWidth=function(){return ctx.canvas.width;}
this.setWidth=function(v){return this.setDimensions([v,this.getHeight()]);}
this.getHeight=function(){return ctx.canvas.height;}
this.setHeight=function(v){return this.setDimensions([this.getWidth(),v]);}
this.getDimensions=function(){return[this.getWidth(),this.getHeight()];}
this.setDimensions=function(dim){var w=dim[0],h=dim[1];var data=ctx.getImageData(0,0,Math.min(this.getWidth(),w),Math.min(this.getHeight(),h));Ext.fly(ctx.canvas).set({width:w,height:h});ctx.putImageData(data,0,0);return this;}
this.globalToLocalX=function(x){return x-Ext.fly(this.getElement()).getX();}
this.globalToLocalY=function(y){return y-Ext.fly(this.getElement()).getY();}
this.globalToLocal=function(ar){return[this.globalToLocalX(ar[0]),this.globalToLocalY(ar[1])];}
this.localToGlobalX=function(x){return x+Ext.fly(this.getElement()).getX();}
this.localToGlobalY=function(y){return y+Ext.fly(this.getElement()).getY();}
this.localToGlobal=function(ar){return[this.localToGlobalX(ar[0]),this.localToGlobalY(ar[1])];}
this.getState=function(){if(stateStack.length<=0){return undefined;}
else{return stateStack[stateStack.length-1];}}
this.pushState=function(state){stateStack.push(state);return this;}
this.popState=function(){return stateStack.pop();}
this.popStates=function(i){if(i===undefined){stateStack=[];}
else{stateStack.splice(stateStack.length-i,i);}
return this;}
this.pushDefaultState=function(){return this.pushState(new Curly.Canvas.State());}
this.applyState=function(){setState();return this;}
this.overwriteState=function(changes){if(typeof changes=='string'){var tmp={}
tmp[changes]=arguments[1];changes=tmp;}
var state=Ext.apply({},changes,this.getState());state=new Curly.Canvas.State(state);this.pushState(state);return this;}
this.getImageData=function(x,y,w,h){if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(w===undefined){w=this.getWidth();}
if(h===undefined){h=this.getHeight();}
return ctx.getImageData(x,y,w,h);}
this.drawImage=function(el,srcX,srcY,srcW,srcH,dstX,dstY,dstW,dstH){var tmp=this.useIntCorrection;this.useIntCorrection=true;this.applyState();ctx.drawImage(el,srcX,srcY,srcW,srcH,dstX,dstY,dstW,dstH);this.useIntCorrection=tmp;this.applyState();}
this.copy=function(data,dstX,dstY,srcX,srcY,srcW,srcH){if(srcX===undefined){srcX=0;}
if(srcY===undefined){srcY=0;}
if(dstX===undefined){dstX=0;}
if(dstY===undefined){dstY=0;}
var isCanvas=(data instanceof Curly.Canvas);var isContext=(data instanceof CanvasRenderingContext2D);if(isCanvas||isContext||data instanceof Element){var elW,elH;if(isCanvas){el=data.getElement();}
else if(isContext){el=data.canvas;}
else{el=data;var fly=Ext.fly(el);elW=fly.getWidth();elH=fly.getHeight();}
if(srcW===undefined){srcW=elW?elW:el.width;}
if(srcH===undefined){srcH=elH?elH:el.height}
this.drawImage(el,srcX,srcY,srcW,srcH,dstX,dstY,srcW,srcH);}
else{if(data.width>this.getWidth()+dstX){throw new Curly.Canvas.Error('The width attribute of the given ImageData is too big');}
else if(data.height>this.getHeight()+dstY){throw new Curly.Canvas.Error('The width attribute of the given ImageData is too big');}
ctx.putImageData(data,dstX,dstY);}
return this;}
this.copyResized=function(data,dstX,dstY,srcX,srcY,dstW,dstH,srcW,srcH){if(srcX===undefined){srcX=0;}
if(srcY===undefined){srcY=0;}
if(dstX===undefined){dstX=0;}
if(dstY===undefined){dstY=0;}
if(dstW===undefined){dstW=this.getWidth();}
if(dstH===undefined){dstH=this.getHeight();}
if(data instanceof Curly.Canvas){el=data.getElement();}
else{el=data.canvas;}
if(srcW===undefined){srcW=el.width;}
if(srcH===undefined){srcH=el.height}
this.drawImage(el,srcX,srcY,srcW,srcH,dstX,dstY,dstW,dstH);return this;}
this.clear=function(){var tmp=this.useCorrection;this.useCorrection=false;setState();ctx.clearRect(0,0,this.getWidth(),this.getHeight());this.useCorrection=tmp;return this;}
this.path=function(x,y){var p=new Curly.Path(x,y);p.canvas=this;return p;}
this.statefulPath=function(x,y){var p=new Curly.StatefulPath(x,y);p.canvas=this;return p;}
this.draw=function(drawable){if(!(drawable instanceof Curly.Drawable)){throw new Curly.Canvas.Error('The given object is no drawable object');}
setState();if(!this.fireEvent('beforedraw',drawable,this)){return this;}
drawable.draw(ctx,this);this.fireEvent('afterdraw',drawable,this);return this;}
this.clip=function(shape){if(!(shape instanceof Curly.Shape)){throw new Curly.Canvas.Error('The given object is no shape object');}
if(!this.fireEvent('beforeclip',shape,this)){return this;}
ctx.restore();ctx.save();var tmp=this.useCorrection;this.useCorrection=false;setState();if(!(shape instanceof Curly.Path)){shape=shape.getPath(this);}
shape.draw(false,false);ctx.clip();this.useCorrection=tmp;setState();this.fireEvent('afterclip',shape,this);return this;}
this.unclip=function(){return this.clip(new Curly.Rectangle(0,0,this.getWidth(),this.getHeight()));}
this.pushDefaultState();}
Ext.extend(Curly.Canvas,Ext.util.Observable);Curly.Canvas.Error=function(msg){this.msg=msg;this.toString=function(){return this.msg;}}
Curly.Canvas.State=function(config){Ext.apply(this,config,Curly.Canvas.State.DEFAULTS);}
Curly.Canvas.State.IDENTITY_MATRIX=[1,0,0,1,0,0];Curly.Canvas.State.OP_SOURCE_OVER='source-over';Curly.Canvas.State.OP_SOURCE_IN='source-in';Curly.Canvas.State.OP_SOURCE_OUT='source-out';Curly.Canvas.State.OP_SOURCE_atop='source-atop';Curly.Canvas.State.OP_DESTINATION_OVER='destination-over';Curly.Canvas.State.OP_DESTINATION_IN='destination-in';Curly.Canvas.State.OP_DESTINATION_OUT='destination-out';Curly.Canvas.State.OP_DESTINATION_atop='destination-atop';Curly.Canvas.State.OP_LIGHTER='lighter';Curly.Canvas.State.OP_COPY='copy';Curly.Canvas.State.OP_XOR='xor';Curly.Canvas.State.CAP_BUTT='butt';Curly.Canvas.State.CAP_ROUND='round';Curly.Canvas.State.CAP_SQUARE='square';Curly.Canvas.State.JOIN_ROUND='round';Curly.Canvas.State.JOIN_BEVEL='bevel';Curly.Canvas.State.JOIN_MITER='miter';Curly.Canvas.State.DEFAULTS={scaleX:1.0,scaleY:1.0,rotate:0,translateX:0,translateY:0,transform:null,compositeOperation:Curly.Canvas.State.OP_SOURCE_OVER,lineWidth:1.0,lineCap:Curly.Canvas.State.CAP_BUTT,lineJoin:Curly.Canvas.State.JOIN_ROUND,miterLimit:10,alpha:1.0,strokeStyle:'black',fillStyle:'black',shadowOffsetX:0.0,shadowOffsetY:0.0,shadowBlur:0.0,shadowColor:'black'};Curly.Canvas.State.COLOR_TRANSPARENT='rgba(0,0,0,0)';Curly.Transparent='rgba(0,0,0,0)';Curly.Drawable=function(x,y){this.x=x||0;this.y=y||0;}
Curly.Drawable=Ext.extend(Curly.Drawable,{drawFill:true,drawStroke:true,getXY:function(){return[this.x,this.x];},moveTo:function(x,y){this.x=x;this.y=y;return this;},draw:function(context,canvas){}});Curly.Shape=function(x,y){Curly.Shape.superclass.constructor.call(this,x,y);}
Ext.extend(Curly.Shape,Curly.Drawable,{getPath:function(canvas){},draw:function(context,canvas){var path=this.getPath(canvas);path.drawFill=this.drawFill;path.drawStroke=this.drawStroke;canvas.draw(path);}});Curly.Path=function(x,y){Curly.Path.superclass.constructor.call(this,x,y);this.comp=[['beginPath']];this.pushPosition();}
Ext.extend(Curly.Path,Curly.Shape,{canvas:null,lastX:-1,lastY:-1,comp:null,close:function(){this.comp.push(['closePath']);return this;},pushPosition:function(forceSave){if(this.lastX!=this.x||this.lastY!=this.y||forceSave){this.comp.push(['moveTo',this.x,this.y]);this.lastX=this.x;this.lastY=this.y;}
return this;},moveTo:function(x,y){Curly.Path.superclass.moveTo.call(this,x,y);this.pushPosition();return this;},setPosition:function(x,y){Curly.Path.superclass.moveTo.call(this,x,y);return this;},lineTo:function(x,y){this.comp.push(['lineTo',x,y]);this.setPosition(x,y);return this;},rect:function(w,h){this.pushPosition();this.comp.push(['rect',this.x,this.y,w,h]);return this;},arcTo:function(x1,y1,r){this.pushPosition();this.comp.push(['arcTo',this.x,this.y,x1,y1,r]);this.moveTo(x1,y1);return this;},arc:function(r,sa,se,acw){this.pushPosition();this.comp.push(['moveTo',this.x+r,this.y]);this.comp.push(['arc',this.x,this.y,r,sa,se,acw]);this.moveTo(this.x+r,this.y);return this;},dot:function(){this.pushPosition();this.comp.push(['fillRect',this.x+0.5,this.y+0.5,1,1]);return this;},quadCurve:function(cpx,cpy,x,y){this.pushPosition();this.comp.push(['quadraticCurveTo',cpx,cpy,x,y]);this.moveTo(x,y);return this;},bezier:function(cp1x,cp1y,cp2x,cp2y,x,y){this.pushPosition();this.comp.push(['bezierCurveTo',cp1x,cp1y,cp2x,cp2y,x,y]);this.moveTo(x,y);return this;},getPath:function(canvas){if(canvas===this.canvas){return this;}
var clone=new this.constructor();clone.canvas=canvas;clone.comp=this.comp.clone();return clone;},draw:function(context,canvas){if(!(canvas instanceof Curly.Canvas)){this.drawFill=!(context===false);this.drawStroke=!(canvas===false);if(this.canvas instanceof Curly.Canvas){canvas=this.canvas;context=canvas.getCtx();}
else{throw new Curly.Canvas.Error('No canvas given');}}
context.beginPath();Ext.each(this.comp,function(comp){var a=[].concat(comp);var method=a.shift();context[method].apply(context,a);},this);if(this.drawFill){context.fill();}
if(this.drawStroke){context.stroke();}
return this;}});Curly.StatefulPath=function(x,y,canvas){Curly.StatefulPath.superclass.constructor.apply(this,arguments);}
Ext.extend(Curly.StatefulPath,Curly.Path,{add:function(drawable){this.comp.push(drawable);return this;},setState:function(state,value){if(typeof state==='string'){var tmp={};tmp[state]=value;state=tmp;}
this.comp.push(['overwriteState',state]);this.comp.push(['applyState']);this.pushPosition(true);return this;},draw:function(context,canvas){if(!(canvas instanceof Curly.Canvas)){this.drawFill=!(context===false);this.drawStroke=!(canvas===false);if(this.canvas instanceof Curly.Canvas){canvas=this.canvas;context=canvas.getCtx();}
else{throw new Curly.Canvas.Error('No canvas given');}}
var self=this;var render=function(){if(self.drawFill){context.fill();}
if(self.drawStroke){context.stroke();}}
context.beginPath();Ext.each(this.comp,function(comp){var a=[].concat(comp);var method=a.shift();if(method instanceof Curly.Drawable){render();context.closePath();canvas.draw(method);context.beginPath();}
else if(!context[method]){if(!canvas[method]){throw new Curly.Canvas.Error('Method '+method+' not found');}
render();context.closePath();canvas[method].apply(canvas,a);context.beginPath();}
else{context[method].apply(context,a);}},this);render();context.closePath();return this;}});Curly.Rectangle=function(x,y,w,h){Curly.Rectangle.superclass.constructor.call(this,x,y);this.w=w||0;this.h=h||0;this.resize=function(w,h){this.w=w;this.h=h;return this;}
this.getPath=function(canvas){return canvas.path(this.x,this.y).rect(this.w,this.h);}}
Ext.extend(Curly.Rectangle,Curly.Shape);Curly.Pixel=function(x,y){Curly.Pixel.superclass.constructor.call(this,x,y);this.getPath=function(canvas){return canvas.path(this.x,this.y).dot();}}
Ext.extend(Curly.Pixel,Curly.Shape);Curly.Bezier=function(x0,y0,x1,y1,cp1x,cp1y,cp2x,cp2y){Curly.Bezier.superclass.constructor.call(this,x0,y0);this.x1=x1||0;this.y1=y1||0;this.cp1x=cp1x||0;this.cp1y=cp1y||0;this.cp2x=cp2x||0;this.cp2y=cp2y||0;this.getPath=function(canvas){return canvas.path(this.x,this.y).bezier(this.cp1x,this.cp1y,this.cp2x,this.cp2y,this.x1,this.y1);}}
Ext.extend(Curly.Bezier,Curly.Shape);Curly.BezierLine=function(x0,y0,x1,y1,cp1x,cp1y,cp2x,cp2y){Curly.BezierLine.superclass.constructor.apply(this,arguments);this.drawFill=false;}
Ext.extend(Curly.BezierLine,Curly.Bezier);Curly.QuadCurve=function(x0,y0,x1,y1,cpx,cpy){Curly.QuadCurve.superclass.constructor.call(this,x0,y0);this.x1=x1||0;this.y1=y1||0;this.cpx=cpx||0;this.cpy=cpy||0;this.getPath=function(canvas){return canvas.path().moveTo(this.x,this.y).quadCurve(this.cpx,this.cpy,this.x1,this.y1);}}
Ext.extend(Curly.QuadCurve,Curly.Shape);Curly.Arc=function(x,y,r,sa,ea,acw){Curly.Arc.superclass.constructor.call(this,x,y);this.radius=r||0;this.startAngle=sa||0;this.endAngle=ea===undefined?Math.PI*2:ea;this.antiClockwise=!!acw;this.getPath=function(canvas){return canvas.path(this.x,this.y).arc(this.radius,this.startAngle,this.endAngle,this.antiClockwise);}}
Ext.extend(Curly.Arc,Curly.Shape);Curly.ArcLine=function(x,y,r,sa,ea,acw){Curly.ArcLine.superclass.constructor.apply(this,arguments);this.drawFill=false;}
Ext.extend(Curly.ArcLine,Curly.Arc);Curly.Gradient=function(stops){this.stops=[];if(Ext.isArray(stops)){Ext.each(stops,function(stop){this.addColorStop(stop.offset,stop.color);},this);}
else if(typeof stops==='object'){this.addColorStop(stops.offset,stops.color);}}
Curly.Gradient.prototype.addColorStop=function(offset,color){this.stops.push({offset:offset,color:color});return this;}
Curly.Gradient.prototype.createGradient=function(context,canvas){throw new Curly.Canvas.Error('Not implemented');}
Curly.Gradient.prototype.applyColorStops=function(gradient){Ext.each(this.stops,function(stop){gradient.addColorStop(stop.offset,stop.color);},this);}
Curly.Gradient.Linear=function(stops){if(typeof stops==='object'){Ext.apply(this,stops);stops=stops.stops;}
Curly.Gradient.Linear.superclass.constructor.call(this,stops);}
Ext.extend(Curly.Gradient.Linear,Curly.Gradient,{x0:0,y0:0,x1:1,y1:1,positionLine:function(length,angle){this.x1=length*Math.sin(angle)+this.x0;this.y1=length*Math.cos(angle)+this.y0;},createGradient:function(context,canvas){var gr=context.createLinearGradient(this.x0,this.y0,this.x1,this.y1);this.applyColorStops(gr);return gr;}});Curly.Gradient.Radial=function(stops){if(typeof stops==='object'){Ext.apply(this,stops);stops=stops.stops;}
Curly.Gradient.Radial.superclass.constructor.call(this,stops);}
Ext.extend(Curly.Gradient.Radial,Curly.Gradient,{x0:0,y0:0,r0:0,x1:0,y1:0,r1:100,createGradient:function(context,canvas){var gr=context.createRadialGradient(this.x0,this.y0,this.r0,this.x1,this.y1,this.r1);this.applyColorStops(gr);return gr;}});Curly.Smiley=function(x,y,config){Curly.Smiley.superclass.constructor.apply(this,arguments);Ext.apply(this,config);}
Ext.extend(Curly.Smiley,Curly.Shape,{mainColor:'yellow',borderColor:'black',getPath:function(canvas){return canvas.statefulPath().setState({lineWidth:1,fillStyle:this.mainColor,strokeStyle:this.borderColor}).add(new Curly.Arc(150,75,50)).setState('fillStyle','black').add(new Curly.Arc(130,60,10)).add(new Curly.Arc(170,60,10)).setState({fillStyle:Curly.Transparent,strokeStyle:'red',lineWidth:2}).add(new Curly.Bezier(120,90,180,90,130,115,170,115)).setState({lineWidth:1});}});