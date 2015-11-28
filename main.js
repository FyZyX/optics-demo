/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

var canvasState;
<<<<<<< HEAD
var mousePointer;
=======
>>>>>>> 322ef23d4633e3fb96bbaab10bd6bd41af3aafc3

function startGame() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    ctx.canvas.width  = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 10;

    canvasState = new CanvasState(document.getElementById('myCanvas'));
<<<<<<< HEAD
    // box = new Mirror(300, 250, 1.5, 10, 100, Math.PI/4);
    //canvasState.addShape(box);
=======
    var box = new Mirror(300, 250, 1.5, 10, 100, Math.PI/2);
    canvasState.addShape(box);
>>>>>>> 322ef23d4633e3fb96bbaab10bd6bd41af3aafc3
}