/** This file defines the classes for the optical elements that the user can
  * drag around on the screen to interact with the ray of light (i.e. mirrors,
  * PlanoConvexLenses, etc).

    The Chain of inheritance is as follows:
        Element --> Box, PlanoConvexLens
        Box     --> Mirror, Medium
*/

/** Defines the Element class. An Element (short for optical element) is defined
  * by an (X, Y) position, a ROTATION, and an index of refraction N. */
var Element = function(x, y, rotation, n) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.n = n;
}








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









/** Defines the PlanoConvexLens class. */
var PlanoConvexLens = function(x, y, rotation, n, r, w) {
    Element.apply(this, arguments);
    this.r = r;
    this.w = w;
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.extent = Math.PI/2;
    this.rotation = rotation;
    this.w = w;

    var a = r*Math.sin(this.extent/2);
    var s = r - Math.sqrt(r*r - a*a);
    var l = s+w;
    var d = (l-s)/2;

    this.arc = new Arc(x - d*Math.sin(rotation)/2, y + d*Math.cos(rotation)/2, r, rotation, this.extent + rotation);

    this.generateLineSegments();
    this.recalculateCurves();
    this.generateCenter();
    this.draw(canvasState.ctx);
}

PlanoConvexLens.prototype.generateLineSegments = function() {
    var x1 = this.arc.p1;
    var y1 = this.arc.q1;
    var x2 = x1 + this.w*Math.sin(this.rotation);
    var y2 = y1 - this.w*Math.cos(this.rotation);
    var x4 = this.arc.p2;
    var y4 = this.arc.q2;
    var x3 = x4 + this.w*Math.sin(this.rotation);
    var y3 = y4 - this.w*Math.cos(this.rotation);

    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(x1, y1, x2, y2));
    this.lineSegments.push(new LineSegment(x2, y2, x3, y3));
    this.lineSegments.push(new LineSegment(x3, y3, x4, y4));
}

PlanoConvexLens.prototype.recalculateCurves = function() {
    this.arc.x = this.x - this.w*Math.sin(this.rotation)/2;
    this.arc.y = this.y + this.w*Math.cos(this.rotation)/2;
}

PlanoConvexLens.prototype.generateCenter = function() {
    this.arc.generateCenterOfCircle();
    this.centerX = this.arc.centerX;
    this.centerY = this.arc.centerY;
}

PlanoConvexLens.prototype.displayInfo = function(ctx) {
    ctx.font = "12px serif";
    ctx.fillStyle = "black";
    ctx.fillText("Plano-convex lens\n(" + this.x + ", " + this.y + ")", this.x + 10, this.y);
}

PlanoConvexLens.prototype.drawCenter = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.arc(this.x, this.y, 0.5, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.arc(this.arc.x, this.arc.y, 0.5, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();

    // ctx.beginPath();
    // ctx.strokeStyle = "red";
    // ctx.arc(this.arc.centerX, this.arc.centerY, 0.5, 0, 2*Math.PI);
    // ctx.stroke();
    // ctx.fill();
}


PlanoConvexLens.prototype.draw = function(ctx) {
    var val = (Math.PI - this.extent)/2;



    this.recalculateCurves();
    this.generateCenter();
    this.generateLineSegments();

    var grd = ctx.createLinearGradient(this.x,this.y,this.x + this.r, this.y + this.r);
    grd.addColorStop(0,this.color1);
    grd.addColorStop(1,this.color2);
    ctx.fillStyle = grd;

    var arc = this.arc;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, arc.r, arc.rotation + val, arc.rotation + val + this.extent);

    var curLineSeg = this.lineSegments[0];
    ctx.moveTo(curLineSeg.x1, curLineSeg.y1);
    for (var i = 0; i < this.lineSegments.length; i += 1) {
        curLineSeg = this.lineSegments[i];
        ctx.lineTo(curLineSeg.x2, curLineSeg.y2);
    }

    ctx.fill();

    this.drawCenter(ctx);
}

