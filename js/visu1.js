// Visualisation 1

// Definition de la taille du svg
const margin = { top: 20, right: 20, bottom: 0, left: 20 },
    width = 1600,
    height = 360;

var svg_visu1 = d3.select("#visu1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg_visu1.append("text")
    .attr("x", (width / 2))
    .attr("y", height - 80)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Calendrier de visionnage quotidien entre le 06/04/2020 et le 21/11/2021 par profil");


// Légende 
const barHeight_visu1 = 15
const barWidth_visu1 = 200
const legend_height_visu1 = height - 80

const axisScale_visu1 = d3.scaleLinear()
    .domain([0, 100])
    .range([width - barWidth_visu1 - 78, width - 78])

const ticks = [0, 100];
const tickLabels = ['Peu', 'Beaucoup']

axisBottom_visu1 = g => g
    .attr("class", `x-axis`)
    .attr("transform", `translate(0,${legend_height_visu1})`)
    .style("font-size", "12px")
    .call(d3.axisBottom(axisScale_visu1)
        .tickSize(3)
        .tickValues(ticks)
        .tickFormat(function(d, i) { return tickLabels[i] }));

svg_visu1.append('g')
    .call(axisBottom_visu1);

updateLegend(d3.interpolateReds, false)


// ajout d'un tooltip
var tooltip = d3.select('body').append('div')
    .attr('class', 'hidden tooltip');

// Mise à jour du tooltip 
function updateHover(e, d) {
    // e est l'object event d
    var mousePosition = [e.x, e.y];
    // on affiche le toolip
    var title = '';
    d.Title.forEach(t => title = title.concat(printMovie(t, d.Durations[d.Title.indexOf(t)], " : ") + "\n"));
    tooltip.classed('hidden', false)
        // on positionne le tooltip en fonction 
        // de la position de la souris
        .attr('style', 'left:' + (mousePosition[0] + 15) +
            'px; top:' + (mousePosition[1] - 35) + 'px')
        // on recupere le nom de l'etat
        .html(title);
}

// Chargement des données
var myjson = {};
var echellex;
var echelley;
var matrixViz;
var rows;
var columns;
var scale;
var max_weight;

d3.json("data/viewing_activity.json").then(function(json) {
    myjson = json;

    // Filtre par profil
    adjancencymatrix = json.filter(function(row) {
        return (row["ProfileName"] == user);
    });

    // Créer un domaine pour notre échelle
    max_weight = d3.max(adjancencymatrix, function(d) {
        return parseInt(d.TotalDuration);
    });

    scale = d3.scaleSequential(d3.interpolateReds)
        .domain([0, max_weight]);

    echellex = d3.scaleBand()
        .range([0, width - 100])
        .domain(d3.range(week_days.length))
        .paddingInner(0.15)
        .round(true);

    echelley = d3.scaleBand()
        .range([0, height - 150])
        .domain(d3.range(7))
        .paddingInner(0.15)
        .align(0)
        .round(true);

    // Afficher la matrice d'adjacence
    matrixViz = d3.select("svg").append("g").attr("transform", "translate(70, 60)");

    matrixViz.selectAll()
        .data(adjancencymatrix)
        .join("rect")
        .attr("width", echellex.bandwidth())
        .attr("height", echelley.bandwidth())
        .attr("x", function(d) {
            return echellex(d.Week);
        })
        .attr("y", function(d) {
            return echelley(d.Day);
        })
        .style("stroke", "black")
        .style("stroke-width", ".3px")
        .style("fill", function(d) {
            if (d.TotalDuration == 0) {
                return "#fff";
            } else return scale(d.TotalDuration);
        })
        .on('mousemove', function(e, d) {
            if (d.TotalDuration != 0) {
                updateHover(e, d);
            }
        })
        .on('mouseout', function() {
            // on cache le toolip
            tooltip.classed('hidden', true);
        });


    // Ajout des labels
    labels = d3.select("svg")
        .append("g")
        .attr("transform", "translate(70, 60)")
        .style("font-size", "10px")
        .style("font-family", "sans-serif");

    jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

    rows = labels
        .append("g")
        .selectAll()
        .data(jours)
        .join("text")
        .text(function(d) {
            return d;
        })
        .attr("dy", function(d) {
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
        .attr("dy", function(d) {
            return echellex(week_days.indexOf(d)) + 10;
        })
        .attr("dx", 3)
        .attr("transform", "rotate(-90)"); // on tourne tout l'axe de 90°*/

});

// Update de l'affichage du calendrier selon le profil 
function update_visu1() {

    adjancencymatrix = myjson.filter(function(row) {
        return (row["ProfileName"] == user);
    });

    max_weight = d3.max(adjancencymatrix, function(d) {
        return parseInt(d.TotalDuration);
    });

    // Chargement de la palette selon le profil
    if (user == "Hana") {
        scale = d3.scaleSequential(d3.interpolateReds)
            .domain([0, max_weight]);
        updateLegend(d3.interpolateReds)
    } else if (user == "Tarik") {
        scale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, max_weight]);
        updateLegend(d3.interpolateBlues)
    } else {
        scale = d3.scaleSequential(d3.interpolateGreys)
            .domain([0, max_weight]);
        updateLegend(d3.interpolateGreys)
    }

    matrixViz.selectAll("rect")
        .data(adjancencymatrix)
        .join("rect")
        .transition() // Ajout d'un effet de transition
        .delay(function(d, i) {
            return i;
        })
        .duration(1000)
        .attr("width", echellex.bandwidth())
        .attr("height", echelley.bandwidth())
        .attr("x", function(d) {
            return echellex(d.Week);
        })
        .attr("y", function(d) {
            return echelley(d.Day);
        })
        .style("stroke", "black")
        .style("stroke-width", ".3px")
        .style("fill", function(d) {
            if (d.TotalDuration == 0) {
                return "#fff";
            } else return scale(d.TotalDuration);
        })

    matrixViz.selectAll("rect")
        .data(adjancencymatrix)
        .on('mousemove', function(e, d) {
            if (d.TotalDuration != 0) {
                updateHover(e, d); // Mise à jour du tooltip
            }
        });
}

// Update de l'affichage de la légende selon le profil 
async function updateLegend(colorSet, update = true) {

    if (update) {
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    colorScale_visu1 = d3.scaleSequential(colorSet).domain([0, 100])

    svg_visu1.selectAll("defs").remove("defs");

    svg_visu1.append("defs").append("linearGradient")
        .attr("id", "linear-gradient-visu1")
        .selectAll("stop")
        .data(colorScale_visu1.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale_visu1(t) })))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    svg_visu1.append('g')
        .attr("transform", `translate(0,${legend_height_visu1 - barHeight_visu1})`)
        .append("rect")
        .attr('transform', `translate(${width - barWidth_visu1 - 78}, 0)`)
        .attr("width", barWidth_visu1)
        .attr("height", barHeight_visu1)
        .style("fill", "url(#linear-gradient-visu1)");
}