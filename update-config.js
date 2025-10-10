// Run this script to update your server.js with actual Azure SQL credentials
// Replace the values below with your actual Azure SQL details

const fs = require('fs');

const YOUR_SERVER_NAME = 'hostel-server-2024.database.windows.net'; // Replace this
const YOUR_USERNAME = 'hostel_admin';     // Replace if different
const YOUR_PASSWORD = 'Nikhil&2005';  // Replace with your actual password

// Read server.js
let serverContent = fs.readFileSync('server.js', 'utf8');

// Replace placeholders
serverContent = serverContent.replace(
    'hostel-server-2024.database.windows.net',
    YOUR_SERVER_NAME
);

serverContent = serverContent.replace(
    'hostel_admin',
    YOUR_USERNAME
);

serverContent = serverContent.replace(
    'Nikhil&2005',
    YOUR_PASSWORD
);

// Write back to server.js
fs.writeFileSync('server.js', serverContent);

console.log('✅ Server configuration updated successfully!');
console.log('Now run: npm start');