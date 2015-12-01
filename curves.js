/** This file defines the classes for the curves that make up the optical
  * elements in our game. A mirror, for example, is composed of 4 line
  * segments objects. */

/** Defines the Curve class. */
var Curve = function(x, y, n, fill) {
    this.x = x || 0;
    this.y = y || 0;
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
    this.type = "line";
}

/** Returns an array of the intersection points of this line segment and a ray
  * object. */
LineSegment.prototype.intersection = function(ray) {
    var intersection = checkLineIntersection(ray.x1, ray.y1, ray.x2, ray.y2, this.x1, this.y1, this.x2, this.y2);
    if (intersection.onLine1 && intersection.onLine2) {
        return {"x": intersection.x, "y": intersection.y, "curve": this};
    } else {
        return false;
    }
}










var Arc = function(x0, y0, r, angle, arcAngle) {
    this.x = x0;
    this.y = y0;
    this.r = r;
    this.angle = angle;
    this.arcAngle = arcAngle;
    this.type = "arc";
}

Arc.prototype.draw = function(ctx) {
    ctx.beginPath();
    var from = this.angle + 0;
    var to = this.angle + this.arcAngle;
    ctx.arc(this.x, this.y, this.r, from, to);
    ctx.stroke();
}

