var Ray = function(x, y, angle) {
    this.path = [[x, y]];
    this.current_position = [x, y];
    this.angle = angle;
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