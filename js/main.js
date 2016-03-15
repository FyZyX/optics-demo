/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

var canvasState;
var mousePointer;
var rayLineWidth = 3;
var shiftKeyPressed = false;
var displayElementInfo = "Never";
var infoBox;

window.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
        generateLevelFile();
    } else if (e.shiftKey && !shiftKeyPressed) {
        shiftKeyPressed = true;
    } else if (e.keyCode > 47 && e.keyCode < 51) {
        // startLevel(e.keyCode - 48);
    }
}, true);

window.addEventListener("keyup", function(e) {
    if (shiftKeyPressed && !e.shiftKey) {
        shiftKeyPressed = false;
    }
}, true);

function videoFinished() {
    var vid = document.getElementById("wrap_video");
    if (vid) {
        vid.remove();
        startPlaying();
    }
}





function generateLevelFile() {
    if (!playing) {
        var opticalElements = canvasState.opticalElements;
        var string = "";

        var element;
        for (var i = 0; i < opticalElements.length; i += 1) {
            element = opticalElements[i];
            string += element.print();
        }

        string += canvasState.laser.print();

        window.open().document.write(string);
    }
}

var playing = false;

function startLevel(level) {
    canvasState.clearElements();
    canvasState.dragging = false;
    canvasState.rotating = false;
    eval(levels[level]);
}

var vid = {};

function default_load() {
    var wall = new Wall(400, 400, 15, 300, 0);
    canvasState.addShape(wall);

    var planoConcave1 = new CircPlanoConcaveLens(200, 250, Math.PI, 1.5, 200, 150, 100);
    canvasState.addShape(planoConcave1);

    var planoConcave2 = new CircPlanoConcaveLens(500, 200, 0, 1.5, 100, 70, 50);
    canvasState.addShape(planoConcave2);

    // var planoConvex2 = new CircPlanoConvexLens(100, 100, 0, 1.5, 100, 100, 200);
    // canvasState.addShape(planoConvex2);

    // var planoConvex3 = new CircPlanoConvexLens(200, 300, 0, 1.5, 100, 200);
    // canvasState.addShape(planoConvex3);

    var mirror1 = new Mirror(600, 200, 15, 150, 0);
    canvasState.addShape(mirror1);

    var mirror2 = new Mirror(450, 400, 15, 150, 0);
    canvasState.addShape(mirror2);

    var l = new Laser(0,50,80,0,15);
    canvasState.setLaser(l);

}



var aspect_width = 1285;
var aspect_height = 647;
var aspect_ratio = aspect_width/aspect_height;
// aspect_ratio = 2.3;

function startPlaying() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    var width = window.innerWidth - 10;
    var height = window.innerHeight - 10;
    // if (width/height > aspect_ratio) {
    //     width = height*aspect_ratio;
    // } else {
    //     height = width/aspect_ratio;
    // }

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    canvasState = new CanvasState(document.getElementById('myCanvas'));

    default_load();


    // toolbarCanvas = document.getElementById("pallet");
    // ctx2 = toolbarCanvas.getContext("2d");
    // ctx2.canvas.width = toolbarCanvas.clientWidth;
    // ctx2.canvas.height = toolbarCanvas.clientHeight;
    // pallet = new CanvasState(document.getElementById('pallet'));

    infoBox = new InfoBox();
}


function startGame() {
    // document.getElementById("myVideo").load();
    // var vid = document.getElementById("myVideo");
    // vid.onended = function() {
    //     videoFinished();
    // }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("myVideo").load();
    var vid = document.getElementById("myVideo");
    vid.onended = function() {
        videoFinished();
    }

}, false);

