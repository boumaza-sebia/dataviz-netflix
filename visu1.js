// Visualisation 1
// Selection de l'utilisateur
var user = "Hana"
// Definition de la taille du svg
const margin = { top: 0, right: 30, bottom: 20, left: 10 },
width = 1200,
height = 500;

var svg = d3.select("#visu1")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


 // 2 . Chargement des donnéels    

d3.json("../data/viewing_activity.json").then(function(json) {

  adjancencymatrix = json.filter(function(row){
    return (row["Profile Name"] == user);
  });

  console.log(adjancencymatrix);

  // 3. Créer un domaine pour notre échelle
  const max_weight = d3.max(adjancencymatrix, function (d) {
        return parseInt(d.Duration);
      });
  
  console.log(max_weight)

  var scale = d3.scaleQuantize() 
  .domain([0, max_weight])
  .range(d3.schemeReds[9]); // donné par D3html

  // 6. Créer une nouvelle échelle ordinale

  //var zoneScale = d3.scaleOrdinal(d3.schemeCategory10)

  // échelle 
  //var positionsDates = d3.range(85); //longuer liste

  echellex = d3.scaleBand()
    .range([0,width]) // TODO correspond [0, largeur du dessin]
    .domain(d3.range(52)) 
    .paddingInner(0.1) 
    .round(true);
  
  echelley = d3.scaleBand()
    .range([0,height]) // TODO correspond [0, largeur du dessin]
    .domain(d3.range(7)) 
    .paddingInner(0.1) 
    .align(0)
    .round(true);

  // 4. Afficher une 1e matrice d'adjacence
  matrixViz = d3.select("svg").append("g").attr("transform", "translate(55, 55)");

  matrixViz.selectAll()
  .data(adjancencymatrix)
  .join("rect")
  .attr("width", 20)
  .attr("height", 20)
  .attr("x", function (d) {
    return (d.Week * 20);
  })
  .attr("y", function (d) {
    return (d.Day * 20);
  })
  .style("stroke", "black")
  .style("stroke-width", ".3px")
  .style("fill", function (d) {
    return scale(d.Duration);
  })
  

  /*labels = d3.select("svg")
    .append("g")
    .attr("transform", "translate(60, 60)")
    .style("font-size", "8px")
    .style("font-family", "sans-serif");

  jours = ["Lundi","Mardi", "Mercredi", "Jeudi","Vendredi","Samedi","Dimanche"]
  columns = labels
    .append("g")
    .selectAll()
    .data(jours)
    .join("text")
    .text(function(d,i) {
      return d[i];
    })
    .attr("dy",function(d,i) {
      return echellexy(d[i]);
    })
    .attr("dx", 5)
    .attr("transform", "rotate(-90)"); // on tourne tout l'axe de 90°*/

  /*rows = labels
    .append("g")
    .selectAll()
    .data(json.nodes)
    .join("text")
    .text(function(d) {
      return d.character;
    })
    .attr("dy",function(d) {
      return echellexy(d.id);
    })
    .attr("dx", -5)
    .attr("text-anchor", "end");*/
});

