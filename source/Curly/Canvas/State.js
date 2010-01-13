/**
 * @class Curly.Canvas.State
 */
/**
 * @constructor
 * @param Object State configurations
 */
Curly.Canvas.State=function(config) {
	Curly.extend(this, Curly.Canvas.State.DEFAULTS, config||{});
};
/**
 * @final
 * @type Array
 */
Curly.Canvas.State.IDENTITY_MATRIX=[1,0,0,1,0,0];
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_SOURCE_OVER='source-over';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_SOURCE_IN='source-in';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_SOURCE_OUT='source-out';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_SOURCE_atop='source-atop';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_DESTINATION_OVER='destination-over';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_DESTINATION_IN='destination-in';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_DESTINATION_OUT='destination-out';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_DESTINATION_atop='destination-atop';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_LIGHTER='lighter';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_COPY='copy';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.OP_XOR='xor';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.CAP_BUTT='butt';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.CAP_ROUND='round';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.CAP_SQUARE='square';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.JOIN_ROUND='round';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.JOIN_BEVEL='bevel';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.JOIN_MITER='miter';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.ALIGN_START='start';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.ALIGN_END='end';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.ALIGN_LEFT='left';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.ALIGN_RIGHT='right';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.ALIGN_CENTER='center';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.BASELINE_TOP='top';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.BASELINE_HANGING='hanging';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.BASELINE_MIDDLE='middle';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.BASELINE_ALPHABETIC='alphabetic';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.BASELINE_IDEOGRAPHIC='ideographic';
/**
 * @final
 * @type String
 */
Curly.Canvas.State.BASELINE_BOTTOM='bottom';
/**
 * @final
 * @type Object Default state configurations
 */
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
	shadowColor:		'black',
	font:				'10px sans-serif',
	textAlign:			Curly.Canvas.State.ALIGN_START,
	textBaseline:		Curly.Canvas.State.BASELINE_ALPHABETIC
};
/**
 * @final
 * @type String Constant value for a totally transparent color
 */
Curly.Canvas.State.COLOR_TRANSPARENT='rgba(0,0,0,0)';
/**
 * @final
 * @type String Constant value for a totally transparent color
 */
Curly.Transparent='rgba(0,0,0,0)';
