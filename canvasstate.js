/** The CanvasState object is responsible for keeping track of and rendering
  * all of the optical elements on the screen, as well as ray tracing a ray. */

var mouseOverObject = false;

function CanvasState(canvas) {
    // **** First some setup! ****
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    // **** Keep track of state! ****

    this.valid = false; // when set to false, the canvas will redraw everything
    this.opticalElements = [];  // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;


    var myState = this;

    // fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var opticalElements = myState.opticalElements;
        var l = opticalElements.length;
        for (var i = l-1; i >= 0; i--) {
            if (opticalElements[i].contains(mx, my) && !(opticalElements[i].wall && playing)) {
                var mySel = opticalElements[i];
                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                if (keysDown) {
                    myState.mouseAngle = Math.atan2(my - mySel.centerY, mx - mySel.centerX);
                    myState.rotating = true;
                } else {
                    myState.dragoffx = mx - mySel.x;
                    myState.dragoffy = my - mySel.y;
                    myState.dragging = true;
                }
                myState.selection = mySel;
                myState.last_angle = myState.selection.angle;
                myState.valid = false;
                return;
            }
        }

        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (myState.selection) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }

    }, true);

    canvas.addEventListener('mousemove', function(e) {
        if (myState.dragging) {
            var mouse = myState.getMouse(e);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            myState.selection.x = mouse.x - myState.dragoffx;
            myState.selection.y = mouse.y - myState.dragoffy;
            myState.valid = false; // Something's dragging so we must redraw
        } else if (myState.rotating) {
            var mouse = myState.getMouse(e);
            var new_angle = Math.atan2((mouse.y - myState.selection.centerY),(mouse.x - myState.selection.centerX));
            myState.selection.setAngle(myState.last_angle + new_angle - myState.mouseAngle);
            myState.valid = false;
        } else {
            var mouse = myState.getMouse(e);
            var mx = mouse.x;
            var my = mouse.y;
            var opticalElements = myState.opticalElements;
            var l = opticalElements.length;
            for (var i = l-1; i >= 0; i--) {
                if (opticalElements[i].contains(mx, my) && !(opticalElements[i].type && playing)) {
                    mouseOverObject = true;
                    return;
                }
            }
            mouseOverObject = false;
        }
    }, true);


    canvas.addEventListener('mouseup', function(e) {
        myState.dragging = false;
        myState.rotating = false;
    }, true);

    // double click for making new opticalElements
    canvas.addEventListener('dblclick', function(e) {
        var mouse = myState.getMouse(e);
        // var glass_box = new GlassBox(mouse.x - 10, mouse.y - 10, 200, 200, 0);
        // myState.addShape(glass_box);
    }, true);

    // **** Options! ****

    this.selectionColor = '#660066';
    this.selectionWidth = 2;
    requestAnimationFrame(this.draw.bind(this));
}

CanvasState.prototype.addShape = function(object) {
    this.opticalElements.push(object);
    this.valid = false;
}

CanvasState.prototype.getOpticalElements = function() {
    return this.opticalElements;
}

CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
}


/** While draw is called as often as requestAnimationFrame demands, it only ever
  * does something if the canvas gets invalidated by our code. */
CanvasState.prototype.draw = function() {
    if (keysDown && mouseOverObject) {
        var elementToChange = document.getElementsByTagName("body")[0];
        elementToChange.style.cursor = "url('images/cursor.png') 9 10, auto";
    } else {
        var elementToChange = document.getElementsByTagName("body")[0];
        elementToChange.style.cursor = "default";
    }

    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        var ctx = this.ctx;
        var opticalElements = this.opticalElements;
        this.clear();

        // ** Add stuff you want drawn in the background all the time here **

        // draw all opticalElements
        var l = opticalElements.length;
        for (var i = 0; i < l; i++) {
            var shape = opticalElements[i];
            // We can skip the drawing of elements that have moved off the screen:
            // if (shape.centerX > this.width || shape.centerY > this.height ||
            //     shape.centerX + shape.w < 0 || shape.centerY + shape.h < 0) continue;
            opticalElements[i].draw(ctx);
        }

        // draw selection
        // right now this is just a stroke along the edge of the selected Shape
        if (this.selection != null) {
          var mySel = this.selection;
          mySel.highlight(ctx);
        }

        // ** Add stuff you want drawn on top all the time here **

        var result;
        if (this.laser) {
            result = this.shootLaser(this.laser);
            if (result.win && playing) {
                var nextLevel = window.confirm("You Win!");
                if (nextLevel) {
                    curLevel += 1;
                    curLevel = mod(curLevel, numLevels);
                }
                startLevel(curLevel);
            } else if (result.lose && playing) {
                alert("You Lose!");
                startLevel(curLevel);
            }
        }

        this.valid = true;
    }

    requestAnimationFrame(this.draw.bind(this));
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {

    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
}


CanvasState.prototype.getBoundaries = function(ray) {
    var boundaries = [];
    boundaries.push(new LineSegment(0, 0, this.width, 0));
    boundaries.push(new LineSegment(0, 0, 0, this.height));
    boundaries.push(new LineSegment(this.width, 0, this.width, this.height));
    boundaries.push(new LineSegment(0, this.height, this.width, this.height));
    return boundaries;
}


/** Ray trace a ray object on the screen. */
CanvasState.prototype.shootLaser = function(laser) {
    return laser.shootLaser(this.opticalElements, this.getBoundaries());
}

CanvasState.prototype.clearElements = function() {
    this.opticalElements = [];
}

CanvasState.prototype.setLaser = function(laser) {
    this.laser = laser;
}

