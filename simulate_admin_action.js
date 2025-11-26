// Simulate admin making room 35 available
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

async function simulateAdminAction() {
    try {
        const pool = await sql.connect(config);
        const roomId = 35; // Girls Block C, Room 101
        const newStatus = 'Available';
        
        console.log('Before admin action:');
        const beforeBooking = await pool.request()
            .input('roomId', sql.Int, roomId)
            .query('SELECT BookingID, UserID, Status, AdminMessage FROM Bookings WHERE RoomID = @roomId AND Status = \'Approved\'');
        console.table(beforeBooking.recordset);
        
        // Simulate the admin action - same logic as server.js
        if (newStatus === 'Available') {
            // Find the current approved booking for this room
            const currentBooking = await pool.request()
                .input('roomId', sql.Int, roomId)
                .query('SELECT BookingID, UserID FROM Bookings WHERE RoomID = @roomId AND Status = \'Approved\'');
            
            if (currentBooking.recordset.length > 0) {
                console.log('Found approved booking, updating to rejected...');
                // Update the booking status to rejected with admin message
                await pool.request()
                    .input('bookingId', sql.Int, currentBooking.recordset[0].BookingID)
                    .query('UPDATE Bookings SET Status = \'Rejected\', AdminMessage = \'Your room booking is rejected by the admin and made as Available. Book your room again.\' WHERE BookingID = @bookingId');
                console.log('Booking updated successfully');
            }
        }
        
        // Update room status
        await pool.request()
            .input('roomId', sql.Int, roomId)
            .input('newStatus', sql.NVarChar, newStatus)
            .query('UPDATE Rooms SET Availability = @newStatus WHERE RoomID = @roomId');
        
        console.log('\nAfter admin action:');
        const afterBooking = await pool.request()
            .input('roomId', sql.Int, roomId)
            .query('SELECT BookingID, UserID, Status, AdminMessage FROM Bookings WHERE RoomID = @roomId');
        console.table(afterBooking.recordset);
        
        const roomStatus = await pool.request()
            .input('roomId', sql.Int, roomId)
            .query('SELECT RoomID, BlockName, RoomNumber, Availability FROM Rooms WHERE RoomID = @roomId');
        console.table(roomStatus.recordset);
        
        await pool.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

simulateAdminAction();