/** This file defines the classes for the optical elements that the user can
  * drag around on the screen to interact with the ray of light (i.e. mirrors,
  * PlanoConvexLenses, etc).

    The Chain of inheritance is as follows:
        Element --> Box, PlanoConvexLens
        Box     --> Mirror, Medium
*/


/** Defines the Box class. A box is just a rectangular optical element, so it
  * needs a width and a height in addition to the parameters specified by the
  * abstract Element class above. */
var Box = function(x, y, w, h, angle, n, color1, color2) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.angle = angle;
    this.n = n;
    this.color1 = color1;
    this.color2 = color2;
    this.generateLineSegments();
}

Box.prototype.print = function() {
    if (this.type == "wall") {
        return "var b = new Wall(" + this.x + "," + this.y + "," + this.w + "," + this.h + "," + this.angle +");" +
                "canvasState.addShape(b);";
    }
    return "var b = new Box(" + this.x + "," + this.y + "," + this.w + "," + this.h + "," + this.angle + "," + this.n + ",'" + this.color1 + "','" + this.color2 +"');" +
            "canvasState.addShape(b);";
}

Box.prototype.generateLineSegments = function() {
    this.x1 = this.x + this.h*Math.sin(this.angle)/2 - this.w*Math.cos(this.angle)/2;
    this.y1 = this.y - this.h*Math.cos(this.angle)/2 - this.w*Math.sin(this.angle)/2;

    this.x4 = this.x1 + this.w*Math.cos(this.angle);
    this.y4 = this.y1 + this.w*Math.sin(this.angle);

    this.x2 = this.x1 - this.h*Math.sin(this.angle);
    this.y2 = this.y1 + this.h*Math.cos(this.angle);

    this.x3 = this.x4 - this.h*Math.sin(this.angle);
    this.y3 = this.y4 + this.h*Math.cos(this.angle);

    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(this.x1, this.y1, this.x2, this.y2));
    this.lineSegments.push(new LineSegment(this.x2, this.y2, this.x3, this.y3));
    this.lineSegments.push(new LineSegment(this.x3, this.y3, this.x4, this.y4));
    this.lineSegments.push(new LineSegment(this.x4, this.y4, this.x1, this.y1));
}

Box.prototype.setAngle = function(angle) {
    this.angle = mod(angle, 2*Math.PI);
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


    normalLines = [];
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

    // var img = new Image();
    // img.src = "images/water.gif";
    // var pat=ctx.createPattern(img,"repeat");
    // ctx.fillStyle=pat;

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.lineTo(this.x4, this.y4);
    ctx.lineTo(this.x1, this.y1);
    ctx.fill();

    //this.drawNormals(ctx);
}

Box.prototype.highlight = function(ctx) {
    this.generateLineSegments();

    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.lineTo(this.x3, this.y3);
    ctx.stroke();
    ctx.lineTo(this.x4, this.y4);
    ctx.stroke();
    ctx.lineTo(this.x1, this.y1);
    ctx.stroke();
}

Box.prototype.intersection = function(ray) {
    var intersections = [];
    var lineSegment;
    var intersection;
    for (var i = 0; i < this.lineSegments.length; i +=1) {
        lineSegment = this.lineSegments[i];
        intersection = lineSegment.intersection(ray);
        if (intersection && !(approxeq(intersection.x, ray.x1, 0.1) && approxeq(intersection.y, ray.y1, 0.1))) {
            intersections.push(intersection);
        }
    }

    if (intersections.length == 0) {
        return false;
    }

    // choose the intersection point that is closest to the ray's starting point
    var cur_dist;
    var cur_point;
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
}


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







/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays (index of refraction 0). */
var Mirror = function(x, y, w, h, angle){
    Box.apply(this, [x, y, w, h, angle, 0, "#a3c2c2", "#d1e0e0"]);
}

Mirror.prototype = Box.prototype;        // Set prototype to Person's
Mirror.prototype.constructor = Mirror;   // Set constructor back to Box




