/**
 * @class Curly.Canvas.State
 */
Curly.Canvas.State=function(config) {
	Ext.apply(this, config, Curly.Canvas.State.DEFAULTS);
}
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
