const express = require('express');
const cors = require('cors'); // Import the cors package
const path = require('path');
const app = express();
const PORT = 8000;

// Sample configuration data that simulates the ESP32 cfg struct
let cfg = {
    server_name: "ESP32_Server",
    server_port: 7787,
    ssl: true,
    interval: 10,
    nofix: false,
    dhcp_enable: true,
    ip: "192.168.1.100",
    netmask: "255.255.255.0",
    gateway: "192.168.1.2",
    dns: "8.8.8.8",
    irr: "192.168.1.2",
    upload: false,
};

// Middleware to enable CORS
app.use(cors()); // Allow all origins by default

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the React app's static files
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the configuration data as JavaScript in the HTML
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ESP32 Network Configuration</title>
            <script>
                const initialConfig = ${JSON.stringify(cfg)};
            </script>
            <script src="/assets/index.js"></script>
        </head>
        <body>
            <div id="root"></div>
        </body>
        </html>
    `);
});

// Endpoint to simulate getting the config
app.get('/config', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(cfg);
});

// Endpoint to update the configuration
app.post('/config', (req, res) => {
    cfg = req.body;
    console.log('Updated configuration:', cfg);
    res.send('Configuration updated');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
