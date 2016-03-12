/** This file defines the classes for the optical elements that the user can
  * drag around on the screen to interact with the ray of light (i.e. mirrors,
  * PlanoConvexLenses, etc).

    The Chain of inheritance is as follows:
        Element --> Box, PlanoConvexLens
        Box     --> Mirror, Medium
*/

/** Defines the Element class. An Element (short for optical element) is defined
  * by an (X, Y) position, a ROTATION, and an index of refraction N. */
var Element = function(x, y, rotation, n) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.n = n;
}
