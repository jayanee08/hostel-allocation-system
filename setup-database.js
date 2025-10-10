const sql = require('mssql');
const bcrypt = require('bcrypt');

// REPLACE THESE WITH YOUR ACTUAL AZURE SQL CREDENTIALS
const config = {
    user: 'hostel_admin',                    // Replace with your admin login
    password: 'HostelAdmin123!',             // Replace with your password  
    server: 'hostel-server-yourname.database.windows.net', // Replace with your server name
    database: 'HostelDB',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function setupDatabase() {
    try {
        console.log('🔄 Connecting to Azure SQL Database...');
        const pool = await sql.connect(config);
        console.log('✅ Connected successfully!');
        
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await pool.request().query('DELETE FROM Bookings');
        await pool.request().query('DELETE FROM Users');
        await pool.request().query('DELETE FROM Rooms');
        await pool.request().query('DELETE FROM Admin');
        
        // Reset identity columns
        await pool.request().query('DBCC CHECKIDENT (\'Users\', RESEED, 0)');
        await pool.request().query('DBCC CHECKIDENT (\'Rooms\', RESEED, 0)');
        await pool.request().query('DBCC CHECKIDENT (\'Bookings\', RESEED, 0)');
        await pool.request().query('DBCC CHECKIDENT (\'Admin\', RESEED, 0)');
        
        // Insert Admin
        console.log('👨‍💼 Creating admin account...');
        await pool.request()
            .input('email', sql.NVarChar, 'admin@hostel.com')
            .input('password', sql.NVarChar, 'Admin123')
            .query('INSERT INTO Admin (Email, Password) VALUES (@email, @password)');
        
        // Insert Test Students with properly hashed passwords
        console.log('👨‍🎓 Creating test student accounts...');
        const testStudents = [
            { name: 'John Doe', regNo: 'REG001', dept: 'Computer Science', gender: 'Male', email: 'john@student.com' },
            { name: 'Jane Smith', regNo: 'REG002', dept: 'Information Technology', gender: 'Female', email: 'jane@student.com' },
            { name: 'Mike Johnson', regNo: 'REG003', dept: 'Electronics', gender: 'Male', email: 'mike@student.com' },
            { name: 'Sarah Wilson', regNo: 'REG004', dept: 'Mechanical', gender: 'Female', email: 'sarah@student.com' }
        ];
        
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        for (let student of testStudents) {
            await pool.request()
                .input('name', sql.NVarChar, student.name)
                .input('registerNumber', sql.NVarChar, student.regNo)
                .input('department', sql.NVarChar, student.dept)
                .input('gender', sql.NVarChar, student.gender)
                .input('email', sql.NVarChar, student.email)
                .input('password', sql.NVarChar, hashedPassword)
                .query('INSERT INTO Users (Name, RegisterNumber, Department, Gender, Email, Password) VALUES (@name, @registerNumber, @department, @gender, @email, @password)');
        }
        
        // Insert Rooms
        console.log('🏠 Creating rooms...');
        const rooms = [
            // Boys Block A
            { block: 'Boys Block A', floor: 1, room: '101', type: 'Single', ac: 'AC' },
            { block: 'Boys Block A', floor: 1, room: '102', type: 'Double', ac: 'Non-AC' },
            { block: 'Boys Block A', floor: 1, room: '103', type: 'Single', ac: 'AC' },
            { block: 'Boys Block A', floor: 2, room: '201', type: 'Double', ac: 'AC' },
            { block: 'Boys Block A', floor: 2, room: '202', type: 'Single', ac: 'Non-AC' },
            { block: 'Boys Block A', floor: 2, room: '203', type: 'Double', ac: 'AC' },
            
            // Girls Block B
            { block: 'Girls Block B', floor: 1, room: '101', type: 'Single', ac: 'AC' },
            { block: 'Girls Block B', floor: 1, room: '102', type: 'Double', ac: 'Non-AC' },
            { block: 'Girls Block B', floor: 1, room: '103', type: 'Single', ac: 'AC' },
            { block: 'Girls Block B', floor: 2, room: '201', type: 'Double', ac: 'AC' },
            { block: 'Girls Block B', floor: 2, room: '202', type: 'Single', ac: 'Non-AC' },
            { block: 'Girls Block B', floor: 2, room: '203', type: 'Double', ac: 'AC' }
        ];
        
        for (let room of rooms) {
            await pool.request()
                .input('blockName', sql.NVarChar, room.block)
                .input('floorNumber', sql.Int, room.floor)
                .input('roomNumber', sql.NVarChar, room.room)
                .input('roomType', sql.NVarChar, room.type)
                .input('acType', sql.NVarChar, room.ac)
                .input('availability', sql.NVarChar, 'Available')
                .query('INSERT INTO Rooms (BlockName, FloorNumber, RoomNumber, RoomType, ACType, Availability) VALUES (@blockName, @floorNumber, @roomNumber, @roomType, @acType, @availability)');
        }
        
        // Verify data
        console.log('📊 Verifying data...');
        const adminCount = await pool.request().query('SELECT COUNT(*) as count FROM Admin');
        const userCount = await pool.request().query('SELECT COUNT(*) as count FROM Users');
        const roomCount = await pool.request().query('SELECT COUNT(*) as count FROM Rooms');
        
        console.log(`✅ Setup complete!`);
        console.log(`   - Admins: ${adminCount.recordset[0].count}`);
        console.log(`   - Students: ${userCount.recordset[0].count}`);
        console.log(`   - Rooms: ${roomCount.recordset[0].count}`);
        
        console.log('\n🎯 Test Credentials:');
        console.log('Admin: admin@hostel.com / Admin123');
        console.log('Student: john@student.com / password123');
        console.log('Student: jane@student.com / password123');
        
        await pool.close();
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n🔧 Make sure to update the server name in this file!');
    }
}

setupDatabase();