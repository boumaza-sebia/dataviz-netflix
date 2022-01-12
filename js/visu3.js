// définition des dimensions
const margin_visu3 = { top: 100, right: 230, bottom: 50, left: 120 },
    width_visu3 = 770 - margin_visu3.left - margin_visu3.right,
    height_visu3 = 400 - margin_visu3.top - margin_visu3.bottom;

// ajout du svg
const svg_visu3 = d3.select("#visu3")
    .append("svg")
    .attr("width", width_visu3 + margin_visu3.left + margin_visu3.right)
    .attr("height", height_visu3 + margin_visu3.top + margin_visu3.bottom + 10)
    .append("g")
    .attr("transform",
        `translate(${margin_visu3.left}, ${margin_visu3.top})`);

// ouverture du jeu de données
d3.csv("data/week_activity.csv").then(function(data) {

    const keys = data.columns.slice(1)

    // définition de la fonction color
    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#286EAC", "#EF6464", "#D2C8C8"])

    // fonction de cumul
    const stackedData = d3.stack()
        .keys(keys)
        (data)


    /************ AXES ET TITRE ***********/

    /*** Axe X ***/

    // Définition
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return parseInt(d["Week"]); }))
        .range([0, width_visu3]);

    // Ajout des labels semaines
    const nb_ticks = 6;
    let ticks = []
    let tickLabels = []
    for (i = 0; i <= nb_ticks; i = i + 1) {
        ticks.push(Math.round(i * week_days.length / nb_ticks));
        tickLabels.push(week_days[Math.round(i * week_days.length / nb_ticks)]);
    }
    tickLabels[tickLabels.length - 1] = week_days[week_days.length - 1]
    const xAxis = svg_visu3.append("g")
        .attr("transform", `translate(0, ${height_visu3})`)
        .call(d3
            .axisBottom(x)
            .ticks(nb_ticks)
            .tickSize(3)
            .tickValues(ticks)
            .tickFormat(function(d, i) { return tickLabels[i] }));

    // Label de l'axe X:
    svg_visu3.append("text")
        .attr("text-anchor", "end")
        .attr("x", width_visu3 + 40)
        .attr("y", height_visu3 + 35)
        .style("font-size", "12px")
        .text("Semaine");

    /*** Axe Y ***/
    let max_value = d3.max(data, function(d) { return (parseInt(d["Together"]) + parseInt(d["Hana"]) + parseInt(d["Tarik"])); })
    const y = d3.scaleLinear()
        .domain([0, max_value])
        .range([height_visu3, 0]);
    svg_visu3.append("g")
        .call(d3.axisLeft(y).ticks(5))

    // Label de l'axe Y
    svg_visu3.append("text")
        .attr("text-anchor", "end")
        .attr("x", -40)
        .attr("y", -20)
        .style("font-size", "12px")
        .text("Temps de visionnage (heures)")
        .attr("text-anchor", "start")


    /*** Titre***/
    svg_visu3.append("text")
        .attr("x", (width_visu3 / 2))
        .attr("y", height_visu3 + margin_visu3.bottom)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Temps de visionnage cumulé hebdomadaire");


    /***** CHART ******/


    // définition d'un clip pour ne pas dessiner autour
    const clip = svg_visu3.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width_visu3)
        .attr("height", height_visu3)
        .attr("x", 0)
        .attr("y", 0);

    // générateur d'aire
    const area = d3.area()
        .x(function(d) { return x(d.data["Week"]); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

    // Dessin des aires
    svg_visu3.append('g')
        .attr("clip-path", "url(#clip)")
        .selectAll("mylayers")
        .data(stackedData)
        .join("path")
        .attr("class", function(d) { return "myArea " + d.key })
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)


    /*** Highlight ***/

    // Highlight le groupe sélectionné
    const highlight = function(event, d) {
            d3.selectAll(".myArea").style("opacity", 0.1) //réduire l'oppacité sur les autres groupes
            d3.select("." + d).style("opacity", 1) //augmente l'oppacité sur le groupe sélectionné
        }
        // Retour à l'état initial
    const noHighlight = function(event, d) {
        d3.selectAll(".myArea").style("opacity", 1)
    }



    /*** LÉGENDE ***/

    // Ajout du carré couleur
    const size = 20
    svg_visu3.selectAll("myrect")
        .data(keys)
        .join("rect")
        .attr("x", 400)
        .attr("y", function(d, i) { return 10 + i * (size + 5) })
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d) { return color(d) })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Ajout du texte
    svg_visu3.selectAll("mylabels")
        .data(keys)
        .join("text")
        .attr("x", 400 + size * 1.2)
        .attr("y", function(d, i) { return 10 + i * (size + 5) + (size / 2) + 5 })
        .style("fill", function(d) { return color(d) })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

})