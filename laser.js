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
    for (var i = 0; i < this.rays.length; i += 1) {
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