/** Defines the GlassBox class. A GlassBox is a simply a box with an index
  * of refraction of 1.5. */
var GlassBox = function(x, y, w, h, angle){
    Box.apply(this, [x, y, w, h, angle, 1.33, "#33cccc", "#ccffcc"]);
}

GlassBox.prototype = Box.prototype;   // Set constructor back to Box
GlassBox.prototype.constructor = GlassBox;   // Set constructor back to Box

/** Defines the Wall class. A Wall is a simply a box with an index
  * of refraction of -1. */
var Wall = function(x, y, w, h, angle){
    Box.apply(this, [x, y, w, h, angle, -1, "#1f2e2e", "#1f2e2e"]);
    this.type = "wall";
}

Wall.prototype = Box.prototype;   // Set constructor back to Box
Wall.prototype.constructor = Wall;   // Set constructor back to Box



/** Defines the Wall class. A Wall is a simply a box with an index
  * of refraction of -1. */
var WinWall = function(x, y, w, h, angle){
    Box.apply(this, [x, y, w, h, angle, -1, "#00cc00", "#00cc00"]);
    this.type = "winwall";
}

WinWall.prototype = Box.prototype;   // Set constructor back to Box
WinWall.prototype.constructor = WinWall;   // Set constructor back to Box


/** Defines the Wall class. A Wall is a simply a box with an index
  * of refraction of -1. */
var LoseWall = function(x, y, w, h, angle){
    Box.apply(this, [x, y, w, h, angle, -1, "#ff0000", "#ff0000"]);
    this.type = "losewall";
}

LoseWall.prototype = Box.prototype;   // Set constructor back to Box
LoseWall.prototype.constructor = LoseWall;   // Set constructor back to Box









/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays. */
var PlanoConvexLens = function(x, y, r, angle, n, d){
    this.x = x;
    this.y = y;
    this.r = r;
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.original_angle = angle;
    this.n = n;
    this.extent = Math.PI/2;
    this.d = d;
    this.w = 0.5*d;

    this.angle = this.original_angle + (Math.PI/2 - this.extent/2);

    this.curves = [];
    this.curves.push(new Arc(x - d*Math.sin(this.angle), y + d*Math.cos(this.angle), r, this.angle, this.extent));

    this.generateLineSegments();
    this.recalculateCurves();
    this.generateCenter();
    this.draw(canvasState.ctx);
}

PlanoConvexLens.prototype.print = function() {
    return "var pcv = new PlanoConvexLens(" + this.x + "," + this.y + "," + this.r + "," + this.angle + "," + this.n + "," + this.d + ");" +
            "canvasState.addShape(pcv);";
}

PlanoConvexLens.prototype.generateLineSegments = function() {
    var x1 = this.curves[0].p1;
    var y1 = this.curves[0].q1;

    var x2 = x1 + this.w*Math.sin(this.angle - (Math.PI/2 - this.extent/2));
    var y2 = y1 - this.w*Math.cos(this.angle - (Math.PI/2 - this.extent/2));

    var x4 = this.curves[0].p2;
    var y4 = this.curves[0].q2;

    var x3 = x4 + this.w*Math.sin(this.angle - (Math.PI/2 - this.extent/2));
    var y3 = y4 - this.w*Math.cos(this.angle - (Math.PI/2 - this.extent/2));


    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(x1, y1, x2, y2));
    this.lineSegments.push(new LineSegment(x2, y2, x3, y3));
    this.lineSegments.push(new LineSegment(x3, y3, x4, y4));

}

PlanoConvexLens.prototype.recalculateCurves = function() {
    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].x = this.x;
        this.curves[i].y = this.y;
    }
}

PlanoConvexLens.prototype.generateCenter = function() {
    this.curves[0].generateCenterOfCircle();
    this.centerX = this.curves[0].centerX;
    this.centerY = this.curves[0].centerY;
}

