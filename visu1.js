// Visualisation 1
// Selection de l'utilisateur
var user = "Hana"
// Definition de la taille du svg
const margin = { top: 0, right: 30, bottom: 10, left: 10 },
width = 1300,
height = 300;

var svg = d3.select("#visu1")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// 2 . Chargement des donnéels
var myjson = {};
var echellex;
var echelley;
var matrixViz;
var rows;
var columns;
var scale;
var max_weight;
  
d3.json("../data/viewing_activity.json").then(function(json) {
  myjson = json;
  adjancencymatrix = json.filter(function(row){
    return (row["ProfileName"] == user);
  });

  // 3. Créer un domaine pour notre échelle
  max_weight = d3.max(adjancencymatrix, function (d) {
        return parseInt(d.Duration);
      });
  

  scale = d3.scaleQuantize() 
  .domain([0, max_weight])
  .range(d3.schemeReds[9]); // donné par D3html


  // échelle 
  //var positionsDates = d3.range(85); //longuer liste

  echellex = d3.scaleBand()
    .range([0,width-100]) // TODO correspond [0, largeur du dessin]
    .domain(d3.range(week_days.length)) 
    .paddingInner(0.1) 
    .round(true);
  
  echelley = d3.scaleBand()
    .range([0,height-150]) // TODO correspond [0, largeur du dessin]
    .domain(d3.range(7)) 
    .paddingInner(0.1) 
    .align(0)
    .round(true);

  // 4. Afficher une 1e matrice d'adjacence
  matrixViz = d3.select("svg").append("g").attr("transform", "translate(70,   50)");

  matrixViz.selectAll()
  .data(adjancencymatrix)
  .join("rect")
  .attr("width", echellex.bandwidth())
  .attr("height", echelley.bandwidth())
  .attr("x", function (d) {
    return echellex(d.Week);
  })
  .attr("y", function (d) {
    return echelley(d.Day);
  })
  .style("stroke", "black")
  .style("stroke-width", ".3px")
  .style("fill", function (d) {
    return scale(d.Duration);
  })
  

  labels = d3.select("svg")
    .append("g")
    .attr("transform", "translate(70, 50)")
    .style("font-size", "8px")
    .style("font-family", "sans-serif");

  jours = ["Lundi","Mardi", "Mercredi", "Jeudi","Vendredi","Samedi","Dimanche"]

  rows = labels
    .append("g")
    .selectAll()
    .data(jours)
    .join("text")
    .text(function(d) {
      return d;
    })
    .attr("dy",function(d) {
      return echelley(jours.indexOf(d)) + 15;
    })
    .attr("text-anchor", "end");
  
  columns = labels
    .append("g")
    .selectAll()
    .data(week_days)
    .join("text")
    .text(function(d) {
      return d;
    })
    .attr("dy",function(d) {
      return echellex(week_days.indexOf(d)) + 10;
    })
    .attr("dx", 3)
    .attr("transform", "rotate(-90)"); // on tourne tout l'axe de 90°*/
  
});

function update (){
  user= Array.from(document.getElementsByName("inlineRadioOptions")).find(r => r.checked).value;

  adjancencymatrix = myjson.filter(function(row){
    return (row["ProfileName"] == user);
  });

  // 3. Créer un domaine pour notre échelle
  max_weight = d3.max(adjancencymatrix, function (d) {
    return parseInt(d.Duration);
  });


  scale = d3.scaleQuantize() 
  .domain([0, max_weight])
  .range(d3.schemeReds[9]); // donné par D3html

  matrixViz.selectAll("rect")
  .data(adjancencymatrix)
  .join("rect")
  .transition()
  .duration(1000)
  .attr("width", echellex.bandwidth())
  .attr("height", echelley.bandwidth())
  .attr("x", function (d) {
    return echellex(d.Week);
  })
  .attr("y", function (d) {
    return echelley(d.Day);
  })
  .style("stroke", "black")
  .style("stroke-width", ".3px")
  .style("fill", function (d) {
    return scale(d.Duration);
  })

}

