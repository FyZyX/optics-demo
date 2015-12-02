/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

var canvasState;
var mousePointer;
var rayLineWidth = 3;
var keysDown = 0;

window.addEventListener("keydown", function(e) {
    if (e.shiftKey) {
        keysDown += 1;
    } else if (keysDown > 0) {
        keysDown += 1;
    }
}, true);

window.addEventListener("keyup", function(e) {
    if (keysDown > 0) {
        keysDown -= 1;
    }
}, true);




function startGame() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    ctx.canvas.width  = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 10;

    canvasState = new CanvasState(document.getElementById('myCanvas'));
    var mirror = new Mirror(600, 400, 15, 150, 0);
    canvasState.addShape(mirror);

    // var mirror2 = new Mirror(700, 400, -1, 15, 150, 0);
    // canvasState.addShape(mirror2);

    // var mirror3 = new Mirror(500, 400, -1, 15, 150, 0);
    // canvasState.addShape(mirror3);

    // var mirror4 = new Mirror(400, 400, -1, 15, 150, 0);
    // canvasState.addShape(mirror4);

    // var mirror5 = new Mirror(300, 400, -1, 15, 150, 0);
    // canvasState.addShape(mirror5);

    var lens = new CircleLens(400, 250, 100, 0, 1.5);
    canvasState.addShape(lens);
}