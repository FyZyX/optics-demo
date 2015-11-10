function rayTrace(x, y, angle, canvasState) {
    var ray = new Ray(x, y, angle);
    var shapes = canvasState.getShapes();

    var interaction = true;
    while (interaction == true) {
        interaction = false;
        for (var i = 0; i < shapes.length; i += 1) {
            if (shapes[i].intersects(ray)) {
                ray.interactWith(shapes[i]);
                interaction = true;
            }
        }
    }

    var boundaries = canvasState.getBoundaries();
    for (var i = 0; i < boundaries.length; i += 1) {
        if (boundaries[i].intersects(ray)) {
            ray.interactWith(boundaries[i]);
            break;
        }
    }

    ray.drawPath();
}

function getIntersection(LineSegment1, LineSegment2) {

}

function startGame() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    ctx.canvas.width  = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 10;

    ctx.moveTo(0,0);

    var s = new CanvasState(document.getElementById('myCanvas'));
    var mirror = new Box(300, 300, 1.5, "blue", 200, 60);
    s.addShape(mirror);

    rayTrace(0, 300, 0, s);

}