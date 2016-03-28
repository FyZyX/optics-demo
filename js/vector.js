// Vector object class

var Vector = function(magnitude, angle) {
	this.magnitude = magnitude; // length of vector (AKA radius)
	this.angle = angle; // polar/absolute angle
}

// The GET COMPONENTS method will return an array of the Cartesian components the Vector object
Vector.prototype.getComponents = function() {
	var x = this.magnitude*Math.cos(this.angle);
	var y = this.magnitude*Math.sin(this.angle);
	return [x, y];
};

Vector.prototype.normalize = function() {
	return new Vector(1, this.angle);
};

Vector.prototype.invert = function() {
	return new Vector(this.magnitude, this.angle + Math.PI);
};

// The ADD function will produce a new Vector object by combining two input Vector objects
// according to the parallelogram law of vector addition
function add(vec1, vec2) {
	var v1 = vec1.getComponents();
	var v2 = vec2.getComponents();
	var x = v1[0] + v2[0]; // sum the x-components of the two vectors
	var y = v1[1] + v2[1]; // sum the y-components of the two vectors
	return new Vector(Math.sqrt(x*x + y*y), Math.atan2(y, x)); // convert back to polar coordinates and output result
};

// The SCALAR MULTIPLICATION function will multiply the magnitude of a Vector object by a scalar value
function scalarMultiply(vec, s) {
	return new Vector(vec.magnitude*s, vec.angle);
}


// The DOT PRODUCT function will compute the inner product of two Vector objects via trigonometry
function dotProduct(vec1, vec2) {
	return vec1.magnitude*vec2.magnitude*Math.cos(vec2.angle - vec1.angle);
}

function getVectorFromComponents(x, y) {
	var angle = Math.atan2(y, x);
	return new Vector(1, angle);
}