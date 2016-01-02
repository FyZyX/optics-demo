/** This file defines various helper functions used by different classes. */

/** Returns the distance between two points (x1, y1) and (x2, y2). */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

Array.prototype.extend = function (other_array) {
    other_array.forEach(function(v) {this.push(v)}, this);
}

function onLineSeg(x, y, endx, endy, px, py) {
    return approxeq(distance(x, y, px, py)+distance(endx, endy, px, py), distance(x, y, endx, endy));
}


// returns a normal vector to a line segment given its endpoints
function normalVectorLine(x1, y1, x2, y2)
    {return [-(y2 - y1), (x2 - x1)];}

// returns a normal vector to a circle given its center and a point on its circumference
function normalVectorCircle(x0, y0, x, y)
    {return [x - x0, y - y0];}

// returns the value of the dot product of two vectors (arrays [x,y])
function dotProduct(v1, v2)
    {return v1[0]*v2[0] + v1[1]*v2[1];}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function midpoint(x1, y1, x2, y2) {
    return [(x1+x2)/2, (y1+y2)/2];
}

// returns the magnitude of a vector that is represented by an array [x,y]
function magnitude(vector)
    {return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));}

// returns true if the V1 and V2 are within epsilon of each other
function approxeq(v1, v2, epsilon) {
  if (epsilon == null) {
    epsilon = 0.001;
  }
  return Math.abs(v1 - v2) < epsilon;
};

/** Returns the dot product of two vectors V1 and V2. */
function dotProduct(v1, v2) {return v1[0]*v2[0] + v1[1]*v2[1];}

/** Returns the (x, y) coordinate that is the reflection of (p, q) about the
  * line segment defined by [(x1, y1), (x2, y2)]. */
function mirror(p, q, x1, y1, x2, y2) {
   var dx,dy,a,b;
   var x2,y2;
   var new_x, new_y;

   dx = x2 - x1;
   dy = y2 - y1;

   a = (dx * dx - dy * dy) / (dx * dx + dy*dy);
   b = 2 * dx * dy / (dx*dx + dy*dy);

   new_x = Math.round(a * (p - x1) + b*(q - y1) + x1);
   new_y = Math.round(b * (p - x1) - a*(q - y1) + y1);

   return [new_x, new_y];
}



function quadraticFormula(a, b, c) {
    return ((-b - Math.sqrt(b*b - 4*a*c))/(2*a));
}


function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return false
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
        return result;
    } else {
        return false;
    }
}


function lineSegIntersection(lineSeg1, lineSeg2) {
    return checkLineIntersection(lineSeg1.x1, lineSeg1.y1, lineSeg1.x2, lineSeg1.y2, lineSeg2.x1, lineSeg2.y1, lineSeg2.x2, lineSeg2.y2);
}


function circleLineIntersect(x1, y1, x2, y2, cx, cy, cr) {
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

        if (dist1 < dist2) {
            return {"x": p1, "y": q1};
        } else {
            return {"x": p2, "y": q2};
        }
    }

}


function isInRange(from, to, angle){
   var from = mod(from, 2*Math.PI);
   var to = mod(to, 2*Math.PI);

    if(from > to) {
        return ((angle > from) || ( angle < to));
    } else if ( to > from) {
        return ((angle < to) && ( angle > from));
    } else { // to == from
        return (angle == to);
    }
}


function angleFromSegment(x1, y1, x2, y2) {
    return mod(Math.atan2(y2 - y1, x2 - x1), 2*Math.PI);
}


/*
Updates the ray angle upon intersection with an optical element based on
    n1:         the index of refraction of the first medium
    n2:         the index of refraction of the second medium
    ray:        the ray object
    element:    the object that was intersected (line segment or circle)
    P:          the intersection point represented as an array [x,y]
*/

