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