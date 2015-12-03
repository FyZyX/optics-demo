/** This file defines the Ray class. The ray specifies the beam of light that
  * will be shot out from the starting point in our game. */

var intersectionLimit = 50;

var Ray = function(x, y, angle) {
    this.x = x;
    this.y = y;
    this.original_angle = angle;
    this.path = [[x, y]];
    this.x1 = x;
    this.y1 = y;
    this.angle = angle;
    this.setEndpoints();
    this.n = 1;

    this.hittingWinWall = false;
    this.hittingLoseWall = false;
}

Ray.prototype.addToPath = function(x, y) {
    this.path.push([x, y]);
}

Ray.prototype.clearPath = function() {
    this.x1 = this.x;
    this.y1 = this.y;
    this.angle = this.original_angle;
    this.path = [[this.x1, this.y1]];
    this.n = 1;
    this.setEndpoints();
}

Ray.prototype.setAngle = function(angle) {
    this.angle = mod(angle, 2*Math.PI);
}

Ray.prototype.setEndpoints = function() {
    var m = Math.tan(this.angle);

    // handle edge cases when ray is either a horizontal or vertical line
    if (this.angle == 0) {
        this.x2 = canvasState.width;
        this.y2 = this.y1;
        return;
    }
    if (this.angle == Math.PI/2) {
        this.x2 = this.x1;
        this.y2 = canvasState.height;
        return;
    } else if (this.angle == Math.PI) {
        this.x2 = 0;
        this.y2 = this.y1;
        return;
    } else if (this.angle == 3*Math.PI/2) {
        this.x2 = this.x1;
        this.y2 = 0;
        return;
    }

    // rightward will be true if the ray is traveling to the right
    var rightward = false;
    // upward will be true if the ray is traveling upward
    var upward = false;

    if (this.angle < Math.PI/2 || this.angle > 3*Math.PI/2) {
        rightward = true;
    }
    if (this.angle < Math.PI) {
        upward = true;
    }

    if (rightward) {
        var x2 = canvasState.width;
    } else {
        var x2 = 0;
    }

    var y2 = m*(x2 - this.x1) + this.y1;
    if (y2 >= 0 && y2 <= canvasState.height) {
        this.x2 = x2;
        this.y2 = y2;
    } else if (upward) {
        y2 = canvasState.height;
        this.x2 = (y2 - this.y1)/m + this.x1;
    } else {
        y2 = 0;
        this.x2 = (y2 - this.y1)/m + this.x1;
    }
    this.y2 = y2;
}

/** Takes in a PATH (array of [x, y] coordinates), and draws lines between
  * them. */
Ray.prototype.drawPath = function() {

    // coordinate vars
    var x1;
    var y1;
    var x2;
    var y2;

    for (var i = 0; i < (this.path.length-1); i += 1) {

        x1 = this.path[i][0];
        y1 = this.path[i][1];

        x2 = this.path[i+1][0];
        y2 = this.path[i+1][1];

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.strokeStyle = '#e600e5';
        ctx.lineWidth = rayLineWidth;
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

/** Ray trace a ray object on the screen. */
Ray.prototype.rayTrace = function(elements, boundaries) {
    var numIntersections = 0;
    var ray = this;

    var intersections;
    var intersection;
    var hit = true;

    this.clearPath();
    while (hit == true) {
        intersections = [];
        hit = false;
        for (var i = 0; i < elements.length; i += 1) {
            intersection = elements[i].intersection(ray);
            if (intersection && !(approxeq(intersection.x, ray.x1, 0.01) && approxeq(intersection.y, ray.y1, 0.01))) {
                intersections.push(intersection);
            }
        }

        if (intersections.length > 0 && numIntersections < intersectionLimit) {
            hit = true;
            numIntersections += 1;

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

            ray.addToPath(closest_point.x, closest_point.y);

            ray.x1 = closest_point.x;
            ray.y1 = closest_point.y;
            ray.setEndpoints();

            var curve = closest_point.curve;

            // determine whether object is a wall
            if (closest_point.element.n < 0) {
                if (closest_point.element.type == "winwall") {
                    this.hittingWinWall = true;
                } else if (closest_point.element.type == "losewall") {
                    this.hittingLoseWall = true;
                }
                ray.drawPath();
                return;
            } else {
                this.hittingWinWall = false;
                this.hittingLoseWall = false;

                var n2;

                // create a vector from the ray's start and end points
                var rayVec = [ray.x2 - ray.x1, ray.y2 - ray.y1];

                if (closest_point.curve.type == "line") {
                    var NormVec = normalVectorLine(curve.x1, curve.y1, curve.x2, curve.y2);
                } else {
                    var NormVec = normalVectorCircle(curve.centerX, curve.centerY, closest_point.x, closest_point.y);
                }

                var entering = dotProduct(rayVec, NormVec) < 0;

                // UPDATE THIS
                console.log(closest_point.element.type);
                if (closest_point.element.type == "concave") {
                    entering = !entering;
                }
                if (entering) {
                    n2 = closest_point.element.n;
                } else {
                    n2 = 1;
                }

                var new_angle;
                if (closest_point.element.type == "concave") {
                    new_angle = refractedAngle2(ray.n, n2, ray, closest_point.curve, [closest_point.x, closest_point.y]);
                } else {
                    new_angle = refractedAngle(ray.n, n2, ray, closest_point.curve, [closest_point.x, closest_point.y]);
                }

                // CHECK FOR TIR
                if (!new_angle) {
                    if (closest_point.curve.type == "arc") {
                        var x = closest_point.x;
                        var y = closest_point.y;
                        var tanLine = normalVectorLine(x, y, x+NormVec[0], y+NormVec[1]);
                        var p = mirror(ray.x2, ray.y2, x, y, x+tanLine[0], y+tanLine[1]);
                    } else {
                        var p = mirror(ray.x2, ray.y2, curve.x1, curve.y1, curve.x2, curve.y2);
                    }
                    var x2 = p[0];
                    var y2 = p[1];
                    var m = (y2 - ray.y1)/(x2 - ray.x1);

                    if (x2 - ray.x1 < 0) {
                        ray.angle = mod(Math.atan(m) + Math.PI, 2*Math.PI);
                    } else {
                        ray.angle = mod(Math.atan(m), 2*Math.PI);
                    }
                } else {
                    ray.setAngle(new_angle);
                    if (entering) {
                        // console.log("ENTERING medium with n = " + n2);
                        ray.n = closest_point.element.n;
                    } else {
                        // console.log("LEAVING to air, n = " + 1);
                        ray.n = 1;
                    }
                }
            }

            ray.setEndpoints();
        }

    }

    if (numIntersections < intersectionLimit) {
        for (var i = 0; i < boundaries.length; i += 1) {
            intersection = boundaries[i].intersection(ray);
            if (intersection) {
                ray.addToPath(intersection.x, intersection.y);
            }
        }
    }
    // console.log("\n");

    ray.drawPath();
}