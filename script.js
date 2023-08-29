
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
        // localStorage.setItem('csvData', JSON.stringify(results.data));
        console.log("Hollla")
        console.log(results.data) // Save to local storage
        createGanttChart(results.data);
        createDescriptionTable(results.data);
      }
    });
});

// ... (rest of your code for createGanttChart and createDescriptionTable)


// ------



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

    data.forEach(d => {
      if (d.Task) {  // Check for null or undefined
        const rowClass = "row-" + d.Task.replace(/ /g, "-");  // Unique class
        $('#taskTable tbody').append(`
          <tr class="${rowClass}">
            <td>${d.Task}</td>
            <td>${d.AssignedTo}</td>
            <td>${d.PriorityNumber}</td>
            <td>${d.Description}</td>
          </tr>
        `);
      } else {
        console.warn("Skipping row with null or undefined Task");
      }
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

function saveCSV(data) {
  // Convert JSON data to CSV string
  let csv = "Task,Start,End,AssignedTo,PriorityNumber,Description\n";
  data.forEach((row) => {
      csv += `${row.Task},${row.Start},${row.End},${row.AssignedTo},${row.PriorityNumber},${row.Description}\n`;
  });

  // Create a Blob object from the CSV string
  const blob = new Blob([csv], { type: "text/csv" });
  saveAs(blob)

  // Create an anchor element and attach the Blob object as its href
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "plot_data.csv");

  // Append the anchor element to the document, trigger a click (to open the download dialog), and remove it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
document.getElementById('saveCSV').addEventListener('click', function() {
  // Retrieve the data (assuming you have it stored in a variable called 'data')
  const data = JSON.parse(localStorage.getItem('csvData')) || [];

  // Call the saveCSV function to save the data to a CSV file
  saveCSV(data);
});


