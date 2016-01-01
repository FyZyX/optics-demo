var w = 12850;
var h = 6470;
var ratio = w/h;

var canvas_width = 1285;
var canvas_height = 647;

function getCoordinates(x, y) {
    x = x*w/canvas_width;
    y = y*h/canvas_height;
    return {"x": x, "y": y};
}

function getScreenPosition(x, y) {
    x = x*canvas_width/w;
    y = y*canvas_height/h;
    return {"x": x, "y": y};
}
