/** This file defines various helper functions used by different classes. */

/** Returns the distance between two points (x1, y1) and (x2, y2). */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {this.push(v)}, this);
}

function mod(n, m) {
        return ((n % m) + m) % m;
}

approxeq = function(v1, v2, epsilon) {
  if (epsilon == null) {
    epsilon = 0.001;
  }
  return Math.abs(v1 - v2) < epsilon;
};

function dotProduct(v1, v2) {return v1[0]*v2[0] + v1[1]*v2[1];}

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