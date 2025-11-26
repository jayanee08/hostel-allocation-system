<<<<<<< HEAD
require('dotenv').config();
=======
<<<<<<< HEAD
require('dotenv').config();
=======
>>>>>>> 19dd94f0b185677226cb0f094c64f9baec816ab3
>>>>>>> ba24849c401000dfadda9388747bb615161fd56a
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ba24849c401000dfadda9388747bb615161fd56a
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
<<<<<<< HEAD
=======
=======
        console.log('🔄 Testing Azure SQL connection...');
        const pool = await sql.connect(config);
        console.log('✅ Connection successful!');
        
        const result = await pool.request().query('SELECT COUNT(*) as count FROM Rooms');
        console.log(`📊 Total rooms in database: ${result.recordset[0].count}`);
        
        await pool.close();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('💡 Fix: Add your IP to Azure SQL firewall rules');
>>>>>>> 19dd94f0b185677226cb0f094c64f9baec816ab3
>>>>>>> ba24849c401000dfadda9388747bb615161fd56a
    }
}

testConnection();