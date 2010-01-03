/**
 * Zeichnet ein Smiley
 * 
 * @class Curly.Smiley
 * @extends Curly.Shape
 */
/**
 * @constructor
 * @param integer X-Position
 * @param integer Y-Position
 * @param Object Weitere Konfigurationen
 */
Curly.Smiley=function(x, y, config) {
	Curly.Smiley.superclass.constructor.apply(this, arguments);
	Ext.apply(this, config);
}
Ext.extend(Curly.Smiley, Curly.Shape, {
	/**
	 * @var String Hauptfarbe des Smiley
	 */
	mainColor: 'yellow',
	/**
	 * @var String Rahmenfarbe
	 */
	borderColor: 'black',
	/** 
	 * Gibt den Pfad der dieses Objekt beschreibt zurück.
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
