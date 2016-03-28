
/** Defines the LineSegment class. */
var AttrBox = function() {
    this.element = undefined;
    this.display();
}

AttrBox.prototype.setElement = function(element) {
    this.element = element;
}

AttrBox.prototype.updateAttribute = function(e) {
    var key = e.srcElement.parentNode.parentNode.children[0].innerHTML;
    var val = e.srcElement.value;
    canvasState.addToStack();
    this.element.updateAttribute(key, val);
}


AttrBox.prototype.display = function() {
    var info = document.getElementById("attrBox");
    var new_info = document.createElement("hello");

    if (this.element) {
        var attributes = this.element.attributes;
        for (var key in this.element) {
            if (attributes.indexOf(key) > -1) {
                var tr = document.createElement('tr');
                var attr = tr.insertCell(0);
                var val = tr.insertCell(1);
                attr.innerHTML = key;

                val.innerHTML += '<input type="text" name="fname">';
                var inp = val.children[0];
                inp.value = this.element[key];
                val.contentEditable = "true";
                val.children[0].addEventListener("input", this.updateAttribute.bind(this), false);

                new_info.appendChild(tr);
            }
        }

        var old = info.children[0];
        info.replaceChild(new_info, old);
    }
}