PlanoConvexLens.prototype.draw = function(ctx) {
    this.recalculateCurves();
    this.generateCenter();
    this.generateLineSegments();

    var grd = ctx.createLinearGradient(this.x,this.y,this.x + this.r, this.y + this.r);
    grd.addColorStop(0,this.color1);
    grd.addColorStop(1,this.color2);

    ctx.fillStyle = grd;

    var arc = this.curves[0];
    for (var i = 0; i < this.curves.length; i += 1) {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, arc.r, arc.angle, arc.angle + arc.extent);
        ctx.stroke();
    }

    var curLineSeg = this.lineSegments[2];
    for (var i = this.lineSegments.length - 1; i >= 0; i -= 1) {
        curLineSeg = this.lineSegments[i];
        ctx.lineTo(curLineSeg.x1, curLineSeg.y1);
        ctx.stroke();
    }

    ctx.fill();
    // ctx.closePath();
}

PlanoConvexLens.prototype.setAngle = function(angle) {
    this.angle = mod(angle, 2*Math.PI);
    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].angle = this.angle;
    }
}

PlanoConvexLens.prototype.contains = function(x, y) {
    var x1 = this.lineSegments[0].x1;
    var y1 = this.lineSegments[0].y1;
    var x2 = this.lineSegments[0].x2;
    var y2 = this.lineSegments[0].y2;
    var x3 = this.lineSegments[2].x1;
    var y3 = this.lineSegments[2].y1;
    var x4 = this.lineSegments[2].x2;
    var y4 = this.lineSegments[2].y2;
    return this.curves[0].contains(x, y) || boxContains(x1, y1, x2, y2, x3, y3, x4, y4, x, y);
}

PlanoConvexLens.prototype.highlight = function(ctx) {
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;

    var curLineSeg = this.lineSegments[0];
    ctx.moveTo(curLineSeg.x1, curLineSeg.y1);
    for (var i = 0; i < this.lineSegments.length; i += 1) {
        curLineSeg = this.lineSegments[i];
        ctx.lineTo(curLineSeg.x2, curLineSeg.y2);
        ctx.stroke();
    }

    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].draw(ctx);
    }
}

PlanoConvexLens.prototype.intersectionBox = function(ray) {
    var intersections = [];
    var lineSegment;
    var intersection;
    for (var i = 0; i < this.lineSegments.length; i +=1) {
        lineSegment = this.lineSegments[i];
        intersection = lineSegment.intersection(ray);
        if (intersection && !(approxeq(intersection.x, ray.x1, 0.1) && approxeq(intersection.y, ray.y1, 0.1))) {
            intersections.push(intersection);
        }
    }

    if (intersections.length == 0) {
        return false;
    }

    // choose the intersection point that is closest to the ray's starting point
    var cur_dist;
    var cur_point;
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
}

PlanoConvexLens.prototype.intersection = function(ray) {
    var boxInt = this.intersectionBox(ray);
    var arcInt = this.intersectionArc(ray);

    boxDist = distance(boxInt.x, boxInt.y, ray.x1, ray.y1);
    arcDist = distance(arcInt.x, arcInt.y, ray.x1, ray.y1);

    if (boxDist < 0.001) {
        boxInt = false;
    }
    if (arcDist < 0.001) {
        arcInt = false;
    }

    if (boxInt === false && arcInt === false) {
        return false;
    } else if (boxInt === false) {
        return arcInt;
    } else if (arcInt === false) {
        // console.log("INTERSECT WITH BOX");
        return boxInt;
    }

    if (boxDist < arcDist) {
        // console.log("INTERSECT WITH BOX");
        return boxInt;
    } else {
        return arcInt;
    }

}