function refractedAngle(n1, n2, ray, element, P) {

    // --BEGIN INNER FUNCTIONS--

    // returns a normal vector to a line segment given its endpoints
    function normalVectorLine(x1, y1, x2, y2)
        {return [-(y2 - y1), (x2 - x1)];}

    // returns a normal vector to a circle given its center and a point on its circumference
    function normalVectorCircle(x0, y0, x, y) {
        return [x - x0, y - y0];
    }

    // returns the magnitude of a vector that is represented by an array [x,y]
    function magnitude(vector)
        {return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));}

    // returns the value of the dot product of two vectors (arrays [x,y])
    function dotProduct(v1, v2)
        {return v1[0]*v2[0] + v1[1]*v2[1];}

    // --END INNER FUNCTIONS--

    // --BEGIN COMPUTATIONS--

    // create a vector from the ray's start and end points
    var rayVec = [ray.x2 - ray.x1, ray.y2 - ray.y1];

    /*
    determine the appropriate normal vector depending on
    the optical element being intersected

    element.type is a text string variable that contains the kind of element being intersected
    */
    if (element.type === "line") {
        var NormVec = normalVectorLine(element.x1, element.y1, element.x2, element.y2);
    } else if (element.type === "arc") {
        var NormVec = normalVectorCircle(element.centerX, element.centerY, P[0], P[1]);
    }

    // find the dot product of the two vectors (needed for finding angle)
    var dot = dotProduct(rayVec, NormVec);

    /*
    use the geometric interpretation of the dot product to determine
    the angle between the ray and line segment
    */
    var angle = Math.acos(dot/(magnitude(rayVec)*magnitude(NormVec)));
    // determine the appropriate incident angle (relative to the normal) from angle
    var theta_i = dot > 0 ? angle : Math.PI - angle;

    // compute the ray's new trajectory (transmitted angle) from the incident angle

    // apply Snell's Law
    var theta_t = Math.asin((n1/n2)*Math.sin(theta_i));
    // determine the change in ray angle from incident to transmitted
    var deflection = theta_t - theta_i;

    // it is assumed that n2 >= n1. Deal with the remaining case
    if (n2 < n1) {deflection *= -1;}
    // adjust the ray angle according to its deflection from the normal

    if (element.type === "line") {
        var rotation = angleFromSegment(element.x1, element.y1, element.x2, element.y2);
    } else if (element.type === "arc") {
        var x = P[0];
        var y = P[1];
        var tanLineVec = normalVectorLine(x, y, x+NormVec[0], y+NormVec[1]);
        var rotation = Math.atan2(-tanLineVec[1], -tanLineVec[0]);
    }

    var diff = mod(ray.angle - rotation, 2*Math.PI);

    if ((diff > 0 && diff < Math.PI/2) ||
        (diff > 3*Math.PI/2 && diff < 2*Math.PI)) {
        return ray.angle + deflection;
    } else {
        return ray.angle - deflection;
    }

    // --END COMPUTATIONS--

}

















/*
Updates the ray angle upon intersection with an optical element based on
    n1:         the index of refraction of the first medium
    n2:         the index of refraction of the second medium
    ray:        the ray object
    element:    the object that was intersected (line segment or circle)
    P:          the intersection point represented as an array [x,y]
*/

