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
