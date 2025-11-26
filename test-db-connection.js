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

async function testConnection() {
    try {
        console.log('🔄 Connecting to Azure SQL Database...');
        const pool = await sql.connect(config);
        console.log('✅ Connected successfully!');
        
        // Test query
        const result = await pool.request().query('SELECT COUNT(*) as count FROM Users');
        console.log(`📊 Users in database: ${result.recordset[0].count}`);
        
        const rooms = await pool.request().query('SELECT COUNT(*) as count FROM Rooms');
        console.log(`🏠 Rooms in database: ${rooms.recordset[0].count}`);
        
        await pool.close();
        console.log('🔌 Connection closed');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();