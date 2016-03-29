/** This file contains the entry point for the application. When all of the
  * DOM content has been loaded, the 'startApplication' function gets called.
  * This function does the following:
  *
  *     1) Loads the intro video
  *     2) Fills the tool bar with optical elements
  *     3) Creates the canvas where all of the rays/optical elements will reside
  *     4) Sets up event handlers for things such as key presses & mouse clicks
**/

var canvasState;
var cursorImg = "default";
var rayLineWidth = 3;
var shiftKeyPressed = false;
var attrBox;

var undoStack = [];
var redoStack = [];

/** Loads intro video and removes it after it has either finished playing or
  * the skip button has been clicked. */
function playIntroVideo() {
    var vidWrapper = document.getElementById("wrap_video");
    var vid = document.getElementById("myVideo");
    var skipButton = document.getElementById("skip");

    vid.onended = function() {
        vidWrapper.remove();
    }

    skipButton.onclick = function() {
        vidWrapper.remove();
    }

    vid.load();
}

/** Populates the tool bar with lens elements. */
function initializeToolBar() {
    var mouseDomElement = document.getElementsByTagName("body")[0];

    document.getElementById("planoconvex").onclick = function() {
        mouseDomElement.style.cursor = "url('images/planoconvexcursor.png') 50 50, auto";
        cursorImg = "planoconvex";
    }

    document.getElementById("planoconcave").onclick = function() {
        mouseDomElement.style.cursor = "url('images/planoconcavecursor.png') 30 30, auto";
        cursorImg = "planoconcave";
    }

    document.getElementById("medium").onclick = function() {
        mouseDomElement.style.cursor = "url('images/mediumcursor.png') 50 50, auto";
        cursorImg = "medium";
    }

    document.getElementById("laser").onclick = function() {
        mouseDomElement.style.cursor = "url('images/laser_pointer_small.png') 25 25, auto";
        cursorImg = "laser";
    }

    document.getElementById("mirror").onclick = function() {
        mouseDomElement.style.cursor = "url('images/mirror.png') 25 25, auto";
        cursorImg = "mirror";
    }

    document.getElementById("wall").onclick = function() {
        mouseDomElement.style.cursor = "url('images/wall.png') 50 50, auto";
        cursorImg = "wall";
    }
}

/** Creates the canvasState where all of the rays/optical elements will be. */
function initializeCanvas() {
    var c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    ctx.canvas.width = window.innerWidth - 100;
    ctx.canvas.height = window.innerHeight - 10;

    canvasState = new CanvasState(document.getElementById('myCanvas'));
    attrBox = new AttrBox();
}

/** Sets up event handlers for things such as key presses and mouse clicks. */
function setUpEventHandlers() {
    window.addEventListener("keydown", function(e) {
        if (e.shiftKey) {
            shiftKeyPressed = true;
        } else if (e.keyCode == 46) {
            canvasState.removeShape(canvasState.selection);
        } else if (e.keyCode == 90 && e.ctrlKey) {
            canvasState.undo();
        } else if (e.keyCode == 89 && e.ctrlKey) {
            canvasState.redo();
        }
    }, true);

    window.addEventListener("keyup", function(e) {
        if (shiftKeyPressed && !e.shiftKey) {
            shiftKeyPressed = false;
        }
    }, true);

    window.onmousedown = function() {
        var mouseDomElement = document.getElementsByTagName("body")[0];
        mouseDomElement.style.cursor = "default";
    };
}


function startApplication() {
    playIntroVideo();
    initializeToolBar();
    initializeCanvas();
    setUpEventHandlers();
}


document.addEventListener('DOMContentLoaded', function() {
    startApplication();
}, false);

