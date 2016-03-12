
/** Defines the LineSegment class. */
var InfoBox = function() {
    this.element = undefined;
    this.display();
}

InfoBox.prototype.setElement = function(element) {
    this.element = element;
}

function yes(e) {
    var key = e.srcElement.parentNode.parentNode.children[0].innerHTML;
    var val = e.srcElement.value;
    this.updateAttribute(key, val);
}

InfoBox.prototype.updateAttribute = function(key, value) {
    this.element.updateAttribute(key, value);
}

InfoBox.prototype.display = function() {
    var info = document.getElementById("infoBox");
    var new_info = document.createElement("hello");

    if (this.element) {
        var attributes = this.element.attributes;
        for (var key in attributes) {
            var tr = document.createElement('tr');
            var attr = tr.insertCell(0);
            var val = tr.insertCell(1);
            attr.innerHTML = key;

            val.innerHTML += '<input type="text" name="fname">';
            var inp = val.children[0];
            inp.value = attributes[key];
            val.contentEditable = "true";
            val.children[0].addEventListener("input", yes.bind(this), false);

            new_info.appendChild(tr);
        }

        var old = info.children[0];
        info.replaceChild(new_info, old);
    }
}
