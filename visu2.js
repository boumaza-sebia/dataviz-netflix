const width_visu2 = 600,
    height_visu2 = 300;

const labelHeight = 18

const radius = 75;

const svg_visu2 = d3.select("#visu2")
    .append("svg")
    .attr("width", width_visu2)
    .attr("height", height_visu2)
    .append("g")
    .attr("transform", `translate(${radius},${radius})`);

const color = d3.scaleOrdinal()
    .range(["#ff0000", "#0080ff"])

const pie = d3.pie()
    .value(function(d) { return d[1] })

let data_visu2 = {};
let legend;

d3.json("../data/device_type.json").then(function(json) {

    data_visu2 = json

    data_plot_visu2 = pie(Object.entries(data_visu2[user]))

    svg_visu2
        .selectAll(null)
        .data(data_plot_visu2)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function(d) { return (color(d.data[1])) })
        .attr("stroke", "black")
        .style("stroke-width", "0.8px")
        .style("opacity", 1)


    const size = 20
    svg_visu2.selectAll(null)
        .data(data_plot_visu2)
        .join("rect")
        .attr("x", radius + 60)
        .attr("y", function(d, i) { return (i * (size + 5) - 60) })
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d) { return color(d) })

    // Add one dot in the legend for each name.
    svg_visu2.selectAll(null)
        .data(data_plot_visu2)
        .join("text")
        .attr("x", radius + 60 + size * 1.2)
        .attr("y", function(d, i) { return (i * (size + 5) + (size / 2) - 55) })
        .style("fill", function(d) { return color(d) })
        .text(function(d) { return d.data[0] })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

});


function update_visu2() {
    user = Array.from(document.getElementsByName("inlineRadioOptions")).find(r => r.checked).value;

    data_plot_visu2 = pie(Object.entries(data_visu2[user]))

    svg_visu2
        .selectAll(null)
        .data(data_plot_visu2)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function(d) { return (color(d.data[1])) })
        .attr("stroke", "black")
        .style("stroke-width", "0.8px")
        .style("opacity", 1)

}