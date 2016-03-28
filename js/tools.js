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

function mod(n, m) {
    return ((n % m) + m) % m;
}

function midpoint(x1, y1, x2, y2) {
    return [(x1+x2)/2, (y1+y2)/2];
}

// returns true if the V1 and V2 are within epsilon of each other
function approxeq(v1, v2, epsilon) {
  if (epsilon == null) {
    epsilon = 0.001;
  }
  return Math.abs(v1 - v2) < epsilon;
};


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
