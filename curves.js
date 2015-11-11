/** This file defines the classes for the curves that make up the optical
  * elements in our game. A box containing a medium in it, for example, can
  * be defined by 4 line segments. */

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

    this.m = (y2 - y1) / (x2 - x1);
    this.b = y1 - this.m*x1;
}

/** Returns an array of the intersection points of this line segment and a ray
  * object. */
LineSegment.prototype.intersection = function(ray) {

    var rayLine = ray.getLine();
    var x = (this.b - rayLine[0]) / (rayLine[1] - this.m);
    var y = this.m*x + this.b;

    if (x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2
        && Math.sign(Math.tan(ray.angle)*(x - ray.x)) == -Math.sign(y - ray.y)
        && sameDirection(ray, this)) {
            return [[x,y]];
    } else {
        return [];
    }
}



function sameDirection(ray, linSeg){
    var linSegVector = new Array[2];
    linSegVector[0] = linSeg.x1 - linSeg.x2;
    linSegVector[1] = linSec.y1 - linSeg.y2;
    var rayVector = new Array[2];
    rayVector[0] = Math.cos(ray.angle);
    rayVector[1] = Math.sin(ray.angle);
    return linSegVector[0]*rayVector[0] + linSegVector[1]*rayVector[1] > 0;
}