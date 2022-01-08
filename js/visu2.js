const width_visu2 = 400,
    height_visu2 = 400,
    labelHeight = 18,
    radius = 90;

//définition du svg_visu2
const svg_visu2 = d3.select("#visu2")
    .append("svg")
    .attr("width", width_visu2)
    .attr("height", height_visu2)
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 250 + ")");

// ajout titre
svg_visu2.append("text")
    .attr("x", radius - 150)
    .attr("y", radius + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .style("text-decoration", "underline")
    .text("Figure 4");
svg_visu2.append("text")
    .attr("x", radius + 45)
    .attr("y", radius + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(": Répartition du temps de visionnage par appareil");

//choix des couleurs
const color = d3.scaleOrdinal()
    .range(["#66a61e", "#e6ab02"])

//définition de la fonction qui permet de définir les proportions
const pie = d3.pie()
    .value(function(d) { return d[1] })

let data_visu2 = {};
let arcGenerator;

d3.json("data/device_type.json").then(function(json) {

    /*** Jeu de données ***/
    data_visu2 = json;
    //sélection du profil
    data_plot_visu2 = pie(Object.entries(data_visu2[user]));
    //définition de l'arc avec la taille
    arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
    //dessin
    svg_visu2.selectAll(null)
        .data(data_plot_visu2)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d) { return (color(d.data[1])) })
        // contour 
        .attr("stroke", "black")
        .style("stroke-width", "0.3px")
        .style("opacity", 1)


    /*** LÉGENDE ***/

    const size = 20;

    // Ajout carré couleur de la légende
    svg_visu2.selectAll(null)
        .data(data_plot_visu2)
        .join("rect")
        .attr("x", radius + 60)
        .attr("y", function(d, i) { return (i * (size + 5) - 60) })
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d) { return color(d) });

    // Ajout texte de la légende
    svg_visu2.selectAll(null)
        .data(data_plot_visu2)
        .join("text")
        .attr("x", radius + 60 + size * 1.2)
        .attr("y", function(d, i) { return (i * (size + 5) + (size / 2) - 55) })
        .style("fill", function(d) { return color(d) })
        .text(function(d) { return d.data[0] })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

    //ajout du texte
    svg_visu2.selectAll('mySlices')
        .data(data_plot_visu2)
        .enter()
        .append('text')
        .text(function(d){ 
            if (Math.round(d.data[1]) > 0) {
                return Math.round(d.data[1] / 60) + "h"}
            })
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 10)
});


// mise à jour pour changement de profil
async function update_visu2() {

    //récupération du choix (profil sélectionné)
    user = Array.from(document.getElementsByName("inlineRadioOptions")).find(r => r.checked).value;
    //récupération des données associées au profil sélectionné
    data_plot_visu2 = pie(Object.entries(data_visu2[user]));

    //effet visuel
    await new Promise(resolve => setTimeout(resolve, 800));

    arcGenerator = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)

    //dessin du nouveau chart
    svg_visu2.selectAll(null)
        .data(data_plot_visu2)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d) { return (color(d.data[1])) })
        .attr("stroke", "black")
        .style("stroke-width", "0.3px")
        .style("opacity", 1)
    
    //mise à jour du texte
    svg_visu2.selectAll('mySlices')
        .data(data_plot_visu2)
        .enter()
        .append('text')
        .text(function(d){ 
            if (Math.round(d.data[1]) > 0) {
                return Math.round(d.data[1] / 60) + "h"}
            })
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 10)


}