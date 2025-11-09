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
        console.log('🔄 Testing Azure SQL connection...');
        const pool = await sql.connect(config);
        console.log('✅ Connection successful!');
        
        const result = await pool.request().query('SELECT COUNT(*) as count FROM Rooms');
        console.log(`📊 Total rooms in database: ${result.recordset[0].count}`);
        
        await pool.close();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('💡 Fix: Add your IP to Azure SQL firewall rules');
    }
}

testConnection();