function refractedAngle2(n1, n2, ray, element, P) {

    // --BEGIN INNER FUNCTIONS--

    // returns a normal vector to a line segment given its endpoints
    function normalVectorLine(x1, y1, x2, y2)
        {return [-(y2 - y1), (x2 - x1)];}

    // returns a normal vector to a circle given its center and a point on its circumference
    function normalVectorCircle(x0, y0, x, y) {
        return [x - x0, y - y0];
    }

    // returns the magnitude of a vector that is represented by an array [x,y]
    function magnitude(vector)
        {return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));}

    // returns the value of the dot product of two vectors (arrays [x,y])
    function dotProduct(v1, v2)
        {return v1[0]*v2[0] + v1[1]*v2[1];}

    // --END INNER FUNCTIONS--

    // --BEGIN COMPUTATIONS--

    // create a vector from the ray's start and end points
    var rayVec = [ray.x2 - ray.x1, ray.y2 - ray.y1];

    /*
    determine the appropriate normal vector depending on
    the optical element being intersected

    element.type is a text string variable that contains the kind of element being intersected
    */
    if (element.type === "line") {
        var NormVec = normalVectorLine(element.x1, element.y1, element.x2, element.y2);
    } else if (element.type === "arc") {
        var NormVec = normalVectorCircle(element.centerX, element.centerY, P[0], P[1]);
    }

    // find the dot product of the two vectors (needed for finding angle)
    var dot = dotProduct(rayVec, NormVec);
    /*
    use the geometric interpretation of the dot product to determine
    the angle between the ray and line segment
    */
    var angle = Math.acos(dot/(magnitude(rayVec)*magnitude(NormVec)));
    // determine the appropriate incident angle (relative to the normal) from angle
    var theta_i = dot > 0 ? angle : Math.PI - angle;

    // compute the ray's new trajectory (transmitted angle) from the incident angle

    // apply Snell's Law
    var theta_t = Math.asin((n1/n2)*Math.sin(theta_i));
    // determine the change in ray angle from incident to transmitted
    var deflection = theta_t - theta_i;
    deflection *= -1;
    // it is assumed that n2 >= n1. Deal with the remaining case
    if (n2 < n1) {deflection *= -1;}
    // adjust the ray angle according to its deflection from the normal

    if (element.type === "line") {
        var rotation = angleFromSegment(element.x1, element.y1, element.x2, element.y2);
    } else if (element.type === "arc") {
        var x = P[0];
        var y = P[1];
        var tanLineVec = normalVectorLine(x, y, x+NormVec[0], y+NormVec[1]);
        var rotation = Math.atan2(-tanLineVec[1], -tanLineVec[0]);
    }

    var diff = mod(ray.angle - rotation, 2*Math.PI);

    if ((diff > 0 && diff < Math.PI/2) ||
        (diff > 3*Math.PI/2 && diff < 2*Math.PI)) {
        return ray.angle + deflection;
    } else {
        return ray.angle - deflection;
    }

    // --END COMPUTATIONS--

}













function normalVector(x1, y1, x2, y2) {return [-(y2 - y1), (x2 - x1)];}

function dotProduct(v1, v2) {return v1[0]*v2[0] + v1[1]*v2[1];}

function boxContains(x1, y1, x2, y2, x3, y3, x4, y4, x, y) {
    var vs = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]];
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
function test1() {
    var m = 1;
    var b = -10;
    var minx = -1000;
    var miny = -1000;
    var maxx = 1000;
    var maxy = 1000;

    var lineSeg = new LineSegment(m, b, minx, miny, maxx, maxy);
    var ray = new Ray(0, 0, -Math.PI/4);

    console.log(lineSeg.intersection(ray));
}

function test2() {
    var ray = new Ray(50, 50, Math.atan(7/6));
    var box = new Box(59, 63, 1, "blue", 10, 20);
    console.log(box.intersection(ray));
}
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
    var ray = this;
    var numElements = elements.length;
    for (var i = 0; i < numElements; i += 1) {
        intersection = elements[i].intersection(ray);
        if (intersection && !(approxeq(intersection.x, ray.x1, 0.01) && approxeq(intersection.y, ray.y1, 0.01))) {
            intersections.push(intersection);
        }
    }

    if (intersections.length > 0) {
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

        return closest_point;
    } else {
        return false;
    }
}


Ray.prototype.getReflectionAngle = function(intersection, normVec) {
    var ray = this;
    var curve = intersection.curve;

    if (curve.type == "arc") {
        var x = intersection.x;
        var y = intersection.y;
        var tanLine = normalVectorLine(x, y, x+normVec[0], y+normVec[1]);
        var p = mirror(ray.x2, ray.y2, x, y, x+tanLine[0], y+tanLine[1]);
    } else {
        var p = mirror(ray.x2, ray.y2, curve.x1, curve.y1, curve.x2, curve.y2);
    }
    var x2 = p[0];
    var y2 = p[1];

    return Math.atan2(y2 - intersection.y, x2 - intersection.x);
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
                var rayVec = [ray.x2 - ray.x1, ray.y2 - ray.y1];
                var normVec = intersection.element.getNormVec(curve, intersection.x, intersection.y);
                var entering = dotProduct(rayVec, normVec) < 0;
                var n2 = (entering && intersection.element.n != 0) ? intersection.element.n : 1;
                new_angle = refractedAngle(ray.n, n2, ray, intersection.curve, [intersection.x, intersection.y]);

                // CHECK FOR TIR and mirrors
                if (new_angle == undefined || isNaN(new_angle) || intersection.element.n == 0) {
                    new_angle = this.getReflectionAngle(intersection, normVec);
                } else {
                    ray.n = n2;
                }

                ray.setAngle(new_angle);
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
/** Defines the Laser class. A Laser is defined by an (X, Y) position, an ANGLE,
  * the NUMBER OF RAYS in it, and the height H over which those rays are spread
  * evenly between. */
var Laser = function(x, y, h, rotation, numRays) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.rotation = rotation;
    this.numRays = numRays;

    this.rays = [];
    var spacing = h/numRays;
    for (var i = 0; i < this.numRays; i += 1) {
        this.rays.push(new Ray(x - i*spacing*Math.sin(rotation), y + i*spacing*Math.cos(rotation), rotation));
    }

}

