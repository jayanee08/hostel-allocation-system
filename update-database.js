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

async function updateDatabase() {
    try {
        const pool = await sql.connect(config);
        
        // Add RejectionReason column
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'RejectionReason')
            BEGIN
                ALTER TABLE Bookings ADD RejectionReason NVARCHAR(255) NULL
            END
        `);
        
        console.log('✅ RejectionReason column added successfully');
        
        await pool.close();
    } catch (error) {
        console.error('❌ Database update failed:', error);
    }
}

updateDatabase();