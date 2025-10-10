const sql = require('mssql');

// Test Azure SQL Database connection
const config = {
    user: 'hostel_admin',                    // Replace with your admin login
    password: 'Nikhil&2005',             // Replace with your password
    server: 'hostel-server-2024.database.windows.net', // Replace with your server name
    database: 'hostel_management',
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

async function testConnection() {
    try {
        console.log('🔄 Connecting to Azure SQL Database...');
        const pool = await sql.connect(config);
        console.log('✅ Connected successfully!');
        
        // Test query
        const result = await pool.request().query('SELECT COUNT(*) as RoomCount FROM Rooms');
        console.log(`📊 Found ${result.recordset[0].RoomCount} rooms in database`);
        
        await pool.close();
        console.log('✅ Connection test completed successfully!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Check your server name, username, and password');
        console.log('2. Ensure firewall rules allow your IP address');
        console.log('3. Verify the database exists and tables are created');
    }
}

testConnection();