PlanoConvexLens.prototype.intersectionArc = function(ray) {
    var x1 = ray.x1;
    var x2 = ray.x2;
    var y1 = ray.y1;
    var y2 = ray.y2;
    var cx = this.centerX;
    var cy = this.centerY;
    var cr = this.r;

    var dx = x2 - x1;
    var dy = y2 - y1;
    var a = dx * dx + dy * dy;
    var b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
    var c = (x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy) - cr * cr;

    var bb4ac = b * b - 4 * a * c;
    var p1 = (-b + Math.sqrt(bb4ac)) / (2*a);
    var p2 = (-b - Math.sqrt(bb4ac)) / (2*a);
    p1 = x1 + p1*dx;
    p2 = x1 + p2*dx;

    if (!p1 && p1 != 0) {
        return false;    // No collision
    } else {
        var q1, q2;
        // vertical line
        if (x2-x1==0) {
            q1 = Math.sqrt(r*r-Math.pow(x1-cx, 2)) + cy;
            q2 = -Math.sqrt(r*r-Math.pow(x1-cx, 2)) + cy;
        } else {
            var m = (y2 - y1)/(x2 - x1);
            q1 = m*(p1-x1) + y1;
            q2 = m*(p2-x1) + y1;
        }

        var dist1 = distance(p1, q1, x1, y1);
        var dist2 = distance(p2, q2, x1, y1);

        var intersection1 = {"x": p1, "y": q1, "curve": this.curves[0], "element": this};
        var intersection2 = {"x": p2, "y": q2, "curve": this.curves[0], "element": this};
        var closer_intersection;
        var further_intersection;
        if (dist1 < dist2 || (approxeq(p2, ray.x1, 0.1) && approxeq(q2, ray.y1, 0.1))) {
            closer_intersection = intersection1;
            further_intersection = intersection2;
        } else {
            closer_intersection = intersection2;
            further_intersection = intersection1;
        }

        var a = angleFromSegment(cx, cy, closer_intersection.x, closer_intersection.y);

        if (isInRange(this.angle, this.angle + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, closer_intersection.x, closer_intersection.y)) {
            return closer_intersection;
        } else {
            a = angleFromSegment(cx, cy, further_intersection.x, further_intersection.y);
            if (isInRange(this.angle, this.angle + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, further_intersection.x, further_intersection.y)) {
                return further_intersection;
            }
        }

        return false;

    }
}




























/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays. */
var ConvexLens = function(x, y, r, angle, n, d) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.angle = angle;
    this.n = n;
    this.extent = Math.PI/2;
    this.d = 5*d;
    this.w = 5*d;

    this.setArcAngles();

    this.curves = [];
    this.curves.push(new Arc(x - (d)*Math.sin(this.angle), y + (d+r)*Math.cos(this.angle), r, this.angle1, this.extent));
    this.curves.push(new Arc(x + (d)*Math.sin(this.angle), y - (d+r)*Math.cos(this.angle), r, this.angle2 + this.extent, this.extent));

    this.generateLineSegments();
    this.recalculateCurves();
    this.generateCenter();
}

ConvexLens.prototype.setArcAngles = function() {
    this.angle1 = this.angle + (Math.PI/2 - this.extent/2);
    this.angle2 = this.angle - this.extent - (Math.PI/2 + this.extent/2);
}

ConvexLens.prototype.generateLineSegments = function() {
    var x1 = this.curves[0].p1;
    var y1 = this.curves[0].q1;

    // not sure
    var x2 = this.curves[1].p1;
    var y2 = this.curves[1].q1;

    var x3 = this.curves[1].p2;
    var y3 = this.curves[1].q2;

    var x4 = this.curves[0].p2;
    var y4 = this.curves[0].q2;

    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(x1, y1, x2, y2));
    this.lineSegments.push(new LineSegment(x3, y3, x4, y4));

}

ConvexLens.prototype.recalculateCurves = function() {
    this.curves[0].x = this.x - (this.d)*Math.sin(this.angle);
    this.curves[0].y = this.y + (this.d)*Math.cos(this.angle);
    this.curves[1].x = this.x + (this.d)*Math.sin(this.angle);
    this.curves[1].y = this.y - (this.d)*Math.cos(this.angle);

    this.curves[0].angle = this.angle1;
    this.curves[1].angle = this.angle2 + this.extent;
}

