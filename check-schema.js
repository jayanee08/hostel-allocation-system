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

async function checkSchema() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Rooms'");
        console.log('Rooms table columns:', result.recordset.map(r => r.COLUMN_NAME));
        await pool.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkSchema();