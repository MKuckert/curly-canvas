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
		for(var i=0, n=stops.length; i<n; i++) {
			this.addColorStop(stops[i][0], stops[i][1]);
		}
	}
	else if(typeof stops==='object') {
		this.addColorStop(stops[0], stops[1]);
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
	this.stops.push([offset, color]);
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
		gradient.addColorStop(this.stops[i][0], this.stops[i][1]);
	}
};
