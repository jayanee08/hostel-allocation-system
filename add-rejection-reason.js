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

async function addRejectionReasonColumn() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        
        // Check if column exists
        const checkColumn = await pool.request().query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'RejectionReason'
        `);
        
        if (checkColumn.recordset.length === 0) {
            console.log('Adding RejectionReason column...');
            await pool.request().query(`
                ALTER TABLE Bookings 
                ADD RejectionReason NVARCHAR(255) NULL
            `);
            console.log('✅ RejectionReason column added successfully!');
        } else {
            console.log('✅ RejectionReason column already exists!');
        }
        
        await pool.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

addRejectionReasonColumn();