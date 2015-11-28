/** This file defines various helper functions used by different classes. */

/** Returns the distance between two points (x1, y1) and (x2, y2). */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

Array.prototype.extend = function (other_array) {
    other_array.forEach(function(v) {this.push(v)}, this);
}

function mod(n, m) {
        return ((n % m) + m) % m;
}

function midpoint(x1, y1, x2, y2) {
    return [(x1+x2)/2, (y1+y2)/2];
}

approxeq = function(v1, v2, epsilon) {
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

