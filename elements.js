/** This file defines the classes for the optical elements that the user can
  * drag around on the screen to interact with the ray of light (i.e. mirrors,
  * lenses, etc).

    The Chain of inheritance is as follows:
        Element --> Box, Lens
        Box     --> Mirror, Medium
*/

/** Defines the Element class. An optical element is specified by its x, y
  * position, an index of refraction n, and a color (for rendering). This
  * class is meant to be abstract. */
var Element = function(x, y, n) {
    this.x = x || 0;
    this.y = y || 0;
    this.n = n;
    this.fill = '#AAAAAA';
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
var Box = function(x, y, n, w, h){
    Element.apply(this, arguments);
    this.w = w || 1;
    this.h = h || 1;
    this.fill = "#669999";
    this.generateLineSegments();
}

Box.prototype.generateLineSegments = function() {
    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(this.x, this.y, this.x, this.y + this.h));
    this.lineSegments.push(new LineSegment(this.x, this.y + this.h, this.x + this.w, this.y + this.h));
    this.lineSegments.push(new LineSegment(this.x + this.w, this.y + this.h, this.x + this.w, this.y));
    this.lineSegments.push(new LineSegment(this.x + this.w, this.y, this.x, this.y));
}

Box.prototype.draw = function(ctx) {
    this.generateLineSegments();
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Box.prototype.intersection = function(ray) {
    var intersections = [];
    var lineSegment;
    var intersection;
    for (var i = 0; i < this.lineSegments.length; i +=1) {
        lineSegment = this.lineSegments[i];
        intersection = lineSegment.intersection(ray);
        if (intersection) {
            intersections.extend(intersection);
        }
    }

    if (intersections.length == 0) {
        return false;
    }

    // choose the intersection point that is closest to the ray's starting point
    var cur_dist;
    var cur_point;
    var closest_point = intersections[0];
    var min_dist = distance(closest_point[0], closest_point[1], ray.x1, ray.y1);
    for (var i = 0; i < intersections.length; i += 1) {
        cur_point = intersections[i];
        cur_dist = distance(cur_point[0], cur_point[1], ray.x1, ray.y1);
        if (cur_dist < min_dist) {
            closest_point = cur_point;
            min_dist = cur_dist;
        }
    }

    return [closest_point];
}

Box.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the Element's X and (X + Width) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
            (this.y <= my) && (this.y + this.h >= my);
}

//Box.prototype = Element.prototype;        // Set prototype to Person's
Box.prototype.constructor = Box;   // Set constructor back to Box







/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays. */
var Mirror = function(x, y, n, w, h){
    Box.apply(this, arguments);
    this.w = w || 1;
    this.h = h || 1;
    this.fill = "#33cccc";
    this.generateLineSegments();
}

Mirror.prototype = Box.prototype;        // Set prototype to Person's
Mirror.prototype.constructor = Mirror;   // Set constructor back to Box