// Copyright 2009, Martin Kuckert
// Note: This software is NOT (yet) open source!

(function() {
var b=true, u=undefined;

/**
 * @class Tetris.ElementBase
 */
/**
 * @constructor
 */
Tetris.ElementBase=function(color) {
	throw new Error('The Tetris.ElementBase class is abstract');
};
Curly.extendClass(Tetris.ElementBase, Object, {
	/**
	 * @var Array An 2D array with all boxes of this element
	 */
	boxes: null,
	/**
	 * @var String The name of this element
	 */
	name: null,
	/**
	 * @var String Color of this element
	 */
	color: 'red',
	/**
	 * @var Integer x
	 */
	x: 0,
	/**
	 * @var Integer y
	 */
	y: 0,
	/**
	 * @var Integer w
	 */
	w: 0,
	/**
	 * @var Integer h
	 */
	h: 0,
	/**
	 * Rotates this element clockwise.
	 * 
	 * @return void
	 */
	rotateClockwise: function() {
		var i, j;
		var newBoxes=new Array(this.w);
		for(i=0; i<this.w; i++) {
			newBoxes[i]=new Array(this.h);
			
			for(j=0; j<this.h; j++) {
				newBoxes[i][j]=this.boxes[this.h-j-1][i];
			}
		}
		
		this.boxes=newBoxes;
		this.afterRotate();
	},
	/**
	 * Rotates this element anti clockwise.
	 * 
	 * @return void
	 */
	rotateAntiClockwise: function() {
		var i, j;
		var newBoxes=new Array(this.w);
		for(i=0; i<this.w; i++) {
			newBoxes[i]=new Array(this.h);
			
			for(j=0; j<this.h; j++) {
				newBoxes[i][j]=this.boxes[j][this.w-i-1];
			}
		}
		
		this.boxes=newBoxes;
		this.afterRotate();
	},
	// private
	afterRotate: function() {
		var dif=(this.h-this.w)/2;
		if(this.h>this.w) {
			dif=Math.ceil(dif);
		}
		else {
			dif=Math.floor(dif);
		}
		
		var tmp=this.w;
		this.w=this.h;
		this.h=tmp;
		
		this.x-=dif;
		this.y+=dif;
	}
});

Tetris.Bar=function() {
	this.boxes=[
		[b, b, b, b]
	];
	this.name='Bar';
};
Curly.extendClass(Tetris.Bar, Tetris.ElementBase);

Tetris.Cube=function() {
	this.boxes=[
		[b, b],
		[b, b]
	];
	this.name='Cube';
};
Curly.extendClass(Tetris.Cube, Tetris.ElementBase);

Tetris.Z=function() {
	this.boxes=[
		[b, b, u],
		[u, b, b]
	];
	this.name='Z';
};
Curly.extendClass(Tetris.Z, Tetris.ElementBase);

Tetris.Z2=function() {
	this.boxes=[
		[u, b, b],
		[b, b, u]
	];
	this.name='Z2';
};
Curly.extendClass(Tetris.Z2, Tetris.ElementBase);

Tetris.T=function() {
	this.boxes=[
		[b, b, b],
		[u, b, u]
	];
	this.name='T';
};
Curly.extendClass(Tetris.T, Tetris.ElementBase);

Tetris.L=function() {
	this.boxes=[
		[b, u],
		[b, u],
		[b, b]
	];
	this.name='L';
};
Curly.extendClass(Tetris.L, Tetris.ElementBase);

Tetris.L2=function() {
	this.boxes=[
		[u, b],
		[u, b],
		[b, b]
	];
	this.name='L2';
};
Curly.extendClass(Tetris.L2, Tetris.ElementBase);

/**
 * @var Array ALL_CTRS List of all available constructors of box elements.
 */
Tetris.ALL_CTRS=[
	Tetris.Bar,
	Tetris.Cube,
	Tetris.Z,
	Tetris.Z2,
	Tetris.T,
	Tetris.L,
	Tetris.L2
];
})();