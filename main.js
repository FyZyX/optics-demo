/** This file contains the central logic for the game. The function startGame()
  * gets called when the web page loads, and creates the CanvasState object
  * that will contain (and render) our coordinate system and all of the objects
  * in it. */

var canvasState;
var mousePointer;
var rayLineWidth = 3;
var keysDown = 0;
var curLevel = 0;
var numLevels = 3;


window.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
        generateLevelFile();
    }
    if (e.shiftKey) {
        keysDown += 1;
    } else if (keysDown > 0) {
        keysDown += 1;
    }

    if (e.keyCode > 47 && e.keyCode < 51) {
        startLevel(e.keyCode - 48);
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


var level0 = "var b = new Box(298,187,15,80,0.07760492258740825,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new Box(481,210,15,80,2.654072175223533,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new Box(272,437,270,230,6.193728413012803,1.33,'#33cccc','#ccffcc');canvasState.addShape(b);var b = new Wall(895,348,15,300,0);canvasState.addShape(b);var b = new Wall(587,81,15,300,0);canvasState.addShape(b);var b = new Wall(590,409,15,300,0);canvasState.addShape(b);var b = new Wall(895,680,15,300,0);canvasState.addShape(b);var b = new Wall(998,113,15,300,0);canvasState.addShape(b);var b = new WinWall(1075,382,15,100,0);canvasState.addShape(b);var l = new Laser(0,200,70,5.890486225480862,1);canvasState.setLaser(l);";
var level1 = "var b = new Box(796,526,15,150,4.06609060451356,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new WinWall(9,515,15,35,0);canvasState.addShape(b);var b = new Wall(308,435,15,150,0);canvasState.addShape(b);var b = new Wall(308,595,15,150,0);canvasState.addShape(b);var b = new Wall(61,353,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(241,353,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(61,600,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Wall(241,600,15,150,1.5707963267948966);canvasState.addShape(b);var b = new Box(453,301,15,150,2.502010470300501,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var pcc = new PlanoConcaveLens(1028,421,100,0.1,1.5,120);canvasState.addShape(pcc);var pcv = new PlanoConvexLens(747,670,150,3.6716097343392304,1.5,50);canvasState.addShape(pcv);var l = new Laser(0,120,70,0,10);canvasState.setLaser(l);";
var level2 = "var b = new Box(185,469,15,250,5.492932526690764,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new WinWall(1076,530,15,250,4.709338659392787);canvasState.addShape(b);var b = new Wall(597,185,15,10,0);canvasState.addShape(b);var b = new Wall(596,132,15,10,0);canvasState.addShape(b);var b = new Wall(595,72,15,10,0);canvasState.addShape(b);var b = new Wall(597,205,15,10,0);canvasState.addShape(b);var b = new Wall(596,167,15,10,0);canvasState.addShape(b);var b = new Wall(596,150,15,10,0);canvasState.addShape(b);var b = new Wall(597,223,15,10,0);canvasState.addShape(b);var b = new Wall(596,114,15,10,0);canvasState.addShape(b);var b = new Wall(595,94,15,10,0);canvasState.addShape(b);var b = new Wall(902,424,15,350,0);canvasState.addShape(b);var b = new Wall(1071,590,15,350,1.5674842972683347);canvasState.addShape(b);var pcc = new PlanoConcaveLens(769,548,60,0.1,1.5,120);canvasState.addShape(pcc);var pcv = new PlanoConvexLens(1415,476,150,6.285375236212544,1.5,50);canvasState.addShape(pcv);var l = new Laser(0,120,70,0,10);canvasState.setLaser(l);";
// var level3 ="var b = new Box(608,187,15,150,5.488266980067955,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new Box(100,509,15,150,5.487717770714354,0,'#a3c2c2','#d1e0e0');canvasState.addShape(b);var b = new Wall(948,522,15,300,4.716022391928867);canvasState.addShape(b);var b = new Wall(1100,398,15,300,0);canvasState.addShape(b);var b = new Wall(946,277,15,300,4.71238898038469);canvasState.addShape(b);var b = new Box(804,335,15,100,0,-1,'#ff0000','#ff0000');canvasState.addShape(b);var b = new Box(804,475,15,100,0,-1,'#ff0000','#ff0000');canvasState.addShape(b);var b = new WinWall(931,414,15,100,0);canvasState.addShape(b);var pcv = new PlanoConvexLens(107,349,100,1.1864593813835507,1.5,20);canvasState.addShape(pcv);var pcv = new PlanoConvexLens(733,491,200,4.83479520174107,1.5,50);canvasState.addShape(pcv);var pcc = new PlanoConcaveLens(348,372,150,1.5707963267948966,1.5,130);canvasState.addShape(pcc);var pcc = new PlanoConcaveLens(332,723,100,1.5707963267948966,1.5,160);canvasState.addShape(pcc);var l = new Laser(0,50,70,0,10);canvasState.setLaser(l);";
var level3;
var playing = true;

var levels = {0: level0, 1: level1, 2: level2, 3: level3};

function startLevel(level) {
    canvasState.clearElements();
    eval(levels[level]);
}

var vid = {};

function default_load() {
    var mirror = new Mirror(750, 400, 15, 150, 0);
    canvasState.addShape(mirror);

    var mirror = new Mirror(650, 400, 15, 150, 0);
    canvasState.addShape(mirror);

    var wall = new Wall(400, 400, 15, 300, 0);
    canvasState.addShape(wall);

    var wall = new Wall(500, 400, 15, 300, 0);
    canvasState.addShape(wall);

    var wall = new Wall(600, 400, 15, 300, 0);
    canvasState.addShape(wall);

    var wall = new LoseWall(900, 400, 15, 100, 0);
    canvasState.addShape(wall);

    var wall = new LoseWall(800, 400, 15, 100, 0);
    canvasState.addShape(wall);

    var wall = new WinWall(1000, 400, 15, 100, 0);
    canvasState.addShape(wall);



    var planoConvex1 = new PlanoConvexLens(100, 200, 100, 0, 1.5, 20);
    canvasState.addShape(planoConvex1);

    var planoConvex1 = new PlanoConvexLens(200, 200, 200, 0, 1.5, 50);
    canvasState.addShape(planoConvex1);

    var planoConvex1 = new PlanoConcaveLens(200, 200, 150, Math.PI/2, 1.5, 130);
    canvasState.addShape(planoConvex1);

    var planoConvex1 = new PlanoConcaveLens(200, 200, 100, Math.PI/2, 1.5, 160);
    canvasState.addShape(planoConvex1);



    // canvasState.addShape(pcv);
    var l = new Laser(0,50,70,0,10);
    canvasState.setLaser(l);

}

function startPlaying() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    ctx.canvas.width  = window.innerWidth - 10;
    ctx.canvas.height = window.innerHeight - 10;

    canvasState = new CanvasState(document.getElementById('myCanvas'));

    // canvasState.setLaser(new Laser(0, 120, 70, 0, 10));
    // default_load();
    startLevel(0);
}


function startGame() {
    document.getElementById("myVideo").load();
    var vid = document.getElementById("myVideo");
    vid.onended = function() {
        this.remove();
        startPlaying();
    }
}

