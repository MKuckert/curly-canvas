/**
 * Repr�sentiert ein Objekt, welches auf einem Canvas-Objekt gezeichnet werden
 * kann und dessen Zeichenpfad als Curly.Path-Objekt ausgedr�ckt wird.
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
	 * Gibt den Pfad der dieses Objekt beschreibt zur�ck. Die Pfad-Instanz muss
	 * dabei mit dem �bergebenen Canvas-Objekt verkn�pft werden.
	 * 
	 * @return Curly.Path
	 * @param Curly.Canvas
	 */
	getPath: function(canvas) {},
	/** 
	 * Zeichnet dieses Objekt auf den �bergebenen Zeichenkontext.
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