Laser.prototype.shootLaser = function(elements, boundaries) {
    var numRays = this.rays.length;
    for (var i = 0; i < numRays; i += 1) {
        this.rays[i].rayTrace(elements, boundaries);
    }

    var numRaysHittingWinWall = 0;
    for (var i = 0; i < numRays; i += 1) {
        if (this.rays[i].hittingWinWall) {
            numRaysHittingWinWall += 1;
        } else if (this.rays[i].hittingLoseWall) {
            return {"win": false, "lose": true};
        }
    }

    if (numRaysHittingWinWall == this.numRays) {
        return {"win": true, "lose": false};
    } else {
        return {"win": false, "lose": false}
    }
}
/** The CanvasState object is responsible for keeping track of and rendering
  * all of the optical elements on the screen, as well as ray tracing a ray. */

var mouseOverObject = false;
var c = 0;

function CanvasState(canvas) {
    // **** First some setup! ****
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    // **** Keep track of state! ****

    this.valid = false; // when set to false, the canvas will redraw everything
    this.opticalElements = [];  // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

    var myState = this;

    // fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var opticalElements = myState.opticalElements;
        var l = opticalElements.length;
        for (var i = l-1; i >= 0; i--) {
            if (opticalElements[i].contains(mx, my) && !(opticalElements[i].wall && playing)) {
                var mySel = opticalElements[i];
                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                if (shiftKeyPressed) {
                    myState.mouseAngle = Math.atan2(my - mySel.y, mx - mySel.x);
                    myState.rotating = true;
                } else {
                    myState.dragoffx = mx - mySel.x;
                    myState.dragoffy = my - mySel.y;
                    myState.dragging = true;
                }
                myState.selection = mySel;
                myState.last_angle = myState.selection.rotation;
                myState.valid = false;
                return;
            }
        }

        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (myState.selection) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }

    }, true);

    canvas.addEventListener('mousemove', function(e) {
        if (myState.dragging) {
            var mouse = myState.getMouse(e);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            myState.selection.x = mouse.x - myState.dragoffx;
            myState.selection.y = mouse.y - myState.dragoffy;
            myState.valid = false; // Something's dragging so we must redraw
        } else if (myState.rotating) {
            var mouse = myState.getMouse(e);
            var new_angle = Math.atan2(mouse.y - myState.selection.y, mouse.x - myState.selection.x);
            myState.selection.setRotation(myState.last_angle + new_angle - myState.mouseAngle);
            myState.valid = false;
        } else {
            var mouse = myState.getMouse(e);
            var mx = mouse.x;
            var my = mouse.y;
            var opticalElements = myState.opticalElements;
            var l = opticalElements.length;
            for (var i = l-1; i >= 0; i--) {
                if (opticalElements[i].contains(mx, my) && !(opticalElements[i].wall && playing)) {
                    mouseOverObject = true;
                    return;
                }
            }
            mouseOverObject = false;
        }
    }, true);

    canvas.addEventListener('mouseup', function(e) {
        myState.dragging = false;
        myState.rotating = false;
    }, true);

    // double click for making new opticalElements
    canvas.addEventListener('dblclick', function(e) {
        var mouse = myState.getMouse(e);
        var glass_box = new GlassBox(mouse.x - 10, mouse.y - 10, 200, 200, 0);
        myState.addShape(glass_box);
    }, true);

    // **** Options! ****

    this.selectionColor = '#660066';
    this.selectionWidth = 2;
    requestAnimationFrame(this.draw.bind(this));
}

