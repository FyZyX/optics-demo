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
            if (opticalElements[i].contains(mx, my)) {
                var mySel = opticalElements[i];
                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                myState.dragoffx = mx - mySel.x;
                myState.dragoffy = my - mySel.y;
                myState.dragging = true;
                myState.selection = mySel;
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
        if (myState.dragging){
            var mouse = myState.getMouse(e);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            myState.selection.x = mouse.x - myState.dragoffx;
            myState.selection.y = mouse.y - myState.dragoffy;
            myState.valid = false; // Something's dragging so we must redraw
        }
    }, true);


    canvas.addEventListener('mouseup', function(e) {
        myState.dragging = false;
    }, true);

    // double click for making new opticalElements
    canvas.addEventListener('dblclick', function(e) {
        var mouse = myState.getMouse(e);
        myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
    }, true);

    // **** Options! ****

    this.selectionColor = '#CC0000';
    this.selectionWidth = 2;
    this.interval = 10;
    setInterval(function() { myState.draw(); }, myState.interval);
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

CanvasState.prototype.rayTrace = function(x, y, angle) {
    var ray = new Ray(x, y, angle);
    var elements = this.getOpticalElements();

    var intersection;
    var hit = true;
    while (hit == true) {
        hit = false;
        for (var i = 0; i < elements.length; i += 1) {
            intersection = elements[i].intersection(ray);
            if (intersection) {
                ray.interactWith(elements[i]);
                hit = true;
            }
        }
    }

    var boundaries = this.getBoundaries();
    for (var i = 0; i < boundaries.length; i += 1) {
        //console.log(boundaries[i]);
        intersection = boundaries[i].intersection(ray);
        if (intersection) {
            console.log(intersection);
            ray.addToPath(intersection[0]);
        }
    }

    ray.drawPath();
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
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
            if (shape.x > this.width || shape.y > this.height ||
                shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
            opticalElements[i].draw(ctx);
        }

        // draw selection
        // right now this is just a stroke along the edge of the selected Shape
        if (this.selection != null) {
          ctx.strokeStyle = this.selectionColor;
          ctx.lineWidth = this.selectionWidth;
          var mySel = this.selection;
          ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
        }

        // ** Add stuff you want drawn on top all the time here **
        this.rayTrace(300, 300, 0);

        this.valid = true;
    }
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

CanvasState.prototype.interactWith = function(ray) {
}

CanvasState.prototype.getBoundaries = function(ray) {
    var boundaries = [];
    boundaries.push(new LineSegment(0, 0, this.width, 0));
    boundaries.push(new LineSegment(0, 0, 0, this.height));
    boundaries.push(new LineSegment(this.width, 0, this.width, this.height));
    boundaries.push(new LineSegment(0, this.height, this.width, this.height));
    return boundaries;
}