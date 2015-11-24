/** This file defines the classes for the optical elements that the user can
  * drag around on the screen to interact with the ray of light. */


/** Defines the Element class. An optical element is specified by its x, y
  * position, an index of refraction n, and a color (for rendering). This
  * class is meant to be abstract. */
var Element = function(x, y, n, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.n = n;
    this.fill = fill || '#AAAAAA';
}

/** Draws this Element to a given context (render the object on the canvas). */
Element.prototype.draw = function(ctx) {
    // Implemented by subclasses
}

/** Given a RAY object, returns the first (x, y) intersection point of this
  * object and the RAY, or returns FALSE if there is no intersection point. */
Element.prototype.intersects = function(ray) {
    // Implemented by subclasses
    return false;
}




/** Defines the Box class. A box is just a rectangular optical element, so it
  * needs a width and a height in addition to the parameters specified by the
  * abstract Element class above. */
var Box = function(x, y, n, fill, w, h){
    Element.apply(this, arguments);
    this.w = w || 1;
    this.h = h || 1;

    // IMPLEMENT ME
    this.lineSegments = NaN;
}

Box.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Box.prototype.intersects = function(ray) {
    // Implemented by subclasses
    return false;
}

/** This function came with the code I grabbed from the internet. I'm leaving it
  * in for now. */
Box.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the Element's X and (X + Width) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
}

//Box.prototype = Element.prototype;        // Set prototype to Person's
Box.prototype.constructor = Box;   // Set constructor back to Box