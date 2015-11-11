/** This file defines the Ray class. The ray specifies the beam of light that
  * will be shot out from the starting point in our game. */

var Ray = function(x, y, angle) {
    this.path = [[x, y]];
    this.x = x;
    this.y = y;
    this.angle = angle;
}

/** Returns [b, m], which specifies the equation of the line that this ray
  * travels along. */
Ray.prototype.getLine = function() {
    var m = Math.tan(this.angle);
    var b = this.y - m*this.x;
    //console.log([b, m]);
    return [b, m];
}

Ray.prototype.addToPath = function(x, y) {
    this.path.push([x, y]);
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

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}