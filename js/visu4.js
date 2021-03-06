// Visualisation 4 

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-chart
function BubbleChart(data, {
    name = ([x]) => x, // alias for label
    label = name, // given d in data, returns text to display on the bubble
    value = ([, y]) => y, // given d in data, returns a quantitative size
    group, // given d in data, returns a categorical value for color
    title, // given d in data, returns text to show on hover
    link, // given a node d, its link (if any)
    linkTarget = "_blank", // the target attribute for links, if any
    width = 640, // outer width, in pixels
    height = width, // outer height, in pixels
    padding = 3, // padding between circles
    margin = 1, // default margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    groups, // array of group names (the domain of the color scale)
    colors = d3.schemeTableau10, // an array of colors (for groups)
    fill = "#ccc", // a static fill color, if no group channel is specified
    fillOpacity = 0.7, // the fill opacity of the bubbles
    stroke = "black", // a static stroke around the bubbles
    strokeWidth = ".3px", // the stroke width around the bubbles, if any
    strokeOpacity, // the stroke opacity around the bubbles, if any
} = {}) {
    // Compute the values.
    const D = d3.map(data, d => d);
    const V = d3.map(data, value);
    const G = group == null ? null : d3.map(data, group);
    const I = d3.range(V.length).filter(i => V[i] > 0);

    // Unique the groups.
    if (G && groups === undefined) groups = I.map(i => G[i]);
    groups = G && new d3.InternSet(groups);

    //construct scales
    const color = G && d3.scaleSequential(d3.interpolateRdBu)
        .domain([0, 1]);

    // Compute labels and titles.
    const L = label == null ? null : d3.map(data, label);
    const T = title === undefined ? L : title == null ? null : d3.map(data, title);

    // Compute layout: create a 1-deep hierarchy, and pack it.
    const root = d3.pack()
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .padding(padding)
        (d3.hierarchy({ children: I })
            .sum(i => V[i]));

    const svg_visu4 = d3.select("#visu4")
        .append("svg")
        .attr("width", width)
        .attr("height", height + 150)
        .attr("viewBox", [-marginLeft, -marginTop, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("fill", "currentColor")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");

    // Titre

    svg_visu4.append("text")
        .attr("x", (width / 2))
        .attr("y", height + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Contenus visionn??s par profil");

    const leaf = svg_visu4.selectAll("a")
        .data(root.leaves())
        .join("a")
        .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
        .attr("target", link == null ? null : linkTarget)
        .attr("transform", d => `translate(${d.x},${d.y})`);

    leaf.append("circle")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("fill", G ? d => color(G[d.data]) : fill == null ? "none" : fill)
        .attr("fill-opacity", fillOpacity)
        .attr("r", d => d.r);

    if (T) leaf.append("title")
        .text(d => T[d.data]);

    if (L) {
        // A unique identifier for clip paths (to avoid conflicts).
        const uid = `O-${Math.random().toString(16).slice(2)}`;

        leaf.append("clipPath")
            .attr("id", d => `${uid}-clip-${d.data}`)
            .append("circle")
            .attr("r", d => d.r);

        leaf.append("text")
            .attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`)
            .selectAll("tspan")
            .data(d => `${L[d.data]}`.split(/\n/g))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
            .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
            .text(d => d);
    }

    // L??gende
    margin = ({top: 20, right: 110, bottom: 30, left: 30})

    barHeight = 15
    barWidth = 250
    legend_height = 70

    colorScale_visu4 = d3.scaleSequential(d3.interpolateRdBu).domain([0,100])

    axisScale = d3.scaleLinear()
        .domain(colorScale_visu4.domain())
        .range([margin.left, barWidth - margin.right])
    
    const ticks = [0,50,100];
    const tickLabels = ['Hana','Together','Tarik']

    axisBottom = g => g
        .attr("class", `x-axis`)
        .attr("transform", `translate(0,${legend_height - margin.bottom})`)
        .call(d3.axisBottom(axisScale)
            .tickSize(3)
            .tickValues(ticks)
            .tickFormat(function(d,i){ return tickLabels[i] }));

    const defs = svg_visu4.append("defs");
  
    const linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");
  
    linearGradient.selectAll("stop")
        .data(colorScale_visu4.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale_visu4(t) })))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
  
    svg_visu4.append('g')
        .attr("transform", `translate(0,${legend_height - margin.bottom - barHeight})`)
        .append("rect")
        .attr('transform', `translate(${margin.left}, 0)`)
        .attr("width", barWidth - margin.right - margin.left)
        .attr("height", barHeight)
        .style("fill", "url(#linear-gradient)");
    
    svg_visu4.append('g')
        .call(axisBottom);

    return Object.assign(svg_visu4.node(), {scales: {color}});
}

// Chargement des donn??es
d3.json("data/favorites_color_level.json").then(function(data) {
    
    // S??lection des contenus avec une dur??e de visionnage >= 1h 
    file = data.filter(function(row){
        return ((row["Duration"]/60|0) != 0);
    });

    var chart = BubbleChart(file, {
        label: d =>  (d.Duration/60|0) >= 20 ? printMovie(d.Title, d.Duration, "\n") : d.Title,
        value: d => d.Duration,
        group: d => d.ColorLevel,
        title: d => printMovie(d.Title, d.Duration, " : "),
        width: 600
    })
});