var Curly={};

/**
 * Merges the given object into the object in the first argument.
 * 
 * @return {Object} The resulting object. Same as targetObj
 * @param {Object} targetObj
 * @param {Object} sourceObj
 * @param {Object} sourceObj2
 * ...
 */
Curly.extend=function(targetObj, sourceObj) {
	for(var i=1; i<arguments.length; i++) {
		for(var k in arguments[i]) {
			targetObj[k]=arguments[i][k];
		}
	}
	return targetObj;
};

/**
 * This method enables extending of classes
 * You may provide an implementation of your own framework here
 * 
 * @return {Object} Same as child
 * @param {Object} child The child class
 * @param {Object} parent The parent class
 * @param {Object} methods Methods to extend the child class
 */
Curly.extendClass=function(child, parent, methods) {
	parent.prototype.constructor=parent;
	var extendHelper=function(){};
	extendHelper.prototype=parent.prototype;
	child.prototype=new extendHelper();
	Curly.extend(child.prototype, parent.prototype);
	if(methods!==undefined) {
		Curly.extend(child.prototype, methods);
	}
	child.superclass=parent.prototype;
	return child;
};

/**
 * Clones the given array
 * 
 * @return {Array}
 * @param {Array}
 */
Curly.cloneArray=function(ar) {
    var clone=[];
    for(var i=0; i<ar.length; i++) {
        if(ar[i] instanceof Array) {
            clone.push(ar[i].clone());
        }
        else {
            clone.push(ar[i]);
        }
    }
    return clone;
};
