var Curly={}

Array.prototype.clone=function() {
    var clone=[];
    for(var i=0; i<this.length; i++) {
        if(this[i] instanceof Array) {
            clone.push(this[i].clone());
        }
        else {
            clone.push(this[i]);
        }
    }
    return clone;
}