/** This file defines the classes for the curves that make up the optical
  * elements in our game. A box containing a medium in it, for example, can
  * be defined by 4 line segments. */

/** Defines the Curve class. */
var Curve = function(x, y, n, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.n = n;
    this.fill = fill || '#AAAAAA';
}

Curve.prototype.intersection = function(ray) {
    return [];
}







/** Defines the LineSegment class, a subclass of the Curve class. */
var LineSegment = function(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

/** Returns an array of the intersection points of this line segment and a ray
  * object. */
LineSegment.prototype.intersection = function(ray) {
    var intersection = checkLineIntersection(ray.x1, ray.y1, ray.x2, ray.y2, this.x1, this.y1, this.x2, this.y2);
    if (intersection.onLine1 && intersection.onLine2) {
        return [[intersection.x, intersection.y, true, this]];
    } else {
        return false;
    }
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
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
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



// function sameDirection(ray, linSeg){
//     var thisVector = new Array[2];
//     thisVector[0] = this.x1 - this.x2;
//     thisVector[1] = linSec.y1 - this.y2;
//     var rayVector = new Array[2];
//     rayVector[0] = Math.cos(ray.angle);
//     rayVector[1] = Math.sin(ray.angle);
//     return thisVector[0]*rayVector[0] + thisVector[1]*rayVector[1] > 0;
// }








// function lineIntersect(ray, this){
//     var denom = (ray.x2 - ray.x1)*(this.y2 - this.y1) - (this.x2 - this.x1)*(ray.y2 - ray.y1);
//     // returns false if the segments don't intersect, or calculates the intersection point
//     if (denom == 0) {return false}
//     else {
//         var num_1 = (this.x1 - this.x2)*(ray.x1*ray.y2 - ray.x2*ray.y1);
//         var num_2 = (ray.x1 - ray.x2)*(this.x1*this.y2 - this.x2*this.y1);
//         // calculate x coordinate of intersection
//         var x = (num_1 - num_2)/denom;
//         // check if the intersection is valid, and if so return the point
//         var onRay = (x > ray.x1 && x < ray.x2) ? true : false;
//         var onSeg = (x > this.x1 && x < this.x2) ? true : false;
//         if (onRay && onSeg) {
//             // calculate the y coordinate of intersection
//             var y = (ray.y2 - ray.y1)/(ray.x2 - ray.x1)*(x - ray.x1) + ray.y1;
//             // check if the ray is "entering" the segment
//             var m = (x2 > x1) ? -(this.x2 - this.x1)/(this.y2 - this.x2) : (this.x2 - this.x1)/(this.y2 - this.x2);
//             var nthis_y2 = m*(this.x2 - this.x1) + this.y1;
//             var dotProduct = (ray.x2 - ray.x1)*(nthis_y2 - this.y1) + (ray.y2 - ray.y1)*(this.x1 - this.x2)
//             var enter = (dotProduct > 0) ? true : false;
//             return [x, y, enter];
//         }
//     }
// }