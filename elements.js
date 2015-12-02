/** This file defines the classes for the optical elements that the user can
  * drag around on the screen to interact with the ray of light (i.e. mirrors,
  * CircleLenses, etc).

    The Chain of inheritance is as follows:
        Element --> Box, CircleLens
        Box     --> Mirror, Medium
*/

/** Defines the Element class. An optical element is specified by its x, y
  * position, an index of refraction n, and a color (for rendering). This
  * class is meant to be abstract. */
var Element = function(x, y, n) {
    this.x = x || 0;
    this.y = y || 0;
    this.n = n;
    this.fill = '#AAAAAA';
    this.angle = 0;
}

/** Draws this Element to a given context (render the object on the canvas). */
Element.prototype.draw = function(ctx) {
    // Implemented by subclasses
}

/** Given a RAY object, returns the first (x, y) intersection point of this
  * object and the RAY, or returns FALSE if there is no intersection point. */
Element.prototype.intersection = function(ray) {
    // Implemented by subclasses
    return false;
}




/** Defines the Box class. A box is just a rectangular optical element, so it
  * needs a width and a height in addition to the parameters specified by the
  * abstract Element class above. */
var Box = function(x, y, n, w, h){
    Element.apply(this, arguments);
    this.w = w || 1;
    this.h = h || 1;
    this.fill = "#669999";
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.generateLineSegments();
}

Box.prototype.generateLineSegments = function() {
    var x4 = this.x + this.h*Math.sin(this.angle)/2;
    var y4 = this.y - this.h*Math.cos(this.angle)/2;

    this.x1 = x4 - this.w*Math.cos(this.angle)/2;
    this.y1 = y4 - this.w*Math.sin(this.angle)/2;

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

//Box.prototype = Element.prototype;        // Set prototype to Person's
Box.prototype.constructor = Box;   // Set constructor back to Box







/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays. */
var Mirror = function(x, y, n, w, h, angle){
    Box.apply(this, arguments);
    this.w = w || 1;
    this.h = h || 1;
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.angle = angle;
    this.generateLineSegments();


    // Up, down, and move are for dragging
}

Mirror.prototype = Box.prototype;        // Set prototype to Person's
Mirror.prototype.constructor = Mirror;   // Set constructor back to Box

Mirror.prototype.setAngle = function(angle) {
    this.angle = mod(angle, 2*Math.PI);
}

Mirror.prototype.intersection = function(ray) {
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














/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays. */
var CircleLens = function(x, y, n, r, angle){
    this.x = x;
    this.y = y;
    this.n = n;
    this.r = r;
    this.fill = "#669999";
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.angle = angle;
    this.extent = Math.PI;

    this.curves = [];
    this.curves.push(new Arc(x, y, r, 0, Math.PI));
}

CircleLens.prototype.recalculateCurves = function() {
    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].x = this.x;
        this.curves[i].y = this.y;
    }
}

CircleLens.prototype.draw = function(ctx) {
    this.recalculateCurves();

    var grd = ctx.createLinearGradient(this.x,this.y,this.x + this.r, this.y + this.r);
    grd.addColorStop(0,this.color1);
    grd.addColorStop(1,this.color2);

    ctx.fillStyle = grd;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].draw(ctx);
        ctx.fill();
    }
}

CircleLens.prototype.setAngle = function(angle) {
    this.angle = mod(angle, 2*Math.PI);
    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].angle = this.angle;
    }
}

CircleLens.prototype.contains = function(x, y) {
    return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= this.r*this.r;
}

CircleLens.prototype.highlight = function(ctx) {
    this.recalculateCurves();
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;

    for (var i = 0; i < this.curves.length; i += 1) {
        this.curves[i].draw(ctx);
    }
}

CircleLens.prototype.intersection = function(ray) {
    // var intersection = circleLineIntersect(ray.x1, ray.y1, ray.x2, ray.y2, this.x, this.y, this.r);
    // if (intersection && !(approxeq(intersection.x, ray.x1, 0.1) && approxeq(intersection.y, ray.y1, 0.1))) {
    //     return {"x": intersection.x, "y": intersection.y, "curve": this.curves[0], "element":this};
    // } else {
    //     return false;
    // }

    var x1 = ray.x1;
    var x2 = ray.x2;
    var y1 = ray.y1;
    var y2 = ray.y2;
    var cx = this.x;
    var cy = this.y;
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

        var a = angleFromSegment(this.x, this.y, closer_intersection.x, closer_intersection.y);
        if (a >= this.angle && a <= this.angle + this.extent) {
            // console.log("INTERSECTION1");
            return closer_intersection;
        } else {
            a = angleFromSegment(this.x, this.y, further_intersection.x, further_intersection.y);
            if (a >= this.angle && a <= this.angle + this.extent) {
                // console.log("INTERSECTION2");
                return further_intersection;
            }
        }
        return false;

    }
}





function slopeOfEdges(circle, rotation) {
    var r = circle.r;
    var angle = circle.extent/2;
    var p = r*Math.cos(rotation + angle);
    var q = r*Math.sin(rotation + angle);
    if (p === circle.x) {
        if (q > circle.y) {return Math.PI/2;}
        else {return 3*Math.PI/2;}
    }
    else {return (q - circle.y)/(p - circle.x);}
}