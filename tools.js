/** This file defines various helper functions used by different classes. */

/** Returns the distance between two points (x1, y1) and (x2, y2). */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

Array.prototype.extend = function (other_array) {
    other_array.forEach(function(v) {this.push(v)}, this);
}


// returns a normal vector to a line segment given its endpoints
function normalVectorLine(x1, y1, x2, y2)
    {return [-(y2 - y1), (x2 - x1)];}

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


function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
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

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a >= 0 && a <= 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b >= 0 && b <= 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};


function circleLineIntersect(x1, y1, x2, y2, cx, cy, cr) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var a = dx * dx + dy * dy;
    var b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
    var c = cx * cx + cy * cy;

    c += x1 * x1 + y1 * y1;
    c -= 2 * (cx * x1 + cy * y1);
    c -= cr * cr;

    var bb4ac = b * b - 4 * a * c;

    if (bb4ac < 0) {
        return false;    // No collision
    } else {
        var p1 = (-b + Math.sqrt(bb4ac)) / (2*a);
        var p2 = (-b - Math.sqrt(bb4ac)) / (2*a);

        var q1, q2;
        // vertical line
        if (p1 == p2) {
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
    function normalVectorCircle(x0, y0, x, y)
        {return [x - x0, y - y0];}

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
    // if (element.type === "line segment")
    if (true)
        {var NormVec = normalVectorLine(element.x1, element.y1, element.x2, element.y2);}
    else if (element.type === "circle")
        {var NormVec = noramlVectorCircle(element.x0, element.y0, P[0], P[1]);}

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

    var rotation = angleFromSegment(element.x1, element.y1, element.x2, element.y2);
    var diff = mod(ray.angle - rotation, 2*Math.PI);

    if ((diff > 0 && diff < Math.PI/2) ||
        (diff > 3*Math.PI/2 && diff < 2*Math.PI)) {
        return ray.angle + deflection;
    } else {
        return ray.angle - deflection;
    }

    // --END COMPUTATIONS--

}