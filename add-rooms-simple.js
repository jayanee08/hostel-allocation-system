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

async function addRooms() {
    try {
        const pool = await sql.connect(config);
        
        const roomsQuery = `
        INSERT INTO Rooms (BlockName, FloorNumber, RoomNumber, RoomType, ACType, Availability) VALUES
        ('Boys Block A', 1, '105', 'Single', 'AC', 'Available'),
        ('Boys Block A', 1, '106', 'Double', 'Non-AC', 'Available'),
        ('Boys Block A', 2, '205', 'Single', 'AC', 'Available'),
        ('Boys Block A', 2, '206', 'Double', 'Non-AC', 'Available'),
        ('Boys Block A', 3, '301', 'Single', 'AC', 'Available'),
        ('Boys Block A', 3, '302', 'Double', 'AC', 'Available'),
        ('Boys Block B', 1, '101', 'Single', 'AC', 'Available'),
        ('Boys Block B', 1, '102', 'Double', 'Non-AC', 'Available'),
        ('Boys Block B', 2, '201', 'Single', 'AC', 'Available'),
        ('Boys Block B', 2, '202', 'Double', 'AC', 'Available'),
        ('Girls Block B', 1, '105', 'Single', 'AC', 'Available'),
        ('Girls Block B', 1, '106', 'Double', 'Non-AC', 'Available'),
        ('Girls Block B', 2, '205', 'Single', 'AC', 'Available'),
        ('Girls Block B', 2, '206', 'Double', 'AC', 'Available'),
        ('Girls Block B', 3, '301', 'Single', 'AC', 'Available'),
        ('Girls Block B', 3, '302', 'Double', 'Non-AC', 'Available'),
        ('Girls Block C', 1, '101', 'Single', 'AC', 'Available'),
        ('Girls Block C', 1, '102', 'Double', 'AC', 'Available'),
        ('Girls Block C', 2, '201', 'Single', 'Non-AC', 'Available'),
        ('Girls Block C', 2, '202', 'Double', 'AC', 'Available')`;
        
        await pool.request().query(roomsQuery);
        console.log('✅ Added 20 new rooms successfully!');
        await pool.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

addRooms();