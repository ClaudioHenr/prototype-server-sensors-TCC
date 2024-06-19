const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
// Middleware to parse JSON request bodies
app.use(express.json());

// Helper function to format sensor data
function formatSensorData(sensorData) {
    return sensorData.map((entry, index) => `Entry ${index + 1}: X: ${entry.x}, Y: ${entry.y}, Z: ${entry.z}`).join('\n');
}

function formatSensorDataForSpreadsheet(sensorData) {
    return sensorData.map((entry, index) => `${index + 1} ${entry.x} ${entry.y} ${entry.z}`).join(`\n`);
}

app.get('/'), (req, res) => {
    res.send('Get here in /')
}

app.post('/create', (req, res) => {
    console.log("Received a POST request to /create");
    
    const { accelerometer, gyroscope, realizado } = req.body;

    if (!accelerometer || !gyroscope || !realizado) {
        return res.status(400).send('Bad Request: Missing required fields');
    }

    const data = `Realizado: ${realizado}\nAccelerometer Data:\nIndex X Y Z\n${formatSensorDataForSpreadsheet(accelerometer)}\nGyroscope Data:\nIndex X Y Z\n${formatSensorDataForSpreadsheet(gyroscope)}\n`;

    fs.appendFile('data/data.txt', data, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Data successfully written to file');
        res.send('POST request to /create received and data saved to file');
    });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
