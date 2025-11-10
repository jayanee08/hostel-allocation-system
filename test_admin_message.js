// Test script to verify AdminMessage functionality
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

async function testAdminMessage() {
    try {
        const pool = await sql.connect(config);
        
        // Check if AdminMessage column exists
        const columnCheck = await pool.request().query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'AdminMessage'
        `);
        
        if (columnCheck.recordset.length === 0) {
            console.log('❌ AdminMessage column does not exist');
            console.log('🔧 Adding AdminMessage column...');
            
            await pool.request().query('ALTER TABLE Bookings ADD AdminMessage NVARCHAR(500) NULL');
            console.log('✅ AdminMessage column added successfully');
        } else {
            console.log('✅ AdminMessage column already exists');
        }
        
        await pool.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAdminMessage();