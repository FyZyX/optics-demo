/** This file defines the Ray class. The ray specifies the beam of light that
  * will be shot out from the starting point in our game. */

var Ray = function(x, y, angle) {
    this.x = x;
    this.y = y;
    this.original_angle = angle;
    this.intersectionLimit = 50;
    this.reset();
}

Ray.prototype.addToPath = function(x, y) {
    this.path.push([x, y]);
}

Ray.prototype.reset = function() {
    this.x1 = this.x;
    this.y1 = this.y;
    this.angle = this.original_angle;
    this.path = [[this.x1, this.y1]];
    this.n = 1;
    this.setEndpoints();
    this.hittingWinWall = false;
    this.hittingLoseWall = false;
}

Ray.prototype.setAngle = function(angle) {
    this.angle = mod(angle, 2*Math.PI);
}

Ray.prototype.setEndpoints = function() {
    var x1 = this.x1;
    var y1 = this.y1;
    var x2 = this.x1 + Number.MAX_SAFE_INTEGER*Math.cos(this.angle);
    var y2 = this.y1 + Number.MAX_SAFE_INTEGER*Math.sin(this.angle);

    var boundaries = canvasState.getBoundaries();
    var curLineSeg, curIntersectPt;
    for (var i = 0; i < 4; i += 1) {
        curLineSeg = boundaries[i];
        curIntersectPt = checkLineIntersection(x1, y1, x2, y2, curLineSeg.x1, curLineSeg.y1, curLineSeg.x2, curLineSeg.y2);

        if (curIntersectPt && !(approxeq(curIntersectPt.x, x1, 0.001) && approxeq(curIntersectPt.y, y1, 0.001))) {
            this.x2 = Math.round(curIntersectPt.x);
            this.y2 = Math.round(curIntersectPt.y);
            return;
        }
    }
}

/** Takes in a PATH (array of [x, y] coordinates), and draws lines between
  * them. */
Ray.prototype.drawPath = function() {
    ctx.strokeStyle = '#e600e5';
    ctx.lineWidth = rayLineWidth;
    ctx.beginPath();
    ctx.moveTo(this.path[0][0], this.path[0][1]);
    for (var i = 1; i < this.path.length; i += 1) {
        ctx.lineTo(this.path[i][0], this.path[i][1]);
        ctx.moveTo(this.path[i][0], this.path[i][1]);
    }
    ctx.stroke();
}

Ray.prototype.getIntersection = function(elements) {
    var intersection, intersections = [];
    var numElements = elements.length;
    for (var i = 0; i < numElements; i += 1) {
        intersection = elements[i].intersection(this);
        if (intersection && !(approxeq(intersection.x, this.x1, 0.01) && approxeq(intersection.y, this.y1, 0.01))) {
            intersections.push(intersection);
        }
    }

    if (intersections.length > 0) {
        // choose the intersection point that is closest to the ray's starting point
        var cur_dist, cur_point;
        var closest_point = intersections[0];
        var min_dist = distance(closest_point.x, closest_point.y, this.x1, this.y1);
        for (var i = 0; i < intersections.length; i += 1) {
            cur_point = intersections[i];
            cur_dist = distance(cur_point.x, cur_point.y, this.x1, this.y1);
            if (cur_dist < min_dist) {
                closest_point = cur_point;
                min_dist = cur_dist;
            }
        }

        return closest_point;
    } else {
        return false;
    }
}


/** Ray trace a ray object on the screen. */
Ray.prototype.rayTrace = function(elements, boundaries) {
    var intersection, new_angle, curve;
    var ray = this;
    this.reset();

    for (var i = 0; i < this.intersectionLimit; i += 1) {
        intersection = this.getIntersection(elements);

        if (intersection) {
            ray.addToPath(intersection.x, intersection.y);
            curve = intersection.curve;

            // If the ray intersects with a wall, we are done.
            if (intersection.element.n < 0) {
                if (intersection.element.type == "winwall") {
                    this.hittingWinWall = true;
                } else if (intersection.element.type == "losewall") {
                    this.hittingLoseWall = true;
                }
                ray.drawPath();
                return;
            } else {
                // create a vector from the ray's start and end points
                var rayVec = new Vector(1, ray.angle);
                var normVec = intersection.element.getNormVec(curve, intersection.x, intersection.y);

                var entering = dotProduct(rayVec, normVec) < 0;
                var n2 = (entering) ? intersection.element.n : 1;
                var t_vec = refract(rayVec, normVec, ray.n, n2);

                // CHECK FOR TIR and mirrors
                if (isNaN(t_vec.angle)) {
                    t_vec = reflect(rayVec, normVec, ray.n)
                } else {
                    ray.n = n2;
                }

                ray.setAngle(t_vec.angle);
            }

            ray.x1 = intersection.x;
            ray.y1 = intersection.y;
            ray.setEndpoints();
        } else {
            break;
        }
    }

    for (var i = 0; i < boundaries.length; i += 1) {
        intersection = boundaries[i].intersection(ray);
        if (intersection && !(approxeq(intersection.x, ray.x1, 0.01) && approxeq(intersection.y, ray.y1, 0.01))) {
            ray.addToPath(intersection.x, intersection.y);
            break;
        }
    }

    ray.drawPath();
}
