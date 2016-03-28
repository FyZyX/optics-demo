function scalarSnellsLaw(angle, n1, n2) {
	var r = n1/n2;
	return Math.asin(r*Math.sin(angle));
}

// The SNELL'S LAW function will produce a refracted ray Vector object given incident and normal Vectors and appropriate indecies of refraction
function snellsLaw(incVec, normVec, n1, n2) {
    var r = n1/n2;
    var dot = dotProduct(incVec, normVec);
    var c = Math.sqrt(1 - Math.pow(r, 2) * (1 - Math.pow(dot, 2)));
    var sign = dot < 0 ? -1 : 1; // correct for relative position of Vectors
    var incComp = scalarMultiply(incVec, r); // component of the resultant in the incident direction
	var normComp = scalarMultiply(normVec, sign*(c - sign*r*dot)); // component of the resultant in the normal direction
    return add(incComp, normComp).normalize();
}

function refract(incVec, normVec, n1, n2) {
	return snellsLaw(incVec, normVec, n1, n2);
}

function reflect(incVec, normVec, n) {
	return snellsLaw(incVec, normVec, n, -1*n).invert();
}

// --- TESTING BEGINS ---

// TEST 1 - status: WORKING
// var myRayAngle = 3*Math.PI/4; // initial ray angle
// var myNormAngle = 3*Math.PI/2; // normal vector angle
// var index1 = 1; // index of first medium
// var index2 = 1.5; // index of second medium

// TEST 2 - status: WORKING
// var myRayAngle = 11*Math.PI/6; // initial ray angle
// var myNormAngle = 0; // normal vector angle
// var index1 = 1.5; // index of first medium
// var index2 = 1; // index of second medium

// TEST 3 (Reflection) - status: WORKING
// var myRayAngle = 1*Math.PI/6; // initial ray angle
// var myNormAngle = Math.PI; // normal vector angle
// var index = 1; // index of first medium

// console.log("Reflected Angle:", reflect(v, normal, index).angle*180/Math.PI);

// TEST 4 (TIR) - status: UNCHECKED
var myRayAngle = 1*Math.PI/6; // initial ray angle
var myNormAngle = Math.PI; // normal vector angle
var index1 = 3; // index of first medium
var index2 = 1; // index of second medium

var v = new Vector(1, myRayAngle); // create ray vector
var normal = new Vector(1, myNormAngle); // create normal vector
console.log("Scalar Snell's:", scalarSnellsLaw(myRayAngle, index1, index2)*180/Math.PI);
console.log("Vector Snell's:", refract(v, normal, index1, index2).angle*180/Math.PI);
