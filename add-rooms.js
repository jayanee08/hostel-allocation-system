require('dotenv').config();
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

const newRooms = [
    // Boys Block A - Additional rooms
    ['Boys Block A', 1, '103', 'Single', 'AC', 'Available'],
    ['Boys Block A', 1, '104', 'Double', 'Non-AC', 'Available'],
    ['Boys Block A', 2, '203', 'Single', 'Non-AC', 'Available'],
    ['Boys Block A', 2, '204', 'Double', 'AC', 'Available'],
    ['Boys Block A', 3, '301', 'Single', 'AC', 'Available'],
    ['Boys Block A', 3, '302', 'Double', 'Non-AC', 'Available'],
    
    // Boys Block B - New block
    ['Boys Block B', 1, '101', 'Single', 'AC', 'Available'],
    ['Boys Block B', 1, '102', 'Double', 'AC', 'Available'],
    ['Boys Block B', 1, '103', 'Single', 'Non-AC', 'Available'],
    ['Boys Block B', 2, '201', 'Double', 'AC', 'Available'],
    ['Boys Block B', 2, '202', 'Single', 'AC', 'Available'],
    ['Boys Block B', 2, '203', 'Double', 'Non-AC', 'Available'],
    
    // Girls Block B - Additional rooms
    ['Girls Block B', 1, '103', 'Single', 'Non-AC', 'Available'],
    ['Girls Block B', 1, '104', 'Double', 'AC', 'Available'],
    ['Girls Block B', 2, '203', 'Single', 'AC', 'Available'],
    ['Girls Block B', 2, '204', 'Double', 'Non-AC', 'Available'],
    ['Girls Block B', 3, '301', 'Single', 'AC', 'Available'],
    ['Girls Block B', 3, '302', 'Double', 'AC', 'Available'],
    
    // Girls Block C - New block
    ['Girls Block C', 1, '101', 'Single', 'AC', 'Available'],
    ['Girls Block C', 1, '102', 'Double', 'Non-AC', 'Available'],
    ['Girls Block C', 1, '103', 'Single', 'AC', 'Available'],
    ['Girls Block C', 2, '201', 'Double', 'AC', 'Available'],
    ['Girls Block C', 2, '202', 'Single', 'Non-AC', 'Available'],
    ['Girls Block C', 2, '203', 'Double', 'AC', 'Available']
];

async function addRooms() {
    try {
        const pool = await sql.connect(config);
        
        for (const room of newRooms) {
            await pool.request()
                .input('blockName', sql.NVarChar, room[0])
                .input('floorNumber', sql.Int, room[1])
                .input('roomNumber', sql.NVarChar, room[2])
                .input('roomType', sql.NVarChar, room[3])
                .input('acType', sql.NVarChar, room[4])
                .input('availability', sql.NVarChar, room[5])
                .query('INSERT INTO Rooms (BlockName, FloorNumber, RoomNumber, RoomType, ACType, Availability) VALUES (@blockName, @floorNumber, @roomNumber, @roomType, @acType, @availability)');
        }
        
        console.log(`✅ Added ${newRooms.length} new rooms successfully!`);
        await pool.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

addRooms();