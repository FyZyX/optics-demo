
/** Define Shape class. */
var Shape = function(x, y, n, fill) {
    // This is a very simple and unsafe constructor.
    // All we're doing is checking if the values exist.
    // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
    this.x = x || 0;
    this.y = y || 0;
    this.fill = fill || '#AAAAAA';
    this.n = n;
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx) {
}

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my) {
    return false;
}

Shape.prototype.intersects = function(ray) {
    return false;
}


var Box = function(x, y, n, fill, w, h){
    Shape.apply(this, arguments);
    this.w = w || 1;
    this.h = h || 1;
}

Box.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

// Determine if a point is inside the shape's bounds
Box.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Width) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
}

//Box.prototype = Shape.prototype;        // Set prototype to Person's
Box.prototype.constructor = Box;   // Set constructor back to Box