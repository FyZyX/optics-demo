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

LineSegment.prototype.getNormVec = function() {
    var angle = Math.atan2(this.x2 - this.x1, this.y1 - this.y2);
    return new Vector(1, angle);
};

LineSegment.prototype.draw = function(path) {
    path.lineTo(this.x2, this.y2);
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
    var h;

    var a = 1;
    var b = -2*r;
    var c = w*w/4;

    h = quadraticFormula(a, b, c);

    var d = r - h/2;

    this.centerX = this.x + d*Math.sin(this.rotation);
    this.centerY = this.y - d*Math.cos(this.rotation);

    var val = (Math.PI - this.extent)/2;
    this.p1 = this.r*Math.cos(this.rotation + val) + this.centerX;
    this.q1 = this.r*Math.sin(this.rotation + val) + this.centerY;
    this.p2 = this.r*Math.cos(this.rotation + val + this.extent) + this.centerX;
    this.q2 = this.r*Math.sin(this.rotation + val + this.extent) + this.centerY;
}


Arc.prototype.getNormVec = function(x, y) {
    var angle = Math.atan2(y - this.centerY, x - this.centerX);
    return new Vector(1, angle);
};


Arc.prototype.draw = function(path) {
    this.generateCenterOfCircle();
    var val = (Math.PI - this.extent)/2;
    path.arc(this.centerX, this.centerY, this.r, this.rotation + val, this.rotation + val + this.extent);
}
