/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

var canvasState;
var mousePointer;

var keysDown = 0;

window.addEventListener("keydown", function(e) {
    if (e.shiftKey) {
        keysDown += 1;
    }
}, true);

window.addEventListener("keyup", function(e) {
    if (!e.shiftKey && keysDown > 0) {
        keysDown -= 1;
    }
}, true);

function startGame() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    ctx.canvas.width  = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 10;

    keysDown = 0;
    canvasState = new CanvasState(document.getElementById('myCanvas'));
    // box = new Mirror(300, 250, 1.5, 10, 100, Math.PI/4);
    //canvasState.addShape(box);
}