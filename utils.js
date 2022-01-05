// Visualisation 1
// Selection de l'utilisateur
var user = "Hana"


function update() {
    user = Array.from(document.getElementsByName("inlineRadioOptions")).find(r => r.checked).value;
    update_visu1();
    update_visu2();
}


function printbulle(title, duration) {
    d = Math.round(duration)
    str = title + " : ";

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