PlanoConvexLens.prototype.setRotation = function(rotation) {
    this.rotation = mod(rotation, 2*Math.PI);
    this.arc.rotation = this.rotation;
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
    return this.arc.contains(x, y) || boxContains(x1, y1, x2, y2, x3, y3, x4, y4, x, y);
}

PlanoConvexLens.prototype.highlight = function(ctx) {
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;

    var val = (Math.PI - this.extent)/2;
    var arc = this.arc;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, arc.r, arc.rotation + val, arc.rotation + val + this.extent);
    ctx.stroke();

    var curLineSeg = this.lineSegments[0];
    ctx.beginPath();
    ctx.moveTo(curLineSeg.x1, curLineSeg.y1);
    for (var i = 0; i < this.lineSegments.length; i += 1) {
        curLineSeg = this.lineSegments[i];
        ctx.lineTo(curLineSeg.x2, curLineSeg.y2);
    }

    ctx.stroke();
    // this.arc.draw(ctx);
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
        return boxInt;
    }

    if (boxDist < arcDist) {
        return boxInt;
    } else {
        return arcInt;
    }

}


PlanoConvexLens.prototype.intersectionBox = function(ray) {
    var lineSegment, intersection, intersections = [];
    for (var i = 0; i < this.lineSegments.length; i +=1) {
        lineSegment = this.lineSegments[i];
        intersection = lineSegment.intersection(ray);
        if (intersection && !(approxeq(intersection.x, ray.x1, 0.1) && approxeq(intersection.y, ray.y1, 0.1))) {
            intersections.push(intersection);
        }
    }

    if (intersections.length) {
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
    } else {
        return false;
    }
}


PlanoConvexLens.prototype.intersectionArc = function(ray) {

    var val = (Math.PI - this.extent)/2;



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
            q1 = Math.sqrt(cr*cr-Math.pow(x1-cx, 2)) + cy;
            q2 = -Math.sqrt(cr*cr-Math.pow(x1-cx, 2)) + cy;
        } else {
            var m = (y2 - y1)/(x2 - x1);
            q1 = m*(p1-x1) + y1;
            q2 = m*(p2-x1) + y1;
        }

        var dist1 = distance(p1, q1, x1, y1);
        var dist2 = distance(p2, q2, x1, y1);

        var intersection1 = {"x": p1, "y": q1, "curve": this.arc, "element": this};
        var intersection2 = {"x": p2, "y": q2, "curve": this.arc, "element": this};
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

        // if (isInRange(this.rotation, this.rotation + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, closer_intersection.x, closer_intersection.y)) {
        //     return closer_intersection;
        if (isInRange(this.rotation + val, this.rotation + val + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, closer_intersection.x, closer_intersection.y)) {
            return closer_intersection;
        } else {
            a = angleFromSegment(cx, cy, further_intersection.x, further_intersection.y);
            if (isInRange(this.rotation, this.rotation + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, further_intersection.x, further_intersection.y)) {
                return further_intersection;
            }
        }

        return false;

    }
}

PlanoConvexLens.prototype.getNormVec = function(curve, x, y) {
    if (curve.type == "line") {
        return normalVectorLine(curve.x1, curve.y1, curve.x2, curve.y2);
    } else {
        return normalVectorCircle(curve.centerX, curve.centerY, x, y);
    }
}













/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays. */
var PlanoConcaveLens = function(x, y, rotation, n, r, d){
    this.x = x;
    this.y = y;
    this.r = r;
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.original_rotation = rotation;
    this.n = n;
    this.extent = Math.PI;
    this.d = d;
    this.w = 0.5*d;
    this.type = "concave";

    this.rotation = this.original_rotation + (Math.PI/2 - this.extent/2);

    this.arc = new Arc(x - d*Math.sin(this.rotation), y + d*Math.cos(this.rotation), r, this.rotation + Math.PI, this.extent);

    this.generateLineSegments();
    this.recalculateCurves();
    this.generateCenter();
    this.draw(canvasState.ctx);
}

