/** Defines the Box class. A box is just a rectangular optical element, so it
  * needs a width W and a height H in addition to the parameters specified by the
  * abstract Element class above. */
var Box = function(x, y, rotation, n, w, h, color1, color2) {
    Element.apply(this, arguments);
    this.w = w;
    this.h = h;
    this.color1 = color1;
    this.color2 = color2;
    this.attributes = ["w", "h", "n"];
    this.generateLineSegments();
}

Box.prototype.createClone = function() {
    return new Box(this.x, this.y, this.rotation, this.n, this.w, this.h, this.color1, this.color2);
}

Box.prototype.updateAttribute = function(key, value) {
    this[key] = value;
    this.generateLineSegments();
    canvasState.valid = false;
}

Box.prototype.generateLineSegments = function() {
    var h = this.h;
    var w = this.w;
    var rotation = this.rotation;

    var x1 = this.x + h*Math.sin(rotation)/2 - w*Math.cos(rotation)/2;
    var y1 = this.y - h*Math.cos(rotation)/2 - w*Math.sin(rotation)/2;
    var x2 = x1 - h*Math.sin(rotation);
    var y2 = y1 + h*Math.cos(rotation);
    var x4 = x1 + w*Math.cos(rotation);
    var y4 = y1 + w*Math.sin(rotation);
    var x3 = x4 - h*Math.sin(rotation);
    var y3 = y4 + h*Math.cos(rotation);

    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(x1, y1, x2, y2));
    this.lineSegments.push(new LineSegment(x2, y2, x3, y3));
    this.lineSegments.push(new LineSegment(x3, y3, x4, y4));
    this.lineSegments.push(new LineSegment(x4, y4, x1, y1));
}

Box.prototype.displayInfo = function(ctx) {
    ctx.font = "12px serif";
    ctx.fillStyle = "black";
    ctx.fillText("Box\n(" + this.x + ", " + this.y + ")", this.x + 10, this.y);
}

Box.prototype.setRotation = function(rotation) {
    this.rotation = mod(rotation, 2*Math.PI);
}

Box.prototype.draw = function(ctx) {
    this.generateLineSegments();
    this.centerX = this.x;
    this.centerY = this.y;

    var lineSegments = this.lineSegments;
    var grd = ctx.createLinearGradient(this.x,this.y,this.x,this.y+this.h);
    var path;

    grd.addColorStop(0,this.color1);
    grd.addColorStop(1,this.color2);
    ctx.fillStyle = grd;

    this.path = new Path2D();
    path = this.path;
    ctx.beginPath();
    // path.moveTo(lineSegments[0].x1, lineSegments[0].y1);
    for (var i = 0; i < lineSegments.length; i += 1) {
        lineSegments[i].draw(path);
    }
    ctx.fill(path);
}

Box.prototype.highlight = function(ctx) {
    this.generateLineSegments();
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 2;

    var lineSegments = this.lineSegments;
    var path;


    this.path = new Path2D();
    path = this.path;
    ctx.beginPath();
    path.moveTo(lineSegments[0].x1, lineSegments[0].y1);
    for (var i = 0; i < lineSegments.length; i += 1) {
        lineSegments[i].draw(path);
    }
    ctx.stroke(path);
}

Box.prototype.intersection = function(ray) {
    var curLineSeg, intersection, intersections = [];
    for (var i = 0; i < 4; i +=1) {
        curLineSeg = this.lineSegments[i];
        intersection = curLineSeg.intersection(ray);
        if (intersection && !(approxeq(intersection.x, ray.x1, 0.1) && approxeq(intersection.y, ray.y1, 0.1))) {
            intersections.push(intersection);
        }
    }

    if (intersections.length) {
        // choose the intersection point that is closest to the ray's starting point
        var cur_dist, cur_point;
        var closest_point = intersections[0];
        var min_dist = distance(closest_point.x, closest_point.y, ray.x1, ray.y1);
        for (var i = 0; i < intersections.length; i += 1) {
            cur_point = intersections[i];
            cur_dist = distance(cur_point.x, cur_point.y, ray.x1, ray.y1);
            if (cur_dist < min_dist) {
                closest_point = cur_point;
                min_dist = cur_dist;
            }
        }

        closest_point.element = this;
        return closest_point;
    } else {
        return false;
    }
}

/** Returns true if the point (X, Y) lies within the rectangle defined by this
  * box. */
Box.prototype.contains = function(x, y) {
    return canvasState.ctx.isPointInPath(this.path, x, y);
}

Box.prototype.getNormVec = function(curve) {
    return curve.getNormVec();
}









/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays (index of refraction 0). */
var Mirror = function(x, y, w, h, rotation){
    Box.apply(this, [x, y, rotation, 0, w, h, "#a3c2c2", "#d1e0e0"]);
}

Mirror.prototype = Box.prototype;        // Set prototype to Person's
Mirror.prototype.constructor = Mirror;   // Set constructor back to Box




/** Defines the GlassBox class. A GlassBox is a simply a box with an index
  * of refraction of 1.5. */
var GlassBox = function(x, y, w, h, rotation){
    Box.apply(this, [x, y, rotation, 1.33, w, h, "#33cccc", "#ccffcc"]);
}

GlassBox.prototype = Box.prototype;   // Set constructor back to Box
GlassBox.prototype.constructor = GlassBox;   // Set constructor back to Box

/** Defines the Wall class. A Wall is a simply a box with an index
  * of refraction of -1. */
var Wall = function(x, y, w, h, rotation){
    Box.apply(this, [x, y, rotation, -1, w, h, "#1f2e2e", "#1f2e2e"]);
    this.type = "wall";
    this.wall = true;
}

Wall.prototype = Box.prototype;   // Set constructor back to Box
Wall.prototype.constructor = Wall;   // Set constructor back to Box



/** Defines the Wall class. A Wall is a simply a box with an index
  * of refraction of -1. */
var WinWall = function(x, y, w, h, rotation){
    Box.apply(this, [x, y, rotation, -1, w, h, "#00cc00", "#00cc00"]);
    this.type = "winwall";
    this.wall = true;
}

WinWall.prototype = Box.prototype;   // Set constructor back to Box
WinWall.prototype.constructor = WinWall;   // Set constructor back to Box


/** Defines the Wall class. A Wall is a simply a box with an index
  * of refraction of -1. */
var LoseWall = function(x, y, w, h, rotation){
    Box.apply(this, [x, y, rotation, -1, w, h, "#ff0000", "#ff0000"]);
    this.type = "losewall";
    this.wall = true;
}

LoseWall.prototype = Box.prototype;   // Set constructor back to Box
LoseWall.prototype.constructor = LoseWall;   // Set constructor back to Box
