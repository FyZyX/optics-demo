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

    var count = 0;
    for (var i = 0; i < this.rays.length; i += 1) {
        if (this.rays[i].hittingWinWall) {
            count += 1;
        } else if (this.rays[i].hittingLoseWall) {
            return {"win": false, "lose": true};
        }
    }

    if (count == this.numRays) {
        return {"win": true, "lose": false};
    } else {
        return {"win": false, "lose": false}
    }
}

Laser.prototype.print = function() {
    return "var l = new Laser(" + this.x + "," + this.y + "," + this.h + "," + this.angle + "," + this.numRays +");" +
            "canvasState.setLaser(l);";
}