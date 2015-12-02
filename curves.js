/** This file defines the classes for the curves that make up the optical
  * elements in our game. A mirror, for example, is composed of 4 line
  * segments objects. */


/** Defines the LineSegment class. */
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








/** Defines the LineSegment class, a subclass of the Curve class. */
var Arc = function(x0, y0, r, angle, extent) {
    this.x = x0;
    this.y = y0;
    this.r = r;
    this.angle = angle;
    this.extent = extent;
    this.type = "arc";

    this.generateCenterOfCircle();
}

Arc.prototype.generateCenterOfCircle = function() {
    var alpha = 1 - Math.pow((this.extent)/(2*Math.PI) + 0.25, 2) ;
    this.centerX = this.x*alpha - alpha*this.r*Math.cos(this.angle + this.extent/2);
    this.centerY = this.y*alpha - alpha*this.r*Math.sin(this.angle + this.extent/2);
}

Arc.prototype.draw = function(ctx) {
    this.generateCenterOfCircle();

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.r, this.angle, this.angle + this.extent);
    ctx.stroke();
}

Arc.prototype.contains = function(x, y) {
    var a = angleFromSegment(this.centerX, this.centerY, x, y);
    if (a >= this.angle && a <= this.angle + this.extent) {
        var s = Math.abs(this.r*Math.cos(this.extent/2));
        var d = distance(this.centerX, this.centerY, x, y);
        if (d > s) {
            return true;
        }
    }
    return false;
}