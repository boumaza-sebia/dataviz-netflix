// Visualisation 1
// Selection de l'utilisateur
var user = "Hana"
document.getElementById("inlineRadio1").checked = true;

function update() {
    user = Array.from(document.getElementsByName("inlineRadioOptions")).find(r => r.checked).value;
    update_visu1();
    update_visu2();
}


function printMovie(title, duration, separator) {
    d = Math.round(duration)
    str = title + separator;

    if (d > 60) {
        str += ((d / 60) | 0) + "h"
    }
    if (d % 60 != 0) {
        minutes = Math.round(Math.round(d % 60 * 100) / 100)
        if (minutes < 10 && d > 60) {
            str += "0"
        }
        str += minutes + "min"
    }

    return str;
}