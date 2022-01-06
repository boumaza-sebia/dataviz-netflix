// set the dimensions and margins of the graph
const margin_visu3 = { top: 100, right: 230, bottom: 50, left: 120 },
    width_visu3 = 770 - margin_visu3.left - margin_visu3.right,
    height_visu3 = 400 - margin_visu3.top - margin_visu3.bottom;

// append the svg object to the body of the page
const svg_visu3 = d3.select("#visu3")
    .append("svg")
    .attr("width", width_visu3 + margin_visu3.left + margin_visu3.right)
    .attr("height", height_visu3 + margin_visu3.top + margin_visu3.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin_visu3.left}, ${margin_visu3.top})`);

// Parse the Data
d3.csv("./data/week_activity.csv").then(function(data) {


    //////////
    // GENERAL //
    //////////

    // List of groups = header of the csv files
    const keys = data.columns.slice(1)

    // color palette
    const color = d3.scaleOrdinal()
        .domain(keys)
        //.range(d3.schemeRdBu[3])
        //.range(d3.schemeTableau10);
        .range(["#286EAC", "#EF6464", "#D2C8C8"])

    //stack the data?
    const stackedData = d3.stack()
        .keys(keys)
        (data)


    //////////
    // AXIS //
    //////////

    // Add X axis
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return parseInt(d["Week"]); }))
        .range([0, width_visu3]);


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




    // Add X axis label:
    svg_visu3.append("text")
        .attr("text-anchor", "end")
        .attr("x", width_visu3)
        .attr("y", height_visu3 + 40)
        .text("Semaine");

    // Add Y axis label:
    svg_visu3.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("Temps de visionnage (heures)")
        .attr("text-anchor", "start")

    let max_value = d3.max(data, function(d) { return (parseInt(d["Both"]) + parseInt(d["Hana"]) + parseInt(d["Tarik"])); })

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, max_value])
        .range([height_visu3, 0]);
    svg_visu3.append("g")
        .call(d3.axisLeft(y).ticks(5))



    //////////
    // CHART //
    //////////

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg_visu3.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width_visu3)
        .attr("height", height_visu3)
        .attr("x", 0)
        .attr("y", 0);


    // Create the scatter variable: where both the circles and the brush take place
    const areaChart = svg_visu3.append('g')
        .attr("clip-path", "url(#clip)")

    // Area generator
    const area = d3.area()
        .x(function(d) { return x(d.data["Week"]); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

    // Show the areas
    areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .join("path")
        .attr("class", function(d) { return "myArea " + d.key })
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)


    //////////
    // HIGHLIGHT GROUP //
    //////////

    // What to do when one group is hovered
    const highlight = function(event, d) {
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", .1)
            // expect the one that is hovered
        d3.select("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlight = function(event, d) {
        d3.selectAll(".myArea").style("opacity", 1)
    }



    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    const size = 20
    svg_visu3.selectAll("myrect")
        .data(keys)
        .join("rect")
        .attr("x", 400)
        .attr("y", function(d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d) { return color(d) })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svg_visu3.selectAll("mylabels")
        .data(keys)
        .join("text")
        .attr("x", 400 + size * 1.2)
        .attr("y", function(d, i) { return 10 + i * (size + 5) + (size / 2) + 5 }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) { return color(d) })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

})