// Test script to verify booking update with admin message
const sql = require('mssql');

const config = {
    user: 'hostel_admin',
    password: 'Nikhil&2005',
    server: 'hostel-server-2024.database.windows.net',
    database: 'hostel_management',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function testBookingUpdate() {
    try {
        const pool = await sql.connect(config);
        
        // Check current bookings
        console.log('Current bookings:');
        const bookings = await pool.request().query('SELECT BookingID, UserID, RoomID, Status, AdminMessage FROM Bookings');
        console.table(bookings.recordset);
        
        // Check rooms
        console.log('\nCurrent rooms:');
        const rooms = await pool.request().query('SELECT RoomID, BlockName, RoomNumber, Availability FROM Rooms');
        console.table(rooms.recordset);
        
        await pool.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testBookingUpdate();