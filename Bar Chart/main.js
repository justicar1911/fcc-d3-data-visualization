// Getting Data from API
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

async function getData() {
    const response = await fetch(url);
    const data = await response.json();
    return data
}
const { data: dataset } = await getData();

dataset.forEach(data => {
    data[0] = new Date(data[0]);
})

// UTC to 'YYYY-MM-DD'
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Declare the chart dimensions and margins.
const width = 900;
const height = 600;
const marginTop = 20;
const marginRight = 40;
const marginBottom = 20;
const marginLeft = 40;

// SCALE
const x = d3.scaleTime().domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])]).range([marginLeft, width - marginRight]);
const y = d3.scaleLinear().domain([0, d3.max(dataset, d => d[1])]).range([height - marginBottom, marginTop]);

// CONTAINER
const container = d3.select("body")
    .append("div")
    .attr("class", "container")
// TITLE
container.append("h1")
    .text("United States GDP")
    .attr("id", "title")
/// SVG
const svg = container.append("svg")
    .attr("width", width)
    .attr("height", height)
// TOOLTIP
const tooltip = container.append("div")
    .attr("id", "tooltip")

// AXIS
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .attr("id", "x-axis")
    .call(xAxis);

svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .attr("id", "y-axis")
    .call(d3.axisLeft(y));

// Append Rect
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => x(d[0]))
    .attr("y", (d, i) => y(d[1]))
    .attr("width", 5)
    .attr("height", d => height - marginBottom - y(d[1]))
    .attr("data-date", (d) => formatDate(d[0]))
    .attr("data-gdp", (d) => d[1])
    .attr("class", "bar")
    .attr("fill", "#36b0ff")
    .on("mouseover", (event, d) => {
        tooltip.style("opacity", 0.9);
        tooltip.html(`Date: ${formatDate(d[0])}<br>GDP: $${d[1]} Billion`)
            .attr("data-date", formatDate(d[0]))
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
    })
    .on("mousemove", (event) => {
        tooltip.style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });

// More info
container
    .append("p")
    .html("More Information: <a href='http://www.bea.gov/national/pdf/nipaguid.pdf'>http://www.bea.gov/national/pdf/nipaguid.pdf<a/>")
    .attr("class", "more-info")