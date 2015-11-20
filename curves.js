/** This file defines the classes for the curves that make up the optical
  * elements in our game. A mirror, for example, is composed of 4 line
  * segments objects. */

/** Defines the Curve class. */
var Curve = function(x, y, n, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.n = n;
    this.fill = fill || '#AAAAAA';
}

Curve.prototype.intersection = function(ray) {
    return [];
}







/** Defines the LineSegment class, a subclass of the Curve class. */
var LineSegment = function(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

/** Returns an array of the intersection points of this line segment and a ray
  * object. */
LineSegment.prototype.intersection = function(ray) {
    var intersection = checkLineIntersection(ray.x1, ray.y1, ray.x2, ray.y2, this.x1, this.y1, this.x2, this.y2);
    if (intersection.onLine1 && intersection.onLine2) {
        return [[intersection.x, intersection.y, true, this]];
    } else {
        return false;
    }
}