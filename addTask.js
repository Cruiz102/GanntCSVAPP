document.addEventListener("DOMContentLoaded", function() {
    // Add click event listener to the "Add New Task" button
    document.getElementById("goToForm").addEventListener("click", function() {
        // Redirect to the addTask.html page
        window.location.href = "addTask.html";
    });
        // Your code here
        document.getElementById('saveToCSV').addEventListener('click', function() {
            // Your event handling code
          });
});


document.getElementById('saveToCSV').addEventListener('click', function() {
const taskName = document.getElementById('taskName').value;
const assignedTo = document.getElementById('assignedTo').value;
const priority = document.getElementById('priority').value;
const description = document.getElementById('description').value;

// Send this data to your Node.js server
fetch('http://localhost:4000/addTask', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({ taskName, assignedTo, priority, description })
})
.then(response => response.json())
.then(data => alert(data.message))
.catch((error) => console.error('Error:', error));
});

