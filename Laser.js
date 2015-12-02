var Laser = function(x, y, h, angle, numRays) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.angle = angle;
    this.numRays = numRays;

    this.rays = [];
    var spacing = h/numRays;
    for (var i = 0; i < this.numRays; i += 1) {
        this.rays.push(new Ray(x - i*spacing*Math.sin(angle), y + i*spacing*Math.cos(angle), angle));
    }

}

Laser.prototype.shootLaser = function(elements, boundaries) {
    for (var i = 0; i < this.rays.length; i += 1) {
        this.rays[i].rayTrace(elements, boundaries);
    }
}