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