ConvexLens.prototype.generateCenter = function() {
    this.curves[0].generateCenterOfCircle();
    this.curves[1].generateCenterOfCircle();
    this.centerX = this.x;
    this.centerY = this.y;
}

ConvexLens.prototype.draw = function(ctx) {
    this.recalculateCurves();
    this.generateCenter();
    this.generateLineSegments();

    var grd = ctx.createLinearGradient(this.x,this.y,this.x + this.r, this.y + this.r);
    grd.addColorStop(0,this.color1);
    grd.addColorStop(1,this.color2);

    ctx.fillStyle = grd;

    var arc = this.curves[0];
    ctx.beginPath();
    ctx.arc(arc.centerX, arc.centerY, arc.r, arc.angle, arc.angle + arc.extent);
    ctx.stroke();

    var curLineSeg = this.lineSegments[1];
    ctx.lineTo(curLineSeg.x2, curLineSeg.y2);
    ctx.stroke();

    arc = this.curves[1];
    ctx.arc(arc.centerX, arc.centerY, arc.r, arc.angle, arc.angle + arc.extent);
    ctx.stroke();

    curLineSeg = this.lineSegments[0];
    ctx.lineTo(curLineSeg.x1, curLineSeg.y1);
    ctx.stroke();

    ctx.fill();
}

ConvexLens.prototype.setAngle = function(angle) {
    this.angle = mod(angle, 2*Math.PI);
    this.setArcAngles();
}

ConvexLens.prototype.contains = function(x, y) {
    var x1 = this.lineSegments[0].x1;
    var y1 = this.lineSegments[0].y1;
    var x2 = this.lineSegments[1].x1;
    var y2 = this.lineSegments[1].y1;
    var x3 = this.lineSegments[0].x2;
    var y3 = this.lineSegments[0].y2;
    var x4 = this.lineSegments[1].x2;
    var y4 = this.lineSegments[1].y2;
    return this.curves[0].contains(x, y) || this.curves[1].contains(x, y) || boxContains(x1, y1, x2, y2, x3, y3, x4, y4, x, y);
}

ConvexLens.prototype.highlight = function(ctx) {
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;

    var arc = this.curves[0];
    ctx.beginPath();
    ctx.arc(arc.centerX, arc.centerY, arc.r, arc.angle, arc.angle + arc.extent);
    ctx.stroke();

    var curLineSeg = this.lineSegments[1];
    ctx.lineTo(curLineSeg.x2, curLineSeg.y2);
    ctx.stroke();

    arc = this.curves[1];
    ctx.arc(arc.centerX, arc.centerY, arc.r, arc.angle, arc.angle + arc.extent);
    ctx.stroke();

    curLineSeg = this.lineSegments[0];
    ctx.lineTo(curLineSeg.x1, curLineSeg.y1);
    ctx.stroke();

    ctx.fill();
}

ConvexLens.prototype.intersectionBox = function(ray) {
    var intersections = [];
    var lineSegment;
    var intersection;
    for (var i = 0; i < this.lineSegments.length; i +=1) {
        lineSegment = this.lineSegments[i];
        intersection = lineSegment.intersection(ray);
        if (intersection && !(approxeq(intersection.x, ray.x1, 0.1) && approxeq(intersection.y, ray.y1, 0.1))) {
            intersections.push(intersection);
        }
    }

    if (intersections.length == 0) {
        return false;
    }

    // choose the intersection point that is closest to the ray's starting point
    var cur_dist;
    var cur_point;
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
}

