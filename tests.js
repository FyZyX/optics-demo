function test1() {
    var m = 1;
    var b = -10;
    var minx = -1000;
    var miny = -1000;
    var maxx = 1000;
    var maxy = 1000;

    var lineSeg = new LineSegment(m, b, minx, miny, maxx, maxy);
    var ray = new Ray(0, 0, -Math.PI/4);

    console.log(lineSeg.intersection(ray));
}

function test2() {
    var ray = new Ray(50, 50, Math.atan(7/6));
    var box = new Box(59, 63, 1, "blue", 10, 20);
    console.log(box.intersection(ray));
}