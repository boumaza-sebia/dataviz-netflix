// set the dimensions and margins of the graph
const margin_visu3 = { top: 60, right: 230, bottom: 50, left: 50 },
    width_visu3 = 660 - margin_visu3.left - margin_visu3.right,
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
        .range(d3.schemeSet2);

    //stack the data?
    const stackedData = d3.stack()
        .keys(keys)
        (data)


    //////////
    // AXIS //
    //////////

    const max_week = d3.max(data, function(d) { return parseInt(d["Week"]); })

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, max_week])
        .range([0, width_visu3]);
    const xAxis = svg_visu3.append("g")
        .attr("transform", `translate(0, ${height_visu3})`)
        .call(d3.axisBottom(x).ticks(5))

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
        .text("Temps de visionnage (minutes)")
        .attr("text-anchor", "start")

    let max_value = d3.max(data, function(d) { return (parseInt(d["Both"]) + parseInt(d["Hana"]) + parseInt(d["Tarik"])); })

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, max_value])
        .range([height_visu3, 0]);
    svg_visu3.append("g")
        .call(d3.axisLeft(y).ticks(5))



    //////////
    // BRUSHING AND CHART //
    //////////

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg_visu3.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width_visu3)
        .attr("height", height_visu3)
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    const brush = d3.brushX() // Add the brush feature using the d3.brush function
        .extent([
            [0, 0],
            [width_visu3, height_visu3]
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area

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

    // Add the brushing
    areaChart
        .append("g")
        .attr("class", "brush")
        .call(brush);


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
        .attr("y", function(d, i) { return 10 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) { return color(d) })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

})