ConvexLens.prototype.intersection = function(ray) {
    var boxInt = this.intersectionBox(ray);
    var arcInt1 = this.intersectionArc(ray, this.curves[0]);
    var arcInt2 = this.intersectionArc(ray, this.curves[1]);
    // var arcInt1 = false;
    // var arcInt2 = false;
    console.log("boxInt: " + boxInt);

    var boxDist = distance(boxInt.x, boxInt.y, ray.x1, ray.y1);
    var arcDist1 = distance(arcInt1.x, arcInt1.y, ray.x1, ray.y1);
    var arcDist2 = distance(arcInt2.x, arcInt2.y, ray.x1, ray.y1);

    if (boxDist < 0.001) {
        boxInt = false;
    }
    if (arcDist1 < 0.001) {
        arcInt1 = false;
    }
    if (arcDist2 < 0.001) {
        arcInt2 = false;
    }

    if (false) {
    // if ((boxDist < arcDist1 && boxDist < arcDist2) || (arcInt1 === false && arcInt2 === false)) {
    //     console.log("BOX");
    //     return boxInt;
    } else if (arcDist1 < arcDist2 || arcInt2 === false) {
        return arcInt1;
    } else if (arcInt2) {
        return arcInt2;
    }

    return false;

}

ConvexLens.prototype.intersectionArc = function(ray, arc) {
    var x1 = ray.x1;
    var x2 = ray.x2;
    var y1 = ray.y1;
    var y2 = ray.y2;
    var cx = arc.centerX;
    var cy = arc.centerY;
    var cr = arc.r;

    var dx = x2 - x1;
    var dy = y2 - y1;
    var a = dx * dx + dy * dy;
    var b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
    var c = (x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy) - cr * cr;

    var bb4ac = b * b - 4 * a * c;
    var p1 = (-b + Math.sqrt(bb4ac)) / (2*a);
    var p2 = (-b - Math.sqrt(bb4ac)) / (2*a);
    p1 = x1 + p1*dx;
    p2 = x1 + p2*dx;

    if (!p1 && p1 != 0) {
        return false;    // No collision
    } else {
        var q1, q2;
        // vertical line
        if (x2-x1==0) {
            q1 = Math.sqrt(cr*cr-Math.pow(x1-cx, 2)) + cy;
            q2 = -Math.sqrt(cr*cr-Math.pow(x1-cx, 2)) + cy;
        } else {
            var m = (y2 - y1)/(x2 - x1);
            q1 = m*(p1-x1) + y1;
            q2 = m*(p2-x1) + y1;
        }

        var dist1 = distance(p1, q1, x1, y1);
        var dist2 = distance(p2, q2, x1, y1);

        var intersection1 = {"x": p1, "y": q1, "curve": arc, "element": this};
        var intersection2 = {"x": p2, "y": q2, "curve": arc, "element": this};
        var closer_intersection;
        var further_intersection;
        if (dist1 < dist2 || (approxeq(p2, ray.x1, 0.1) && approxeq(q2, ray.y1, 0.1))) {
            closer_intersection = intersection1;
            further_intersection = intersection2;
        } else {
            closer_intersection = intersection2;
            further_intersection = intersection1;
        }

        var a = angleFromSegment(cx, cy, closer_intersection.x, closer_intersection.y);

        if (isInRange(arc.angle, arc.angle + arc.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, closer_intersection.x, closer_intersection.y)) {
            return closer_intersection;
        } else {
            a = angleFromSegment(cx, cy, further_intersection.x, further_intersection.y);
            if (isInRange(arc.angle, arc.angle + arc.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, further_intersection.x, further_intersection.y)) {
                return further_intersection;
            }
        }

        return false;

    }
}

























/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays. */
var PlanoConcaveLens = function(x, y, r, angle, n, d){
    this.x = x;
    this.y = y;
    this.r = r;
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.original_angle = angle;
    this.n = n;
    this.extent = Math.PI/2;
    this.d = d;
    this.w = 0.5*d;
    this.type = "concave";

    this.angle = this.original_angle + (Math.PI/2 - this.extent/2);

    this.curves = [];
    this.curves.push(new Arc(x - d*Math.sin(this.angle), y + d*Math.cos(this.angle), r, this.angle + Math.PI, this.extent));

    this.generateLineSegments();
    this.recalculateCurves();
    this.generateCenter();
    this.draw(canvasState.ctx);
}

