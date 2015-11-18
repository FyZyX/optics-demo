/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

var canvasState;

function startGame() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    ctx.canvas.width  = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 10;

    ctx.moveTo(0,0);

    canvasState = new CanvasState(document.getElementById('myCanvas'));
    var box = new Box(300, 300, 1.5, "blue", 100, 100);
    canvasState.addShape(box);

    //test1();
    //test2();
    //rayTrace(0, 300, 0, canvasState);

}