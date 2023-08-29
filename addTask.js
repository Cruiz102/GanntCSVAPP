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

document.getElementById('backToIndex').addEventListener('click', function() {
    window.location.href = "index.html";
});



document.getElementById('saveToCSV').addEventListener('click', function() {
const taskName = document.getElementById('taskName').value;
const assignedTo = document.getElementById('assignedTo').value;
const priority = document.getElementById('priority').value;
const description = document.getElementById('description').value;

})