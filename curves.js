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
    if (intersection) {
        return {"x": intersection.x, "y": intersection.y, "curve": this};
    } else {
        return false;
    }
}








/** Defines the LineSegment class, a subclass of the Curve class. */
var Arc = function(x0, y0, r, rotation, extent) {
    this.x = x0;
    this.y = y0;
    this.r = r;
    this.rotation = rotation;
    this.extent = extent;
    this.type = "arc";

    this.generateCenterOfCircle();
}


Arc.prototype.generateCenterOfCircle = function() {
    var r = this.r;
    var w = 2*r*Math.sin(this.extent/2);
    // console.log("r: " + r);
    // console.log("w: " + w);
    var h;

    var a = 1;
    var b = -2*r;
    var c = w*w/4;

    h = quadraticFormula(a, b, c);
    // console.log("a: " +a);
    // console.log("b: " + b);
    // console.log("c: " + c);
    // console.log("h: " + h);

    var d = r - h/2;
    // console.log("d: " + d);

    this.centerX = this.x + d*Math.sin(this.rotation);
    this.centerY = this.y - d*Math.cos(this.rotation);

    this.p1 = this.r*Math.cos(this.rotation) + this.centerX;
    this.q1 = this.r*Math.sin(this.rotation) + this.centerY;
    this.p2 = this.r*Math.cos(this.rotation + this.extent) + this.centerX;
    this.q2 = this.r*Math.sin(this.rotation + this.extent) + this.centerY;
    // console.log("\n");
}

Arc.prototype.draw = function(ctx) {
    this.generateCenterOfCircle();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.r, this.rotation, this.rotation + this.extent);
    ctx.stroke();
}

Arc.prototype.contains = function(x, y) {
    var p1 = this.r*Math.cos(this.rotation) + this.centerX;
    var q1 = this.r*Math.sin(this.rotation) + this.centerY;
    var p2 = this.r*Math.cos(this.rotation + this.extent) + this.centerX;
    var q2 = this.r*Math.sin(this.rotation + this.extent) + this.centerY;
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