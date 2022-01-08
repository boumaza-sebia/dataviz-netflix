const width_visu2 = 400,
    height_visu2 = 400;

const labelHeight = 18

const radius = 90;

const svg_visu2 = d3.select("#visu2")
    .append("svg")
    .attr("width", width_visu2)
    .attr("height", height_visu2)
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 250 + ")");

svg_visu2.append("text")
    .attr("x", radius)
    .attr("y", radius + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Répartition du temps de visionnage par appareil");

//.attr("transform", `translate(${radius},${radius})`);

const color = d3.scaleOrdinal()
    .range(["#66a61e", "#e6ab02"])

const pie = d3.pie()
    .value(function(d) { return d[1] })

let data_visu2 = {};
let legend;

d3.json("data/device_type.json").then(function(json) {

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
        .style("stroke-width", "0.3px")
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


async function update_visu2() {
    user = Array.from(document.getElementsByName("inlineRadioOptions")).find(r => r.checked).value;

    data_plot_visu2 = pie(Object.entries(data_visu2[user]))

    await new Promise(resolve => setTimeout(resolve, 800));

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
        .style("stroke-width", "0.3px")
        .style("opacity", 1)

}