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
