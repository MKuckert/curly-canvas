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
Curly.Canvas.State.ALIGN_START='start';
Curly.Canvas.State.ALIGN_END='end';
Curly.Canvas.State.ALIGN_LEFT='left';
Curly.Canvas.State.ALIGN_RIGHT='right';
Curly.Canvas.State.ALIGN_CENTER='center';
Curly.Canvas.State.BASELINE_TOP='top';
Curly.Canvas.State.BASELINE_HANGING='hanging';
Curly.Canvas.State.BASELINE_MIDDLE='middle';
Curly.Canvas.State.BASELINE_ALPHABETIC='alphabetic';
Curly.Canvas.State.BASELINE_IDEOGRAPHIC='ideographic';
Curly.Canvas.State.BASELINE_BOTTOM='bottom';
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
Curly.Canvas.State.COLOR_TRANSPARENT='rgba(0,0,0,0)';
Curly.Transparent='rgba(0,0,0,0)';