PlanoConcaveLens.prototype.print = function() {
    return "var pcc = new PlanoConcaveLens(" + this.x + "," + this.y + "," + this.r + "," + this.original_angle + "," + this.n + "," + this.d + ");" +
            "canvasState.addShape(pcc);";
}

PlanoConcaveLens.prototype.generateLineSegments = function() {
    var x1 = this.curves[0].p1;
    var y1 = this.curves[0].q1;

    var x2 = x1 + this.w*Math.sin(this.angle - (Math.PI/2 - this.extent/2));
    var y2 = y1 - this.w*Math.cos(this.angle - (Math.PI/2 - this.extent/2));

    var x4 = this.curves[0].p2;
    var y4 = this.curves[0].q2;

    var x3 = x4 + this.w*Math.sin(this.angle - (Math.PI/2 - this.extent/2));
    var y3 = y4 - this.w*Math.cos(this.angle - (Math.PI/2 - this.extent/2));


    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(x1, y1, x2, y2));
    this.lineSegments.push(new LineSegment(x2, y2, x3, y3));
    this.lineSegments.push(new LineSegment(x3, y3, x4, y4));

}

PlanoConcaveLens.prototype.recalculateCurves = function() {
    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].x = this.x;
        this.curves[i].y = this.y;
    }
}

PlanoConcaveLens.prototype.generateCenter = function() {
    this.curves[0].generateCenterOfCircle();
    this.centerX = this.curves[0].centerX;
    this.centerY = this.curves[0].centerY;
}

PlanoConcaveLens.prototype.draw = function(ctx) {
    this.recalculateCurves();
    this.generateCenter();
    this.generateLineSegments();

    var grd = ctx.createLinearGradient(this.x,this.y,this.x + this.r, this.y + this.r);
    grd.addColorStop(0,this.color1);
    grd.addColorStop(1,this.color2);

    ctx.fillStyle = grd;

    var arc = this.curves[0];
    for (var i = 0; i < this.curves.length; i += 1) {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, arc.r, arc.angle, arc.angle + arc.extent);
        ctx.stroke();
    }

    var curLineSeg = this.lineSegments[2];
    for (var i = this.lineSegments.length - 1; i >= 0; i -= 1) {
        curLineSeg = this.lineSegments[i];
        ctx.lineTo(curLineSeg.x1, curLineSeg.y1);
        ctx.stroke();
    }

    ctx.fill();
}

PlanoConcaveLens.prototype.setAngle = function(angle) {
    this.angle = mod(angle, 2*Math.PI);
    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].angle = this.angle + Math.PI;
    }
}

PlanoConcaveLens.prototype.contains = function(x, y) {
    var x1 = this.lineSegments[0].x1;
    var y1 = this.lineSegments[0].y1;
    var x2 = this.lineSegments[0].x2;
    var y2 = this.lineSegments[0].y2;
    var x3 = this.lineSegments[2].x1;
    var y3 = this.lineSegments[2].y1;
    var x4 = this.lineSegments[2].x2;
    var y4 = this.lineSegments[2].y2;
    return !this.curves[0].contains(x, y) && boxContains(x1, y1, x2, y2, x3, y3, x4, y4, x, y);
}

PlanoConcaveLens.prototype.highlight = function(ctx) {
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;

    var curLineSeg = this.lineSegments[0];
    ctx.moveTo(curLineSeg.x1, curLineSeg.y1);
    for (var i = 0; i < this.lineSegments.length; i += 1) {
        curLineSeg = this.lineSegments[i];
        ctx.lineTo(curLineSeg.x2, curLineSeg.y2);
        ctx.stroke();
    }

    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].draw(ctx);
    }
}

