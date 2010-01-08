/**
 * @class Curly.Canvas.Error
 */
/**
 * @constructor
 * @param string
 */
Curly.Canvas.Error=function(msg) {
	this.msg=msg;
	this.toString=function() {
		return this.msg;
	};
};
