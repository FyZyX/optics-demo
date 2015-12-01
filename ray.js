/** This file defines the Ray class. The ray specifies the beam of light that
  * will be shot out from the starting point in our game. */

var Ray = function(x, y, angle) {
    this.path = [[x, y]];
    this.x1 = x;
    this.y1 = y;
    this.angle = angle;
    this.setEndpoints();
    this.n = 1;
}

Ray.prototype.addToPath = function(x, y) {
    this.path.push([x, y]);
}

Ray.prototype.clearPath = function(x, y) {
    this.path = [];
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

    // console.log("DRAWING PATH:");

    for (var i = 0; i < (this.path.length-1); i += 1) {

        x1 = this.path[i][0];
        y1 = this.path[i][1];

        x2 = this.path[i+1][0];
        y2 = this.path[i+1][1];

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = rayLineWidth;
        // console.log("moving from (" + x1 + ", " + y1 + ") to (" + x2 + ", " + y2 +")");
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}