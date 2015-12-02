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
    var alpha = 1 - (this.extent)/(2*Math.PI);
    this.centerX = this.x*alpha - alpha*this.r*Math.cos(this.angle + this.extent/2);
    this.centerY = this.y*alpha - alpha*this.r*Math.sin(this.angle + this.extent/2);

    this.p1 = this.r*Math.cos(this.angle) + this.centerX;
    this.q1 = this.r*Math.sin(this.angle) + this.centerY;
    this.p2 = this.r*Math.cos(this.angle + this.extent) + this.centerX;
    this.q2 = this.r*Math.sin(this.angle + this.extent) + this.centerY;
}

Arc.prototype.draw = function(ctx) {
    this.generateCenterOfCircle();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.r, this.angle, this.angle + this.extent);
    ctx.stroke();
}

Arc.prototype.contains = function(x, y) {
    var p1 = this.r*Math.cos(this.angle) + this.centerX;
    var q1 = this.r*Math.sin(this.angle) + this.centerY;
    var p2 = this.r*Math.cos(this.angle + this.extent) + this.centerX;
    var q2 = this.r*Math.sin(this.angle + this.extent) + this.centerY;
    if (p1 === p2) {
        var pastLine = Math.abs(x - this.centerX) >= Math.abs(p1 - this.centerX);
    }
    else {
        var vecToPoint = [x - p1, y - q1];
        var vecToCenter = [this.centerX - p1, this.centerY - q1];
        var normal = normalVector(p1, q1, p2, q2);
        var dot1 = dotProduct(vecToPoint, normal) > 0;
        var dot2 = dotProduct(vecToCenter, normal) >= 0;

        if (approxeq(dot2, 0, 0.001)) {
            dot2 = 0;
        }
        var pastLine = dot1 != dot2;
    }
    var inCircle = Math.pow((x - this.centerX), 2) + Math.pow((y - this.centerY), 2) <= Math.pow(this.r, 2);
    if (pastLine && inCircle) {return true}

    return false;
}