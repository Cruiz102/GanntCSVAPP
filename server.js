const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/addTask', (req, res) => {
  const taskData = req.body;

  const csvLine = `${taskData.taskName},${taskData.assignedTo},${taskData.priority},${taskData.description}\n`;
  const dataFolder = path.join(__dirname, 'data');
  const csvFile = path.join(dataFolder, 'tasks.csv');

  // Create 'data' folder if it doesn't exist
  if (!fs.existsSync(dataFolder)){
    fs.mkdirSync(dataFolder);
  }

  // Append to the CSV
  fs.appendFileSync(csvFile, csvLine);

  res.status(200).json({ message: 'Task added successfully.' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
