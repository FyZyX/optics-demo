/** Defines the CircPlanoConcaveLens class. */
var CircPlanoConcaveLens = function(x, y, rotation, n, r, semi_diameter, w) {
    Element.apply(this, arguments);
    this.r = r;
    this.w = w;
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.rotation = rotation;
    this.w = w;
    this.semi_diameter = semi_diameter;

    this.attributes = {"radius": this.r, "semi_diameter": semi_diameter, "n": n, "width": w};

    this.extent = 2*Math.asin(semi_diameter/r);
    var a = semi_diameter;
    var s = r - Math.sqrt(r*r - a*a);
    var l = s+w;
    var d = (l-s)/2;

    this.arc = new Arc(x - d*Math.sin(rotation)/2, y + d*Math.cos(rotation)/2, r, rotation, this.extent);
    this.draw(canvasState.ctx);
}

CircPlanoConcaveLens.prototype.updateAttribute = function(key, value) {
    this.attributes[key] = value;
    if (key == "width") {
        this.w = value;
    } else if (key == "radius") {
        this.r = value;
    } else if (key == "semi_diameter") {
        this.semi_diameter = value;
    } else {
        this.n = value;
    }

    canvasState.valid = false;
    this.draw(canvasState.ctx);
}

CircPlanoConcaveLens.prototype.generateLineSegments = function() {
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

CircPlanoConcaveLens.prototype.recalculateCurves = function() {
    this.extent = 2*Math.asin(this.semi_diameter/this.r);
    var a = this.semi_diameter;
    var s = this.r - Math.sqrt(this.r*this.r - a*a);
    var l = s+w;
    var d = (l-s)/2;

    this.arc.x = this.x - this.w*Math.sin(this.rotation)/2;
    this.arc.y = this.y + this.w*Math.cos(this.rotation)/2;
    this.arc.extent = this.extent;
    this.arc.r = this.r;
}

CircPlanoConcaveLens.prototype.generateCenter = function() {
    this.arc.generateCenterOfCircle();
    this.centerX = this.arc.centerX;
    this.centerY = this.arc.centerY;
}

CircPlanoConcaveLens.prototype.displayInfo = function(ctx) {
    ctx.font = "12px serif";
    ctx.fillStyle = "black";
    ctx.fillText("Plano-convex lens\n(" + this.x + ", " + this.y + ")", this.x + 10, this.y);
}

CircPlanoConcaveLens.prototype.drawCenter = function(ctx) {
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
}


CircPlanoConcaveLens.prototype.draw = function(ctx) {
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

CircPlanoConcaveLens.prototype.setRotation = function(rotation) {
    this.rotation = mod(rotation, 2*Math.PI);
    this.arc.rotation = this.rotation;
}

CircPlanoConcaveLens.prototype.contains = function(x, y) {
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

CircPlanoConcaveLens.prototype.highlight = function(ctx) {
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

CircPlanoConcaveLens.prototype.intersection = function(ray) {
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


CircPlanoConcaveLens.prototype.intersectionBox = function(ray) {
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


CircPlanoConcaveLens.prototype.intersectionArc = function(ray) {

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
            if (isInRange(this.rotation + val, this.rotation + val + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, further_intersection.x, further_intersection.y)) {
                return further_intersection;
            }
        }

        return false;

    }
}

CircPlanoConcaveLens.prototype.getNormVec = function(curve, x, y) {
    if (curve.type == "line") {
        return normalVectorLine(curve.x1, curve.y1, curve.x2, curve.y2);
    } else {
        return normalVectorCircle(curve.centerX, curve.centerY, x, y);
    }
}
