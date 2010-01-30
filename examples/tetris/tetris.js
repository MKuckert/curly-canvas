// Copyright 2009, Martin Kuckert
// Note: This software is NOT (yet) open source!

// simulate firebug
if(!window.console) {
	var console={log:function(){}};
}

/**
 * @class Tetris
 */
/**
 * @constructor
 * @param String|HtmlElement|Curly.Canvas|CanvasRenderingContext2D
 * @param Object
 */
var Tetris=function(canvasElement, config) {
	if(!(canvasElement instanceof Curly.Canvas)) {
		canvasElement=new Curly.Canvas(canvasElement);
	}
	
	this.canvas=canvasElement;
	
	Curly.extend(this, config||{});
	
	this.init();
};
Curly.extendClass(Tetris, Object, {
	/**
	 * @var Curly.Canvas canvas The canvas to draw the game on
	 */
	canvas: null,
	/**
	 * @var Array timer The interval timer resources
	 */
	timer: null,
	/**
	 * @var Integer rows The number of rows in the game grid.
	 */
	rows: 12,
	/**
	 * @var Integer cols The number of columns in the game grid.
	 */
	cols: 8,
	/**
	 * @var Integer speed The current game speed.
	 */
	speed: 2,
	/**
	 * @var Array boxes An array of an array of all the tetris boxes
	 */
	boxes: null,
	/**
	 * @var Tetris.Element curEl The current tetris box element.
	 */
	curEl: undefined,
	/**
	 * @var Tetris.Element nextEl The next tetris box element.
	 */
	nextEl: null,
	/**
	 * @var Array elCtrs List of constructors of all possible box elements.
	 */
	elCtrs: [],
	/**
	 * @var Integer size The size of a tetris box in pixel.
	 */
	size: 20,
	/**
	 * @var Integer loopState The current loop state
	 */
	loopState: 0,
	/**
	 * @var Object moveState The current movement state. Used for the next movement calculation
	 */
	moveState: null,
	/**
	 * @var Array colors List of all possible box colors.
	 */
	colors: ['red', 'blue', 'green'],
	/**
	 * @var Array finishedRows List of currently detected finished rows
	 */
	finishedRows: [],
	/**
	 * @var Integer finishedRowsAnimation State of the animation of detected finished rows
	 */
	finishedRowsAnimation: 0,
	/**
	 * Starts the main loop of the game.
	 * 
	 * @return void
	 */
	run: function() {
		var self=this;
		this.timer=[
			window.setTimeout(function() {
				self.loop();
			}, 1000/this.speed),
			window.setTimeout(function() {
				self.dump();
			}, 50)
		];
	},
	/**
	 * Stops the main loop of the game.
	 * 
	 * @return void
	 */
	stop: function() {
		for(var i=0; i<this.timer.length; i++) {
			window.clearTimeout(this.timer[i]);
		}
		this.timer=[];
	},
	/**
	 * Initializes the game.
	 * 
	 * @return void
	 */
	init: function() {
		this.boxes=new Array(this.rows);
		for(var y=0, x; y<this.rows; y++) {
			this.boxes[y]=new Array(this.cols);
		}
		
		if(this.elCtrs.length<=0) {
			for(var i=0, n=Tetris.ALL_CTRS.length; i<n; i++) {
				this.elCtrs.push(Tetris.ALL_CTRS[i]);
			}
		}
		
		// Create first elements
		this.nextEl=this.createRandEl();
		this.render();
		
		// Bind event listener
		this.moveState={
			moveleft: false,
			moveright: false,
			movedown: false,
			rotateleft: false,
			rotateright: false
		};
		var self=this;
		document.addEventListener('keydown', function(e) {
			self.onKeyDown(e);
		}, true);
	},
	/**
	 * Eventlistener for the keydown event.
	 * 
	 * @return void
	 * @param Event
	 */
	onKeyDown: function(event) {
		var m=this.moveState;
		
		// TODO: Don't hardcode this!
		switch(event.keyCode) {
			case 65:
				m.moveleft=true;
				m.moveright=false;
				break;
			case 68:
				m.moveleft=false;
				m.moveright=true;
				break;
			case 83:
				m.movedown=true;
				break;
			case 81:
				m.rotateleft=true;
				m.rotateright=false;
				break;
			case 69:
				m.rotateleft=false;
				m.rotateright=true;
				break;
			case 77:
				if(!this.curEl) {
					break;
				}
				this.curEl.rotateClockwise();
				this.render();
				break;
			case 78:
				if(!this.curEl) {
					break;
				}
				this.curEl.rotateAntiClockwise();
				this.render();
				break;
		}
		this.moveState=m;
	},
	/**
	 * Initializes the given element.
	 * 
	 * @return void
	 * @param Tetris.ElementBase
	 */
	initElement: function(el) {
		el.h=el.boxes.length;
		el.w=el.boxes[0].length;
		el.x=Math.floor((this.cols-el.w)/2);
		el.y=0;
	},
	/**
	 * Inserts the given element into the boxes array
	 * 
	 * @return void
	 * @param Tetris.ElementBase
	 */
	insertElement: function(el) {
		var b=this.boxes;
		for(var i=0, j; i<el.h; i++) {
			for(j=0; j<el.w; j++) {
				if(el.boxes[i][j]!==undefined) {
					b[i+el.y][j+el.x]=el.color;
				}
			}
		}
	},
	/**
	 * Runs one main loop iteration.
	 * 
	 * @return void
	 */
	loop: function() {
		if(this.finishedRowsAnimation===0) {
			switch(this.loopState) {
				case Tetris.LOOPSTATE_INIT:
					this.stateInit();
					break;
				case Tetris.LOOPSTATE_MOVE:
					this.stateMove();
					break;
			}
			
			this.findFinishedRows();
		}
		else if(this.finishedRowsAnimation>4) {
			this.removeFinishedRows();
		}
		
		this.render();
		
		this.loopState=(this.loopState+1)%Tetris.LOOPSTATES;

		var self=this;
		this.timer[0]=window.setTimeout(function() {
			self.loop();
		}, 1000/this.speed);
	},
	/**
	 * Checks for a collision of the given element.
	 * 
	 * @return boolean true, if there's a collision
	 * @param Tetris.ElementBase The element
	 */
	checkCollision: function(el) {
		if(el.x<0 || el.y<0 || el.x+el.w>this.cols || el.y+el.h>this.rows) {
			return true;
		}
		
		var b=this.boxes, i, j;
		for(i=0; i<el.h; i++) {
			// Check the element boxes for a collision
			for(j=0; j<el.w; j++) {
				if(el.boxes[i][j] && b[i+el.y][j+el.x]) {
					console.log('Collision at '+(j+el.x)+', '+(i+el.y)+' detected');
					return true;
				}
			}
		}
		
		return false;
	},
	/**
	 * Processes the LOOPSTATE_INIT
	 * 
	 * @return void
	 */
	stateInit: function() {
		// Create new element
		if(this.curEl===undefined) {
			this.curEl=this.nextEl;
			this.nextEl=this.createRandEl();
			this.initElement(this.curEl);
		}
		// Move current element
		else {
			this.moveState.movedown=true;
			this.stateMove();
		}
	},
	/**
	 * Processes the LOOPSTATE_MOVE
	 * 
	 * @return void
	 */
	stateMove: function() {
		var el=this.curEl, m=this.moveState;
		if(el===undefined) {
			return;
		}
		
		var y=el.y, i, j, changed=false;
		
		// Move down
		if(m.movedown===true) {
			y++;
			changed=true;
			m.movedown=false;
		}
		
		// Only move left or right, if we move down
		if(changed) {
			if(m.moveleft===true) {
				if(el.x>0) {
					el.x--;
					
					if(this.checkCollision(el)) {
						el.x++;
					}
					else {
						changed=true;
					}
				}
				
				m.moveleft=false;
			}
			else if(m.moveright===true) {
				if((el.x+el.w)<this.cols) {
					el.x++;
					
					if(this.checkCollision(el)) {
						el.x--;
					}
					else {
						changed=true;
					}
				}
				
				m.moveright=false;
			}
		}
		
		// Perform movement
		if(changed) {
			this.moveY(el, y);
		}
	},
	/**
	 * Performs an element move on the y axis. If there's a collision, the element is inserted and
	 * the current element removed.
	 * 
	 * @return void
	 * @param Tetris.ElementBase el
	 * @param integer y
	 */
	moveY: function(el, y) {
		var oldY=el.y, forceInsert=false;
		el.y=y;
		if(this.checkCollision(el)) {
			el.y=oldY;
			forceInsert=true;
		}
		if(forceInsert || el.h+y>=this.rows) {
			this.curEl=undefined;
			this.insertElement(el);
		}
	},
	/**
	 * Dumps the current state.
	 * 
	 * @return void
	 */
	dump: function() {
		var t=[];
		
		t.push('movestate:');
		var m=this.moveState;
		t.push(' right '+m.moveright);
		t.push(' left '+m.moveleft);
		t.push(' down '+m.movedown);
		
		var dump=document.getElementById('dump').textContent=t.join("\n");
		
		var self=this;
		this.timer[1]=window.setTimeout(function() {
			self.dump();
		}, 50);
	},
	/**
	 * Finds rows full of boxes.
	 * 
	 * @return void
	 */
	findFinishedRows: function() {
		var i, j, found, b=this.boxes, finished=[];
		for(i=0; i<this.rows; i++) {
			found=true;
			for(j=0; j<this.cols; j++) {
				if(b[i][j]===undefined) {
					found=false;
					break;
				}
			}
			
			if(found) {
				finished.push(i);
			}
		}
		
		if(finished.length>0) {
			this.finishedRowsAnimation=1;
		}
		
		this.finishedRows=finished;
	},
	/**
	 * Removes finished rows
	 * 
	 * @return void
	 */
	removeFinishedRows: function() {
		var fr=this.finishedRows;
		var n=fr.length;
		for(var i=n-1; i>=0; i--) {
			this.boxes.splice(fr[i], 1);
		}
		
		for(var i=0; i<n; i++) {
			this.boxes.unshift(new Array(this.cols));
		}
		
		this.finishedRows=[];
		this.finishedRowsAnimation=0;
	},
	/**
	 * Renders the current game state.
	 * 
	 * @return void
	 */
	render: function() {
		var b=this.boxes, x, y, s=this.size;
		this.canvas.
			clear().
			statefulPath(0, 0).
			setState('fillStyle', 'black').
			rect(this.cols*s, this.rows*s).
			draw();
		
		var path=this.canvas.
			overwriteState('strokeStyle', '#333').
			path(0, 0);
		
		for(x=1; x<this.cols; x++) {
			path.
				moveTo(x*s, 0).
				lineTo(x*s, this.rows*s);
		}
		for(y=1; y<this.rows; y++) {
			path.
				moveTo(0, y*s).
				lineTo(this.cols*s, y*s);
		}
		
		path.draw(false, true);
		
		// Render static boxes
		for(y=0; y<this.rows; y++) {
			for(x=0; x<this.cols; x++) {
				if(b[y][x]) {
					this.renderBox(x, y, b[y][x], this.canvas);
				}
			}
		}
		
		// Render current element
		var el=this.curEl;
		if(el) {
			for(y=0; y<el.h; y++) {
				for(x=0; x<el.w; x++) {
					if(!el.boxes[y][x]) {
						continue;
					}
					this.renderBox(x+el.x, y+el.y, el.color, this.canvas);
				}
			}
		}
		
		if(this.finishedRowsAnimation>0) {
			var fr=this.finishedRows;
			var color=this.finishedRowsAnimation%2==1 ? 'rgba(255,0,0,0.5)' : 'rgba(0,0,255,0.5)';
			
			for(var i=0, j; i<fr.length; i++) {
				for(j=0; j<this.cols; j++) {
					this.renderBox(j, fr[i], color, this.canvas);
				}
			}
			
			this.finishedRowsAnimation++;
		}
	},
	/**
	 * Renders a single box.
	 * 
	 * @return void
	 * @param integer x position of the box
	 * @param integer y position of the box
	 * @param string the color to use
	 * @param Curly.Canvas the canvas context
	 */
	renderBox: function(x, y, color, canvas) {
		var s=this.size;
		var xs=x*s, ys=y*s;
		
		var path=canvas.statefulPath(xs, ys);
		path.setState('fillStyle', color).
			rect(s, s).
		// left light
			moveTo(xs, ys).
			setState('alpha', 0.6).
			setState('fillStyle', 'white').
			rect(1, s).
		// top light
			moveTo(xs, ys).
			rect(s, 1).
		// right shadow
			moveTo(xs+s-1, ys).
			setState('alpha', 0.6).
			setState('fillStyle', 'black').
			rect(1, s).
		// bottom shadow
			moveTo(xs, ys+s-1).
			rect(s, 1).
		// draw
			draw(true, false);
		canvas.overwriteState(Curly.Canvas.State.DEFAULTS);
	},
	/**
	 * Creates a new random tetris box element.
	 * 
	 * @return void
	 */
	createRandEl: function() {
		var el=Math.floor(Math.random()*this.elCtrs.length);
		var c=Math.floor(Math.random()*this.colors.length);
		el=new this.elCtrs[el]();
		el.game=this;
		el.color=this.colors[c];
		console.log('create el: '+el.name+' '+c);
		return el;
	}
});

Tetris.LOOPSTATE_INIT=0;
Tetris.LOOPSTATE_MOVE=1;
Tetris.LOOPSTATES=2;