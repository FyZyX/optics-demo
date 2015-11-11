/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

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
        if (boundaries[i].intersection(ray)) {
            ray.interactWith(boundaries[i]);
            break;
        }
    }

    ray.drawPath();
}

function startGame() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    ctx.canvas.width  = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 10;

    ctx.moveTo(0,0);

    var s = new CanvasState(document.getElementById('myCanvas'));
    //var box = new Box(300, 300, 1.5, "blue", 200, 60);
    //s.addShape(box);

    //test1();
    //test2();
    //rayTrace(0, 300, 0, s);

}