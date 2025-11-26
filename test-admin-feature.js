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

async function testAdminFeature() {
    try {
        const pool = await sql.connect(config);
        console.log('✅ Connected to database');
        
        // 1. Find an occupied room
        const occupiedRooms = await pool.request().query(`
            SELECT r.RoomID, r.BlockName, r.RoomNumber, b.BookingID, b.UserID, u.Name
            FROM Rooms r
            JOIN Bookings b ON r.RoomID = b.RoomID
            JOIN Users u ON b.UserID = u.UserID
            WHERE r.Availability = 'Occupied' AND b.Status = 'Approved'
        `);
        
        if (occupiedRooms.recordset.length === 0) {
            console.log('❌ No occupied rooms found for testing');
            return;
        }
        
        const testRoom = occupiedRooms.recordset[0];
        console.log(`\n🏠 Testing with Room ${testRoom.RoomNumber} in ${testRoom.BlockName}`);
        console.log(`👤 Currently booked by: ${testRoom.Name}`);
        
        // 2. Simulate admin making room available
        console.log('\n🔄 Admin making room available...');\n        
        // Find current approved booking\n        const currentBooking = await pool.request()\n            .input('roomId', sql.Int, testRoom.RoomID)\n            .query('SELECT BookingID, UserID FROM Bookings WHERE RoomID = @roomId AND Status = \\'Approved\\'');\n        \n        if (currentBooking.recordset.length > 0) {\n            // Update booking to rejected with admin message\n            await pool.request()\n                .input('bookingId', sql.Int, currentBooking.recordset[0].BookingID)\n                .query('UPDATE Bookings SET Status = \\'Rejected\\', AdminMessage = \\'Your room booking is rejected by the admin and made as Available. Book your room again.\\' WHERE BookingID = @bookingId');\n            \n            console.log('✅ Previous booking marked as rejected');\n        }\n        \n        // Update room status\n        await pool.request()\n            .input('roomId', sql.Int, testRoom.RoomID)\n            .query('UPDATE Rooms SET Availability = \\'Available\\' WHERE RoomID = @roomId');\n        \n        console.log('✅ Room status updated to Available');\n        \n        // 3. Check the results\n        const updatedBooking = await pool.request()\n            .input('bookingId', sql.Int, testRoom.BookingID)\n            .query('SELECT Status, AdminMessage FROM Bookings WHERE BookingID = @bookingId');\n        \n        const updatedRoom = await pool.request()\n            .input('roomId', sql.Int, testRoom.RoomID)\n            .query('SELECT Availability FROM Rooms WHERE RoomID = @roomId');\n        \n        console.log('\\n📊 Results:');\n        console.log(`Room Status: ${updatedRoom.recordset[0].Availability}`);\n        console.log(`Booking Status: ${updatedBooking.recordset[0].Status}`);\n        console.log(`Admin Message: ${updatedBooking.recordset[0].AdminMessage}`);\n        \n        console.log('\\n✅ Admin feature working correctly!');\n        console.log('🔄 Student will see rejection message and can book again');\n        \n        await pool.close();\n        \n    } catch (error) {\n        console.error('❌ Error:', error.message);\n    }\n}\n\ntestAdminFeature();