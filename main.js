/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

var canvasState;
var mousePointer;
var rayLineWidth = 3;
var keysDown = 0;
var curLevel = 1;
var numLevels = 2;


window.addEventListener("keydown", function(e) {
    console.log("HERE");
    if (e.keyCode == 13) {
        generateLevelFile();
    }
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

window.addEventListener("mousedown", function(e) {
    var vid = document.getElementById("myVideo");
    if (vid) {
        vid.remove();
        startPlaying();
    }
}, true);




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



var level0 = "var b = new Box(796,526,15,150,4.06609060451356,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new WinWall(9,515,15,35,0);canvasState.addShape(b);var b = new Wall(308,435,15,150,0);canvasState.addShape(b);var b = new Wall(308,595,15,150,0);canvasState.addShape(b);var b = new Wall(61,353,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(241,353,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(61,600,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(241,600,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Box(453,301,15,150,2.502010470300501,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var pcc = new PlanoConcaveLens(1028,421,100,0,1.5,120);canvasState.addShape(pcc);var pcv = new PlanoConvexLens(747,670,150,3.6716097343392304,1.5,50);canvasState.addShape(pcv);var l = new Laser(0,120,70,0,10);canvasState.setLaser(l);";
var level1 = "var b = new Box(185,469,15,250,5.492932526690764,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new WinWall(1076,530,15,250,4.709338659392787);canvasState.addShape(b);var b = new Wall(597,185,15,10,0);canvasState.addShape(b);var b = new Wall(596,132,15,10,0);canvasState.addShape(b);var b = new Wall(595,72,15,10,0);canvasState.addShape(b);var b = new Wall(597,205,15,10,0);canvasState.addShape(b);var b = new Wall(596,167,15,10,0);canvasState.addShape(b);var b = new Wall(596,150,15,10,0);canvasState.addShape(b);var b = new Wall(597,223,15,10,0);canvasState.addShape(b);var b = new Wall(596,114,15,10,0);canvasState.addShape(b);var b = new Wall(595,94,15,10,0);canvasState.addShape(b);var b = new Wall(902,424,15,350,0);canvasState.addShape(b);var b = new Wall(1071,590,15,350,1.5674842972683347);canvasState.addShape(b);var pcc = new PlanoConcaveLens(769,548,60,0,1.5,120);canvasState.addShape(pcc);var pcv = new PlanoConvexLens(1415,476,150,6.285375236212544,1.5,50);canvasState.addShape(pcv);var l = new Laser(0,120,70,0,10);canvasState.setLaser(l);";
var level2;
var level3;


var playing = true;

var levels = {0: level0, 1: level1, 2: level2, 3: level3};

function startLevel(level) {
    canvasState.clearElements();
    eval(levels[level]);
}

var vid = {};

function default_load() {
    var mirror = new Mirror(600, 400, 15, 250, 0);
    canvasState.addShape(mirror);

    var winWall = new WinWall(700, 550, 15, 250, 0);
    canvasState.addShape(winWall);

    var wall = new Wall(200, 150, 15, 10, 0);
    canvasState.addShape(wall);

    var wall2 = new Wall(300, 250, 15, 10, 0);
    canvasState.addShape(wall2);

    var wall3 = new Wall(300, 250, 15, 10, 0);
    canvasState.addShape(wall3);

    var wall4 = new Wall(500, 250, 15, 10, 0);
    canvasState.addShape(wall4);

    var wall5 = new Wall(200, 150, 15, 10, 0);
    canvasState.addShape(wall5);

    var wall6 = new Wall(300, 250, 15, 10, 0);
    canvasState.addShape(wall6);

    var wall7 = new Wall(500, 250, 15, 10, 0);
    canvasState.addShape(wall7);

    var wall8 = new Wall(600, 250, 15, 10, 0);
    canvasState.addShape(wall8);

    var wall9 = new Wall(600, 250, 15, 10, 0);
    canvasState.addShape(wall9);




    var wall10 = new Wall(600, 250, 15, 350, 0);
    canvasState.addShape(wall10);

    var wall11 = new Wall(600, 250, 15, 350, Math.PI);
    canvasState.addShape(wall11);

    var planoConcave2 = new PlanoConcaveLens(710, 200, 60, 0, 1.5, 120);
    canvasState.addShape(planoConcave2);

    var planoConvex3 = new PlanoConvexLens(310, 500, 150, Math.PI, 1.5, 50);
    canvasState.addShape(planoConvex3);

    // canvasState.addShape(pcv);
    var l = new Laser(0,120,70,0,10);
    canvasState.setLaser(l);












// var b = new Box(796,526,15,150,4.06609060451356,0,'#a3c2c2','#d1e0e0');
// canvasState.addShape(b);
// var b = new WinWall(9,515,15,35,0,-1,'#00cc00','#00cc00');
// canvasState.addShape(b);
// var b = new Wall(308,435,15,150,0);
// canvasState.addShape(b);
// var b = new Wall(308,595,15,150,0);
// canvasState.addShape(b);
// var b = new Wall(61,353,15,150,1.5707963267948966);
// canvasState.addShape(b);
// var b = new Wall(241,353,15,150,1.5707963267948966);
// canvasState.addShape(b);
// var b = new Wall(61,600,15,150,1.5707963267948966);
// canvasState.addShape(b);
// var b = new Wall(241,600,15,150,1.5707963267948966);
// canvasState.addShape(b);
// var b = new Box(453,301,15,150,2.502010470300501,0,'#a3c2c2','#d1e0e0');
// canvasState.addShape(b);
// var pcc = new PlanoConcaveLens(1028,421,100,0,1.5,120);
// canvasState.addShape(pcc);
// var pcv = new PlanoConvexLens(747,670,150,2.886211570941782,1.5,50);
// canvasState.addShape(pcv);
// var l = new Laser(0,120,70,0,10);
// canvasState.setLaser(l);
}

function startPlaying() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    ctx.canvas.width  = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 10;

    canvasState = new CanvasState(document.getElementById('myCanvas'));

    // canvasState.setLaser(new Laser(0, 120, 70, 0, 10));
    // default_load();
    startLevel(1);
}


function startGame() {
    document.getElementById("myVideo").load();
    var vid = document.getElementById("myVideo");
    vid.onended = function() {
        this.remove();
        startPlaying();
    }
}

