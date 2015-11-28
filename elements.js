/** This file defines the classes for the optical elements that the user can
  * drag around on the screen to interact with the ray of light (i.e. mirrors,
  * lenses, etc).

    The Chain of inheritance is as follows:
        Element --> Box, Lens
        Box     --> Mirror, Medium
*/

/** Defines the Element class. An optical element is specified by its x, y
  * position, an index of refraction n, and a color (for rendering). This
  * class is meant to be abstract. */
var Element = function(x, y, n) {
    this.x = x || 0;
    this.y = y || 0;
    this.n = n;
    this.fill = '#AAAAAA';
    this.angle = 0;
}

/** Draws this Element to a given context (render the object on the canvas). */
Element.prototype.draw = function(ctx) {
    // Implemented by subclasses
}

/** Given a RAY object, returns the first (x, y) intersection point of this
  * object and the RAY, or returns FALSE if there is no intersection point. */
Element.prototype.intersects = function(ray) {
    // Implemented by subclasses
    return false;
}




/** Defines the Box class. A box is just a rectangular optical element, so it
  * needs a width and a height in addition to the parameters specified by the
  * abstract Element class above. */
var Box = function(x, y, n, w, h){
    Element.apply(this, arguments);
    this.w = w || 1;
    this.h = h || 1;
    this.fill = "#669999";
    this.generateLineSegments();
    this.generateCenter();
}


Box.prototype.generateLineSegments = function() {
    var x1, x2, x3, x4;
    var y1, y2, y3, y4;

    this.x1 = this.x;
    this.y1 = this.y;

    this.x4 = this.x1 + this.w*Math.cos(this.angle);
    this.y4 = this.y1 + this.w*Math.sin(this.angle);

    this.x2 = this.x1 - this.h*Math.sin(this.angle);
    this.y2 = this.y1 + this.h*Math.cos(this.angle);

    this.x3 = this.x4 - this.h*Math.sin(this.angle);
    this.y3 = this.y4 + this.h*Math.cos(this.angle);

    this.lineSegments = [];
    this.lineSegments.push(new LineSegment(this.x1, this.y1, this.x2, this.y2));
    this.lineSegments.push(new LineSegment(this.x2, this.y2, this.x3, this.y3));
    this.lineSegments.push(new LineSegment(this.x3, this.y3, this.x4, this.y4));
    this.lineSegments.push(new LineSegment(this.x4, this.y4, this.x1, this.y1));
}


Box.prototype.generateCenter = function() {
    var x4 = this.x + this.w*Math.cos(this.angle)/2;
    var y4 = this.y + this.w*Math.sin(this.angle)/2;

    this.center_x = x4 - this.h*Math.sin(this.angle)/2;
    this.center_y = y4 + this.h*Math.cos(this.angle)/2;
}


Box.prototype.draw = function(ctx) {
    this.generateLineSegments();

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
}

Box.prototype.highlight = function(ctx) {
    this.generateLineSegments();
    this.generateCenter();

    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.lineTo(this.x3, this.y3);
    ctx.stroke();
    ctx.lineTo(this.x4, this.y4);
    ctx.stroke();
    ctx.lineTo(this.x1, this.y1);
    ctx.stroke();
}

Box.prototype.intersection = function(ray) {
    var intersections = [];
    var lineSegment;
    var intersection;
    for (var i = 0; i < this.lineSegments.length; i +=1) {
        lineSegment = this.lineSegments[i];
        intersection = lineSegment.intersection(ray);
        if (intersection) {
            intersections.push(intersection);
        }
    }

    if (intersections.length == 0) {
        return false;
    }

    var entering = false;
    if (intersections.length > 1) {
        entering = true;
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

    closest_point.entering = entering;
    return closest_point;
}


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

//Box.prototype = Element.prototype;        // Set prototype to Person's
Box.prototype.constructor = Box;   // Set constructor back to Box







/** Defines the Mirror class. A Mirror is a simply a box that reflects all
  * incident rays. */
var Mirror = function(x, y, n, w, h, angle){
    Box.apply(this, arguments);
    this.w = w || 1;
    this.h = h || 1;
    this.color1 = "#33cccc";
    this.color2 = "#ccffcc";
    this.angle = angle;
    this.generateLineSegments();
<<<<<<< HEAD
    this.generateCenter();



    // Up, down, and move are for dragging
}

Mirror.prototype = Box.prototype;        // Set prototype to Person's
Mirror.prototype.constructor = Mirror;   // Set constructor back to Box

Mirror.prototype.setAngle = function(angle) {
    console.log("MIRROR ANGLE: " + mod(angle, 2*Math.PI))
    this.angle = mod(angle, 2*Math.PI);
}

Mirror.prototype.intersection = function(ray) {
    var intersections = [];
    var lineSegment;
    var intersection;
    for (var i = 0; i < this.lineSegments.length; i +=1) {
        lineSegment = this.lineSegments[i];
        intersection = lineSegment.intersection(ray);
        if (intersection) {
            intersections.push(intersection);
        }
    }

    if (intersections.length == 0) {
        return false;
    }

    var entering = false;
    if (intersections.length > 1) {
        entering = true;
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

    closest_point.entering = entering;
    return closest_point;
}
=======
}

Mirror.prototype = Box.prototype;        // Set prototype to Person's
Mirror.prototype.constructor = Mirror;   // Set constructor back to Box
>>>>>>> 322ef23d4633e3fb96bbaab10bd6bd41af3aafc3