PlanoConcaveLens.prototype.intersectionBox = function(ray) {
    var intersections = [];
    var lineSegment;
    var intersection;
    for (var i = 0; i < this.lineSegments.length; i +=1) {
        lineSegment = this.lineSegments[i];
        intersection = lineSegment.intersection(ray);
        if (intersection && !(approxeq(intersection.x, ray.x1, 0.1) && approxeq(intersection.y, ray.y1, 0.1))) {
            intersections.push(intersection);
        }
    }

    if (intersections.length == 0) {
        return false;
    }

    // choose the intersection point that is closest to the ray's starting point
    var cur_dist;
    var cur_point;
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
}

PlanoConcaveLens.prototype.intersection = function(ray) {
    var boxInt = this.intersectionBox(ray);
    var arcInt = this.intersectionArc(ray);

    boxDist = distance(boxInt.x, boxInt.y, ray.x1, ray.y1);
    arcDist = distance(arcInt.x, arcInt.y, ray.x1, ray.y1);

    if (boxDist < 0.001) {
        boxInt = false;
    }
    if (arcDist < 0.001) {
        arcInt = false;
    }

    if (boxInt === false && arcInt === false) {
        return false;
    } else if (boxInt === false) {
        return arcInt;
    } else if (arcInt === false) {
        return boxInt;
    }

    if (boxDist < arcDist) {
        return boxInt;
    } else {
        return arcInt;
    }

}

PlanoConcaveLens.prototype.intersectionArc = function(ray) {
    var x1 = ray.x1;
    var x2 = ray.x2;
    var y1 = ray.y1;
    var y2 = ray.y2;
    var cx = this.centerX;
    var cy = this.centerY;
    var cr = this.r;

    var dx = x2 - x1;
    var dy = y2 - y1;
    var a = dx * dx + dy * dy;
    var b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
    var c = (x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy) - cr * cr;

    var bb4ac = b * b - 4 * a * c;
    var p1 = (-b + Math.sqrt(bb4ac)) / (2*a);
    var p2 = (-b - Math.sqrt(bb4ac)) / (2*a);
    p1 = x1 + p1*dx;
    p2 = x1 + p2*dx;

    if (!p1 && p1 != 0) {
        return false;    // No collision
    } else {
        var q1, q2;
        // vertical line
        if (x2-x1==0) {
            q1 = Math.sqrt(r*r-Math.pow(x1-cx, 2)) + cy;
            q2 = -Math.sqrt(r*r-Math.pow(x1-cx, 2)) + cy;
        } else {
            var m = (y2 - y1)/(x2 - x1);
            q1 = m*(p1-x1) + y1;
            q2 = m*(p2-x1) + y1;
        }

        var dist1 = distance(p1, q1, x1, y1);
        var dist2 = distance(p2, q2, x1, y1);

        var intersection1 = {"x": p1, "y": q1, "curve": this.curves[0], "element": this};
        var intersection2 = {"x": p2, "y": q2, "curve": this.curves[0], "element": this};
        var closer_intersection;
        var further_intersection;
        if (dist1 < dist2 || (approxeq(p2, ray.x1, 0.1) && approxeq(q2, ray.y1, 0.1))) {
            closer_intersection = intersection1;
            further_intersection = intersection2;
        } else if (!(approxeq(p2, ray.x1, 0.1) && approxeq(q2, ray.y1, 0.1))) {
            closer_intersection = intersection2;
            further_intersection = intersection1;
        } else {
            return false;
        }

        var a = mod(angleFromSegment(cx, cy, closer_intersection.x, closer_intersection.y) + Math.PI, 2*Math.PI);
        if (isInRange(this.angle, this.angle + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, closer_intersection.x, closer_intersection.y)) {
            return closer_intersection;
        } else {
            a = mod(angleFromSegment(cx, cy, further_intersection.x, further_intersection.y) + Math.PI, 2*Math.PI);
            if (isInRange(this.angle, this.angle + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, further_intersection.x, further_intersection.y)) {
                return further_intersection;
            }
        }

        return false;

    }
}