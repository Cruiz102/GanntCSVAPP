
// Main event listener for file input
document.getElementById('csvFile').addEventListener('change', function(event) {
  Papa.parse(event.target.files[0], {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      localStorage.setItem('csvData', JSON.stringify(results.data)); // Save to local storage
      createGanttChart(results.data);
      createDescriptionTable(results.data);
    }
  });
});


document.addEventListener("DOMContentLoaded", function() {
  const savedCsvData = localStorage.getItem('csvData');
  if (savedCsvData) {
    const parsedData = JSON.parse(savedCsvData);
    createGanttChart(parsedData);
    createDescriptionTable(parsedData);
  }

  // Your other DOMContentLoaded code here
});

// Check for saved data on page load
document.addEventListener("DOMContentLoaded", function() {
  const savedCsvData = localStorage.getItem('csvData');
  if (savedCsvData) {
    const parsedData = JSON.parse(savedCsvData);
    createGanttChart(parsedData);
    createDescriptionTable(parsedData);
  }
});

// Main event listener for file input
document.getElementById('csvFile').addEventListener('change', function(event) {
    Papa.parse(event.target.files[0], {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        localStorage.setItem('csvData', JSON.stringify(results.data)); // Save to local storage
        createGanttChart(results.data);
        createDescriptionTable(results.data);
      }
    });
});

// ... (rest of your code for createGanttChart and createDescriptionTable)




// Function to create the Gantt chart
function createGanttChart(data) {
  // Clear previous SVG if it exists
  d3.select("#ganttChart svg").remove();

  // Convert string dates to JavaScript Date objects
  data.forEach(function(d) {
    d.Start = new Date(d.Start);
    d.End = new Date(d.End);
  });

  // Define SVG dimensions and margins
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create time and band scales
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleBand().range([height, 0]);

  // Append the SVG to the div
  const svg = d3.select("#ganttChart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set the domain for scales
  x.domain([d3.min(data, d => d.Start), d3.max(data, d => d.End)]);
  y.domain(data.map(d => d.Task)).padding(0.1);

  // Create color scale for priorities
  const color = d3.scaleLinear()
                  .domain([1, 5])
                  .range(["#00008B", "#ccffff"]);

// Add bars for each task
svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", d => "bar bar-" + (d.Task ? d.Task.replace(/ /g, "-") : ''))  // Check for undefined
  .attr("x", d => x(d.Start))
  .attr("y", d => y(d.Task))
  .attr("width", d => x(d.End) - x(d.Start))
  .attr("height", y.bandwidth())
  .attr("fill", d => color(d.PriorityNumber))
  .on("mouseover", function(d) {
    if (d.Task) {  // Check for undefined
      const rowClass = ".row-" + d.Task.replace(/ /g, "-");
      $(rowClass).addClass("highlight");
    }
  })
  .on("mouseout", function(d) {
    if (d.Task) {  // Check for undefined
      const rowClass = ".row-" + d.Task.replace(/ /g, "-");
      $(rowClass).removeClass("highlight");
    }
  });



  // Add X and Y axes
  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

  svg.append("g")
     .call(d3.axisLeft(y));



     // Add color legend
  const legend = svg.append("g")
  .attr("transform", `translate(${width - 100}, ${height - 100})`);

const legendScale = d3.scaleLinear()
      .domain([1, 5])
      .range([0, 100]);

legend.selectAll(".legend-color")
.data(d3.range(1, 6))
.enter().append("rect")
.attr("x", d => legendScale(d) - 10)
.attr("width", 20)
.attr("height", 20)
.attr("fill", d => color(d));

legend.append("g")
.attr("transform", "translate(-10, 20)")
.call(d3.axisBottom(legendScale).ticks(5));
}

// Function to create the description table with DataTables
function createDescriptionTable(data) {
    // If DataTable is already initialized, destroy it

    if ($.fn.DataTable.isDataTable('#taskTable')) {
      $('#taskTable').DataTable().destroy();
    }

    console.log("Parsed data for table:", data);  // Log data
  
    // Empty the tbody to make room for new data
    $('#taskTable tbody').empty();

// Populate the tbody with data from the CSV
data.forEach(d => {
    const rowClass = "row-" + d.Task.replace(/ /g, "-");  // Unique class
    $('#taskTable tbody').append(`
      <tr class="${rowClass}">
        <td>${d.Task}</td>
        <td>${d.AssignedTo}</td>
        <td>${d.PriorityNumber}</td>
        <td>${d.Description}</td>
      </tr>
    `);
  });
  

    // Initialize DataTable
    $('#taskTable').DataTable({
      "paging": true,
      "lengthChange": false,
      "searching": true,
      "ordering": true,
      "info": true,
      "autoWidth": false,
    });
}