CanvasState.prototype.addShape = function(object) {
    this.opticalElements.push(object);
    this.valid = false;
}

CanvasState.prototype.getOpticalElements = function() {
    return this.opticalElements;
}

CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
}


/** While draw is called as often as requestAnimationFrame demands, it only ever
  * does something if the canvas gets invalidated by our code. */
CanvasState.prototype.draw = function() {
    if (shiftKeyPressed && mouseOverObject) {
        var elementToChange = document.getElementsByTagName("body")[0];
        elementToChange.style.cursor = "url('images/cursor.png') 9 10, auto";
    } else {
        var elementToChange = document.getElementsByTagName("body")[0];
        elementToChange.style.cursor = "default";
    }

    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        c = 1;
        var ctx = this.ctx;
        var opticalElements = this.opticalElements;
        this.clear();

        // ** Add stuff you want drawn in the background all the time here **

        // draw all opticalElements
        var l = opticalElements.length;
        for (var i = 0; i < l; i++) {
            var shape = opticalElements[i];
            // We can skip the drawing of elements that have moved off the screen:
            // if (shape.centerX > this.width || shape.centerY > this.height ||
            //     shape.centerX + shape.w < 0 || shape.centerY + shape.h < 0) continue;
            opticalElements[i].draw(ctx);

            if ((displayElementInfo == "When selected" && this.selection == opticalElements[i]) || displayElementInfo == "Always") {
                opticalElements[i].displayInfo(ctx);
            }
        }

        // draw selection
        // right now this is just a stroke along the edge of the selected Shape
        if (this.selection != null) {
          var mySel = this.selection;
          mySel.highlight(ctx);
        }

        // ** Add stuff you want drawn on top all the time here **

        var result;
        if (this.laser) {
            result = this.shootLaser(this.laser);
            if (result.win && playing) {
                var nextLevel = window.confirm("You Win!");
                if (nextLevel) {
                    curLevel += 1;
                    curLevel = mod(curLevel, numLevels);
                }
                startLevel(curLevel);
            } else if (result.lose && playing) {
                if (c != 0) {
                    alert("You Lose!");
                    startLevel(curLevel);
                }
            }
        }

        this.valid = true;
    }

    requestAnimationFrame(this.draw.bind(this));
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {

    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
}


CanvasState.prototype.getBoundaries = function(ray) {
    var boundaries = [];
    boundaries.push(new LineSegment(0, 0, this.width, 0));
    boundaries.push(new LineSegment(0, 0, 0, this.height));
    boundaries.push(new LineSegment(this.width, 0, this.width, this.height));
    boundaries.push(new LineSegment(0, this.height, this.width, this.height));
    return boundaries;
}


/** Ray trace a ray object on the screen. */
CanvasState.prototype.shootLaser = function(laser) {
    return laser.shootLaser(this.opticalElements, this.getBoundaries());
}

CanvasState.prototype.clearElements = function() {
    this.opticalElements = [];
}

CanvasState.prototype.setLaser = function(laser) {
    this.laser = laser;
}
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
    var h;

    var a = 1;
    var b = -2*r;
    var c = w*w/4;

    h = quadraticFormula(a, b, c);

    var d = r - h/2;

    this.centerX = this.x + d*Math.sin(this.rotation);
    this.centerY = this.y - d*Math.cos(this.rotation);

    this.p1 = this.r*Math.cos(this.rotation) + this.centerX;
    this.q1 = this.r*Math.sin(this.rotation) + this.centerY;
    this.p2 = this.r*Math.cos(this.rotation + this.extent) + this.centerX;
    this.q2 = this.r*Math.sin(this.rotation + this.extent) + this.centerY;
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
    this.extent = Math.PI;
    this.rotation = rotation;

    this.arc = new Arc(x - this.w*Math.cos(rotation)/2, y + this.w*Math.sin(rotation)/2, r, rotation, this.extent + rotation);

    this.generateLineSegments();
    this.recalculateCurves();
    this.generateCenter();
    this.draw(canvasState.ctx);
}

