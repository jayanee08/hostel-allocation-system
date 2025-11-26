require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER || 'hostel_admin',
    password: process.env.DB_PASSWORD || 'Nikhil&2005',
    server: process.env.DB_SERVER || 'hostel-server-2024.database.windows.net',
    database: process.env.DB_NAME || 'hostel_management',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function checkAndAddColumn() {
    try {
        const pool = await sql.connect(config);
        
        // Check if RejectionReason column exists
        const checkColumn = await pool.request().query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'RejectionReason'
        `);
        
        if (checkColumn.recordset.length === 0) {
            console.log('Adding RejectionReason column...');
            await pool.request().query('ALTER TABLE Bookings ADD RejectionReason NVARCHAR(255) NULL');
            console.log('✅ RejectionReason column added successfully');
        } else {
            console.log('✅ RejectionReason column already exists');
        }
        
        // Update existing rejected bookings
        await pool.request().query(`
            UPDATE Bookings 
            SET RejectionReason = 'Room was not available' 
            WHERE Status = 'Rejected' AND RejectionReason IS NULL
        `);
        
        console.log('✅ Database updated successfully');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAndAddColumn();