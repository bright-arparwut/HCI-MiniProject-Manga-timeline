d3.csv("data/manga.csv").then(data => {

   data.forEach(d => {
       d.Published = +d.Published;
       d.End = d.End === "present" ? new Date().getFullYear() : +d.End;
   });


   data.sort((a, b) => a.Published - b.Published);

   
   const margin = { top: 30, right: 20, bottom: 30, left: 100 },
         width = 960 - margin.left - margin.right,
         height = data.length * 50; // Adjust height based on the number of series

   // Append SVG
   const svg = d3.select("#salesOverTime")
                 .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                 .append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

   
   const x = d3.scaleLinear()
               .domain([d3.min(data, d => d.Published), d3.max(data, d => d.End)])
               .range([0, width]);
   svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d"))); // Show year as an integer

   const y = d3.scaleBand()
               .range([0, height])
               .domain(data.map(d => d["Manga series"]))
               .padding(0.1);
   svg.append("g")
      .call(d3.axisLeft(y));

   
   const color = d3.scaleOrdinal(d3.schemeTableau10);

   // Tooltip selection
   const tooltip = d3.select("#tooltip");

  
   svg.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.Published))
      .attr("y", d => y(d["Manga series"]))
      .attr("width", d => x(d.End) - x(d.Published))
      .attr("height", y.bandwidth())
      .attr("fill", (d, i) => color(i)) // Use index to assign color
      .on("mouseover", (event, d) => {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html(
              `<strong>Series:</strong> ${d["Manga series"]}<br/>
               <strong>Author(s):</strong> ${d["Author(s)"]}<br/>
               <strong>Publisher:</strong> ${d["Publisher"]}<br/>
               <strong>Demographic:</strong> ${d["Demographic"]}<br/>
               <strong>No. of Volumes:</strong> ${d["No. of volumes"]}<br/>
               <strong>Published:</strong> ${d.Published} - ${d.End === new Date().getFullYear() ? "Present" : d.End}<br/>
               <strong>Approximate Sales:</strong> ${d["Approximate sales in million(s)"]} million<br/>
               <strong>Average Sales per Volume:</strong> ${d["Average sales per volume in million(s)"]} million`
          )
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      });
}).catch(error => {
   console.error("Error loading the CSV file: ", error);
});