PlanoConvexLens.prototype.generateLineSegments = function() {
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

    var curLineSeg = this.lineSegments[0];
    ctx.beginPath();
    ctx.moveTo(curLineSeg.x1, curLineSeg.y1);
    for (var i = 0; i < this.lineSegments.length; i += 1) {
        curLineSeg = this.lineSegments[i];
        ctx.lineTo(curLineSeg.x2, curLineSeg.y2);
    }

    ctx.stroke();
    this.arc.draw(ctx);
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

        if (isInRange(this.rotation, this.rotation + this.extent, a) && onLineSeg(ray.x1, ray.y1, ray.x2, ray.y2, closer_intersection.x, closer_intersection.y)) {
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

var w = 12850;
var h = 6470;
var ratio = w/h;

var canvas_width = 1285;
var canvas_height = 647;

function getCoordinates(x, y) {
    x = x*w/canvas_width;
    y = y*h/canvas_height;
    return {"x": x, "y": y};
}

function getScreenPosition(x, y) {
    x = x*canvas_width/w;
    y = y*canvas_height/h;
    return {"x": x, "y": y};
}
/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

var canvasState;
var mousePointer;
var rayLineWidth = 3;
var shiftKeyPressed = false;
var curLevel = 0;
var numLevels = 3;
var displayElementInfo = "Never";


window.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
        generateLevelFile();
    } else if (e.shiftKey && !shiftKeyPressed) {
        shiftKeyPressed = true;
    } else if (e.keyCode > 47 && e.keyCode < 51) {
        startLevel(e.keyCode - 48);
    }
}, true);

window.addEventListener("keyup", function(e) {
    if (shiftKeyPressed && !e.shiftKey) {
        shiftKeyPressed = false;
    }
}, true);

window.addEventListener("mousedown", function(e) {
    var vid = document.getElementById("myVideo");
    if (vid) {
        vid.remove();
        startPlaying();
    }
}, true);


function toggleElementInfo() {
    var selection_list = document.getElementById("elementInfo");
    displayElementInfo = selection_list[selection_list.selectedIndex].value;
    canvasState.valid = false;
}




function generateLevelFile() {
    if (!playing) {
        var opticalElements = canvasState.opticalElements;
        var string = "";

        var element;
        for (var i = 0; i < opticalElements.length; i += 1) {
            element = opticalElements[i];
            string += element.print();
        }

        string += canvasState.laser.print();

        window.open().document.write(string);
    }
}


