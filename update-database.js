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

async function updateDatabase() {
    try {
        const pool = await sql.connect(config);
        console.log('✅ Connected to database');
        
        // Check if AdminMessage column exists
        const columnCheck = await pool.request().query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'AdminMessage'
        `);
        
        if (columnCheck.recordset.length === 0) {
            // Add AdminMessage column to Bookings table
            await pool.request().query(`
                ALTER TABLE Bookings 
                ADD AdminMessage NVARCHAR(500) NULL
            `);
            console.log('✅ Added AdminMessage column to Bookings table');
        } else {
            console.log('✅ AdminMessage column already exists');
        }
        
        await pool.close();
        console.log('✅ Database update completed');
        
    } catch (error) {
        console.error('❌ Error updating database:', error.message);
    }
}

updateDatabase();