PlanoConcaveLens.prototype.print = function() {
    return "var pcc = new PlanoConcaveLens(" + this.x + "," + this.y + "," + this.r + "," + this.original_rotation + "," + this.n + "," + this.d + ");" +
            "canvasState.addShape(pcc);";
}

PlanoConcaveLens.prototype.generateLineSegments = function() {
    var x1 = this.arc.p1;
    var y1 = this.arc.q1;

    var x2 = x1 + this.w*Math.sin(this.rotation - (Math.PI/2 - this.extent/2));
    var y2 = y1 - this.w*Math.cos(this.rotation - (Math.PI/2 - this.extent/2));

    var x4 = this.arc.p2;
    var y4 = this.arc.q2;

    var x3 = x4 + this.w*Math.sin(this.rotation - (Math.PI/2 - this.extent/2));
    var y3 = y4 - this.w*Math.cos(this.rotation - (Math.PI/2 - this.extent/2));


    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(x1, y1, x2, y2));
    this.lineSegments.push(new LineSegment(x2, y2, x3, y3));
    this.lineSegments.push(new LineSegment(x3, y3, x4, y4));

}

PlanoConcaveLens.prototype.recalculateCurves = function() {
    this.arc.x = this.x;
    this.arc.y = this.y;
}

PlanoConcaveLens.prototype.generateCenter = function() {
    this.arc.generateCenterOfCircle();
    this.centerX = this.arc.centerX;
    this.centerY = this.arc.centerY;
}

PlanoConcaveLens.prototype.draw = function(ctx) {
    this.recalculateCurves();
    this.generateCenter();
    this.generateLineSegments();

    var grd = ctx.createLinearGradient(this.x,this.y,this.x + this.r, this.y + this.r);
    grd.addColorStop(0,this.color1);
    grd.addColorStop(1,this.color2);

    ctx.fillStyle = grd;

    var arc = this.arc;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, arc.r, arc.rotation, arc.rotation + arc.extent);
    ctx.stroke();

    var curLineSeg = this.lineSegments[2];
    for (var i = this.lineSegments.length - 1; i >= 0; i -= 1) {
        curLineSeg = this.lineSegments[i];
        ctx.lineTo(curLineSeg.x1, curLineSeg.y1);
        ctx.stroke();
    }

    ctx.fill();
}

PlanoConcaveLens.prototype.setRotation = function(rotation) {
    this.rotation = mod(rotation, 2*Math.PI);
    this.arc.rotation = this.rotation + Math.PI;
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
    return !this.arc.contains(x, y) && boxContains(x1, y1, x2, y2, x3, y3, x4, y4, x, y);
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

    this.arc.draw(ctx);
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
            q1 = Math.sqrt(cr*cr-Math.pow(x1-cx, 2)) + cy;
            q2 = -Math.sqrt(cr*cr-Math.pow(x1-cx, 2)) + cy;
        } else {
            var m = (y2 - y1)/(x2 - x1);
            q1 = m*(p1-x1) + y1;
            q2 = m*(p2-x1) + y1;
        }

        var dist1 = distance(p1, q1, x1, y1);
        var dist2 = distance(p2, q2, x1, y1);

        var intersection1 = {"x": p1, "y": q1, "curve": this.arc, "element": this};
        var intersection2 = {"x": p2, "y": q2, "curve": this.arc, "element": this};
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
        if (isInRange(this.rotation, this.rotation + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, closer_intersection.x, closer_intersection.y)) {
            return closer_intersection;
        } else {
            a = mod(angleFromSegment(cx, cy, further_intersection.x, further_intersection.y) + Math.PI, 2*Math.PI);
            if (isInRange(this.rotation, this.rotation + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, further_intersection.x, further_intersection.y)) {
                return further_intersection;
            }
        }

        return false;

    }
}

PlanoConcaveLens.prototype.getNormVec = function(curve, x, y) {
    var normVec1;
    if (curve.type == "line") {
        return normalVectorLine(curve.x1, curve.y1, curve.x2, curve.y2);
    } else {
        normVec1 = normalVectorCircle(curve.centerX, curve.centerY, x, y);
        return [-normVec1[0], -normVec1[1]];
    }
}