var level0 = "var b = new Box(298,187,15,80,0.07760492258740825,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new Box(481,210,15,80,2.654072175223533,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new Box(272,437,270,230,6.193728413012803,1.33,'#33cccc','#ccffcc');canvasState.addShape(b);var b = new Wall(895,348,15,300,0);canvasState.addShape(b);var b = new Wall(587,81,15,300,0);canvasState.addShape(b);var b = new Wall(590,409,15,300,0);canvasState.addShape(b);var b = new Wall(895,680,15,300,0);canvasState.addShape(b);var b = new Wall(998,113,15,300,0);canvasState.addShape(b);var b = new WinWall(1075,382,15,100,0);canvasState.addShape(b);var l = new Laser(0,200,70,5.890486225480862,1);canvasState.setLaser(l);";
var level1 = "var b = new Box(796,526,15,150,4.06609060451356,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new WinWall(9,515,15,35,0);canvasState.addShape(b);var b = new Wall(308,435,15,150,0);canvasState.addShape(b);var b = new Wall(308,595,15,150,0);canvasState.addShape(b);var b = new Wall(61,353,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(241,353,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(61,600,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(241,600,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Box(453,301,15,150,2.502010470300501,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var pcc = new PlanoConcaveLens(1028,421,100,0.1,1.5,120);canvasState.addShape(pcc);var pcv = new PlanoConvexLens(747,670,150,3.6716097343392304,1.5,50);canvasState.addShape(pcv);var l = new Laser(0,120,70,0,10);canvasState.setLaser(l);";
var level2 = "var b = new Box(185,469,15,250,5.492932526690764,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new WinWall(1076,530,15,250,4.709338659392787);canvasState.addShape(b);var b = new Wall(597,185,15,10,0);canvasState.addShape(b);var b = new Wall(596,132,15,10,0);canvasState.addShape(b);var b = new Wall(595,72,15,10,0);canvasState.addShape(b);var b = new Wall(597,205,15,10,0);canvasState.addShape(b);var b = new Wall(596,167,15,10,0);canvasState.addShape(b);var b = new Wall(596,150,15,10,0);canvasState.addShape(b);var b = new Wall(597,223,15,10,0);canvasState.addShape(b);var b = new Wall(596,114,15,10,0);canvasState.addShape(b);var b = new Wall(595,94,15,10,0);canvasState.addShape(b);var b = new Wall(902,424,15,350,0);canvasState.addShape(b);var b = new Wall(1071,590,15,350,1.5674842972683347);canvasState.addShape(b);var pcc = new PlanoConcaveLens(769,548,60,0.1,1.5,120);canvasState.addShape(pcc);var pcv = new PlanoConvexLens(1415,476,150,6.285375236212544,1.5,50);canvasState.addShape(pcv);var l = new Laser(0,120,70,0,10);canvasState.setLaser(l);";
// var level3 ="var b = new Box(608,187,15,150,5.488266980067955,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new Box(100,509,15,150,5.487717770714354,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new Wall(948,522,15,300,4.716022391928867);canvasState.addShape(b);var b = new Wall(1100,398,15,300,0);canvasState.addShape(b);var b = new Wall(946,277,15,300,4.71238898038469);canvasState.addShape(b);var b = new Box(804,335,15,100,0,-1,'#ff0000','#ff0000');canvasState.addShape(b);var b = new Box(804,475,15,100,0,-1,'#ff0000','#ff0000');canvasState.addShape(b);var b = new WinWall(931,414,15,100,0);canvasState.addShape(b);var pcv = new PlanoConvexLens(107,349,100,1.1864593813835507,1.5,20);canvasState.addShape(pcv);var pcv = new PlanoConvexLens(733,491,200,4.83479520174107,1.5,50);canvasState.addShape(pcv);var pcc = new PlanoConcaveLens(348,372,150,1.5707963267948966,1.5,130);canvasState.addShape(pcc);var pcc = new PlanoConcaveLens(332,723,100,1.5707963267948966,1.5,160);canvasState.addShape(pcc);var l = new Laser(0,50,70,0,10);canvasState.setLaser(l);";
var level3;
var playing = false;

var levels = {0: level0, 1: level1, 2: level2, 3: level3};

function startLevel(level) {
    canvasState.clearElements();
    canvasState.dragging = false;
    canvasState.rotating = false;
    eval(levels[level]);
}

var vid = {};

function default_load() {
    // var mirror = new Mirror(750, 400, 15, 150, 0);
    // canvasState.addShape(mirror);

    // var mirror = new Mirror(650, 400, 15, 150, 0);
    // canvasState.addShape(mirror);

    // var pos = getCoordinates(400, 400);
    // console.log(pos);

    var wall = new Wall(400, 400, 15, 300, 0);
    canvasState.addShape(wall);

    var planoConvex1 = new PlanoConvexLens(100, 200, 0, 1.5, 100, 0);
    canvasState.addShape(planoConvex1);

    // var planoConcave1 = new PlanoConcaveLens(400, 200, 0, 1.5, 100, 10);
    // canvasState.addShape(planoConcave1);

    // canvasState.addShape(pcv);
    var l = new Laser(0,50,80,0,15);
    canvasState.setLaser(l);

}



var aspect_width = 1285;
var aspect_height = 647;
var aspect_ratio = aspect_width/aspect_height;
// aspect_ratio = 2.3;

function startPlaying() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    var width = window.innerWidth - 10;
    var height = window.innerHeight - 10;
    if (width/height > aspect_ratio) {
        width = height*aspect_ratio;
    } else {
        height = width/aspect_ratio;
    }

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    canvasState = new CanvasState(document.getElementById('myCanvas'));

    default_load();
    // startLevel(1);
}


function startGame() {
    document.getElementById("myVideo").load();
    var vid = document.getElementById("myVideo");
    vid.onended = function() {
        this.remove();
        startPlaying();
    }
}

