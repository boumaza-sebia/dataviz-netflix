// Visualisation 1
// Selection de l'utilisateur
var user = "Hana"
// Definition de la taille du svg
const margin = { top: 0, right: 30, bottom: 20, left: 10 },
width = 960,
height = 960;

var svg = d3.select("#visu1")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/ViewingActivity.csv").then(function(data) {
  // select a user
  var dataByUser = data.filter(function(row) {
    return (row["Profile Name"] == user);
  } );
});
