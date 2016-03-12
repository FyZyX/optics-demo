/** Defines the Box class. A box is just a rectangular optical element, so it
  * needs a width W and a height H in addition to the parameters specified by the
  * abstract Element class above. */
var Box = function(x, y, rotation, n, w, h, color1, color2) {
    Element.apply(this, arguments);
    this.w = w;
    this.h = h;
    this.color1 = color1;
    this.color2 = color2;
    this.generateLineSegments();

    this.attributes = {"width": w, "height": h, "n": this.n};
}

Box.prototype.updateAttribute = function(key, value) {
    this.attributes[key] = value;
    if (key == "width") {
        this.w = value;
    } else if (key == "height") {
        this.h = value;
    } else {
        this.n = value;
    }

    this.generateLineSegments();
    canvasState.valid = false;
}

Box.prototype.generateLineSegments = function() {
    this.x1 = this.x + this.h*Math.sin(this.rotation)/2 - this.w*Math.cos(this.rotation)/2;
    this.y1 = this.y - this.h*Math.cos(this.rotation)/2 - this.w*Math.sin(this.rotation)/2;

    this.x2 = this.x1 - this.h*Math.sin(this.rotation);
    this.y2 = this.y1 + this.h*Math.cos(this.rotation);

    this.x4 = this.x1 + this.w*Math.cos(this.rotation);
    this.y4 = this.y1 + this.w*Math.sin(this.rotation);

    this.x3 = this.x4 - this.h*Math.sin(this.rotation);
    this.y3 = this.y4 + this.h*Math.cos(this.rotation);

    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(this.x1, this.y1, this.x2, this.y2));
    this.lineSegments.push(new LineSegment(this.x2, this.y2, this.x3, this.y3));
    this.lineSegments.push(new LineSegment(this.x3, this.y3, this.x4, this.y4));
    this.lineSegments.push(new LineSegment(this.x4, this.y4, this.x1, this.y1));
}

Box.prototype.displayInfo = function(ctx) {
    ctx.font = "12px serif";
    ctx.fillStyle = "black";
    ctx.fillText("Box\n(" + this.x + ", " + this.y + ")", this.x + 10, this.y);
}

Box.prototype.setRotation = function(rotation) {
    this.rotation = mod(rotation, 2*Math.PI);
}

Box.prototype.drawNormals = function(ctx) {
    // FOR DRAWING NORMALS
    var oldStyle = ctx.strokeStyle;
    // ctx.lineWidth=10;
    ctx.strokeStyle="green";
    ctx.beginPath();
    var midpoint1 = midpoint(this.x1, this.y1, this.x2, this.y2);
    var midpoint2 = midpoint(this.x2, this.y2, this.x3, this.y3);
    var midpoint3 = midpoint(this.x3, this.y3, this.x4, this.y4);
    var midpoint4 = midpoint(this.x4, this.y4, this.x1, this.y1);

    var normVec1 = normalVectorLine(this.x1, this.y1, this.x2, this.y2);
    var normVec2 = normalVectorLine(this.x2, this.y2, this.x3, this.y3);
    var normVec3 = normalVectorLine(this.x3, this.y3, this.x4, this.y4);
    var normVec4 = normalVectorLine(this.x4, this.y4, this.x1, this.y1);

    var normLine1 = {};
    normLine1.x1 = midpoint1[0];
    normLine1.y1 = midpoint1[1];
    normLine1.x2 = midpoint1[0] + normVec1[0];
    normLine1.y2 = midpoint1[1] + normVec1[1];

    var normLine2 = {};
    normLine2.x1 = midpoint2[0];
    normLine2.y1 = midpoint2[1];
    normLine2.x2 = midpoint2[0] + normVec2[0];
    normLine2.y2 = midpoint2[1] + normVec2[1];

    var normLine3 = {};
    normLine3.x1 = midpoint3[0];
    normLine3.y1 = midpoint3[1];
    normLine3.x2 = midpoint3[0] + normVec3[0];
    normLine3.y2 = midpoint3[1] + normVec3[1];

    var normLine4 = {};
    normLine4.x1 = midpoint4[0];
    normLine4.y1 = midpoint4[1];
    normLine4.x2 = midpoint4[0] + normVec4[0];
    normLine4.y2 = midpoint4[1] + normVec4[1];

    var normalLines = [];
    normalLines.push(normLine1);
    normalLines.push(normLine2);
    normalLines.push(normLine3);
    normalLines.push(normLine4);

    var curNormLine;
    for (var i = 0; i < normalLines.length; i += 1) {
        curNormLine = normalLines[i];
        ctx.moveTo(curNormLine.x1, curNormLine.y1);
        ctx.lineTo(curNormLine.x2, curNormLine.y2);
        ctx.stroke();
    }

    ctx.strokeStyle = oldStyle;
}

Box.prototype.draw = function(ctx) {
    this.generateLineSegments();
    this.centerX = this.x;
    this.centerY = this.y;

    var grd = ctx.createLinearGradient(this.x,this.y,this.x,this.y+this.h);
    grd.addColorStop(0,this.color1);
    grd.addColorStop(1,this.color2);
    ctx.fillStyle = grd;

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.lineTo(this.x4, this.y4);
    ctx.lineTo(this.x1, this.y1);
    ctx.fill();

    // this.drawNormals(ctx);
}

Box.prototype.highlight = function(ctx) {
    this.generateLineSegments();

    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.lineTo(this.x4, this.y4);
    ctx.lineTo(this.x1, this.y1);
    ctx.stroke();
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
    var vs = [[this.x1, this.y1], [this.x2, this.y2], [this.x3, this.y3], [this.x4, this.y4]];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

Box.prototype.getNormVec = function(curve) {
    return normalVectorLine(curve.x1, curve.y1, curve.x2, curve.y2);
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
