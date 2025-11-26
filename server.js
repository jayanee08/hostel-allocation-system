require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const ChatbotService = require('./chatbot-service');



const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Azure SQL Database configuration
const config = {
    user: process.env.DB_USER || 'hostel_admin',
    password: process.env.DB_PASSWORD || 'Nikhil&2005',
    server: process.env.DB_SERVER || 'hostel-server-2024.database.windows.net',
    database: process.env.DB_NAME || 'hostel_management',
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

// Database connection pool
let pool;

async function connectDB() {
    try {
        console.log('🔄 Connecting to Azure SQL Database...');
        console.log(`📍 Server: ${config.server}`);
        console.log(`🗄️ Database: ${config.database}`);
        console.log(`👤 User: ${config.user}`);
        
        pool = await sql.connect(config);
        console.log('✅ Connected to Azure SQL Database successfully!');
        
        // Test the connection
        const testResult = await pool.request().query('SELECT 1 as test');
        console.log('🧪 Database test query successful');
        
        return pool;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('🔍 Error details:', err);
        console.log('🤖 Server running with AI features only');
        pool = null;
        return null;
    }
}

// Initialize database connection
connectDB().catch(() => {});

let chatbotService;
setTimeout(() => {
    if (pool) {
        chatbotService = new ChatbotService(pool);
        console.log('✅ Alex chatbot service initialized');
    } else {
        console.log('❌ Chatbot service not initialized - no database connection');
    }
}, 2000);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Student Registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, registerNumber, department, gender, email, password } = req.body;
        
        if (!name || !registerNumber || !department || !gender || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        // Check if email or register number already exists
        const checkRequest = pool.request();
        const existingUser = await checkRequest
            .input('email', sql.NVarChar, email)
            .input('registerNumber', sql.NVarChar, registerNumber)
            .query('SELECT Email, RegisterNumber FROM Users WHERE Email = @email OR RegisterNumber = @registerNumber');
        
        if (existingUser.recordset.length > 0) {
            const existing = existingUser.recordset[0];
            if (existing.Email === email) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
            if (existing.RegisterNumber === registerNumber) {
                return res.status(400).json({ success: false, message: 'Register Number already exists' });
            }
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const request = pool.request();
        await request
            .input('name', sql.NVarChar, name)
            .input('registerNumber', sql.NVarChar, registerNumber)
            .input('department', sql.NVarChar, department)
            .input('gender', sql.NVarChar, gender)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .query('INSERT INTO Users (Name, RegisterNumber, Department, Gender, Email, Password) VALUES (@name, @registerNumber, @department, @gender, @email, @password)');
        
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        
        if (!email || !password || !userType) {
            return res.status(400).json({ success: false, message: 'Email, password, and user type are required' });
        }
        
        if (userType === 'admin') {
            const request = pool.request();
            const result = await request
                .input('email', sql.NVarChar, email)
                .query('SELECT * FROM Admin WHERE Email = @email');
            
            if (result.recordset.length > 0 && password === result.recordset[0].Password) {
                res.json({ success: true, userType: 'admin', user: result.recordset[0] });
            } else {
                res.status(401).json({ success: false, message: 'Invalid admin credentials' });
            }
        } else {
            const request = pool.request();
            const result = await request
                .input('email', sql.NVarChar, email)
                .query('SELECT * FROM Users WHERE Email = @email');
            
            if (result.recordset.length > 0) {
                const isValid = await bcrypt.compare(password, result.recordset[0].Password);
                if (isValid) {
                    res.json({ success: true, userType: 'student', user: result.recordset[0] });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid password' });
                }
            } else {
                res.status(401).json({ success: false, message: 'Student not found' });
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed: ' + error.message });
    }
});

// Get available rooms
app.get('/api/rooms/:gender', async (req, res) => {
    try {
        const { gender } = req.params;
        const blockFilter = gender === 'Male' ? 'Boys%' : 'Girls%';
        
        const request = pool.request();
        const result = await request
            .input('blockFilter', sql.NVarChar, blockFilter)
            .query('SELECT * FROM Rooms WHERE BlockName LIKE @blockFilter AND Availability = \'Available\'');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Rooms fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch rooms: ' + error.message });
    }
});

// Book room
app.post('/api/book', async (req, res) => {
    try {
        const { userId, roomId } = req.body;
        
        if (!userId || !roomId) {
            return res.status(400).json({ success: false, message: 'User ID and Room ID are required' });
        }
        
        // Check if user already has an approved booking
        const existingBooking = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM Bookings WHERE UserID = @userId AND Status = \'Approved\'');
        
        if (existingBooking.recordset.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already booked a room. Contact admin for assistance.' 
            });
        }
        
        // Check room availability
        const roomCheck = await pool.request()
            .input('roomId', sql.Int, roomId)
            .query('SELECT Availability FROM Rooms WHERE RoomID = @roomId');
        
        if (roomCheck.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        
        if (roomCheck.recordset[0].Availability === 'Available') {
            // Auto-approve and mark room as occupied
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('roomId', sql.Int, roomId)
                .input('status', sql.NVarChar, 'Approved')
                .query('INSERT INTO Bookings (UserID, RoomID, Status) VALUES (@userId, @roomId, @status)');
            
            await pool.request()
                .input('roomId', sql.Int, roomId)
                .query('UPDATE Rooms SET Availability = \'Occupied\' WHERE RoomID = @roomId');
            
            res.json({ success: true, status: 'Approved', message: 'Room booked successfully' });
        } else {
            // Auto-reject
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('roomId', sql.Int, roomId)
                .input('status', sql.NVarChar, 'Rejected')
                .query('INSERT INTO Bookings (UserID, RoomID, Status) VALUES (@userId, @roomId, @status)');
            
            res.json({ success: false, status: 'Rejected', message: 'Room already occupied' });
        }
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ success: false, message: 'Booking failed: ' + error.message });
    }
});

// Get user bookings
app.get('/api/bookings/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const request = pool.request();
        const result = await request
            .input('userId', sql.Int, userId)
            .query(`SELECT b.*, r.BlockName, r.FloorNumber, r.RoomNumber, r.RoomType, r.ACType 
                    FROM Bookings b 
                    JOIN Rooms r ON b.RoomID = r.RoomID 
                    WHERE b.UserID = @userId ORDER BY b.BookingDate DESC`);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Bookings fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings: ' + error.message });
    }
});

// Get all rooms (for admin)
app.get('/api/all-rooms', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query('SELECT * FROM Rooms ORDER BY BlockName, FloorNumber, RoomNumber');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('All rooms fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch all rooms: ' + error.message });
    }
});

// Get all bookings (for admin)
app.get('/api/all-bookings', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query(`
            SELECT b.*, u.Name as StudentName, u.RegisterNumber, u.Department, u.Gender, u.Email,
                   r.BlockName, r.FloorNumber, r.RoomNumber, r.RoomType, r.ACType 
            FROM Bookings b 
            JOIN Users u ON b.UserID = u.UserID 
            JOIN Rooms r ON b.RoomID = r.RoomID 
            ORDER BY b.BookingDate DESC
        `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('All bookings fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch all bookings: ' + error.message });
    }
});

// Get all students (for admin)
app.get('/api/all-students', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query('SELECT UserID, Name, RegisterNumber, Department, Gender, Email FROM Users ORDER BY Name');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('All students fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch all students: ' + error.message });
    }
});

// Toggle room status (for admin)
app.post('/api/toggle-room-status', async (req, res) => {
    try {
        const { roomId, newStatus } = req.body;
        
        if (!roomId || !newStatus) {
            return res.status(400).json({ success: false, message: 'Room ID and new status are required' });
        }
        
        const request = pool.request();
        await request
            .input('roomId', sql.Int, roomId)
            .input('newStatus', sql.NVarChar, newStatus)
            .query('UPDATE Rooms SET Availability = @newStatus WHERE RoomID = @roomId');
        
        res.json({ success: true, message: `Room status updated to ${newStatus}` });
    } catch (error) {
        console.error('Toggle room status error:', error);
        res.status(500).json({ success: false, message: 'Failed to update room status: ' + error.message });
    }
});



app.post('/api/chat', async (req, res) => {
    try {
        const { message, userContext } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }
        
        console.log('Received message:', message);
        
        if (!chatbotService) {
            console.log('Chatbot service not available');
            return res.json({ 
                success: true, 
                response: "Hi! I'm Alex, your hostel assistant. The AI service is initializing. I can help with room booking, login issues, and general information. What would you like to know?" 
            });
        }
        
        const response = await chatbotService.processMessage(message.trim(), userContext);
        console.log('Sending response:', response);
        res.json({ success: true, response });
        
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Chat service temporarily unavailable. Please try again.' 
        });
    }
});

// Debug endpoint to check database contents
app.get('/api/debug/users', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query('SELECT Email, RegisterNumber, Name FROM Users');
        res.json({ success: true, users: result.recordset });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Test API endpoint
app.get('/api/test-ai', async (req, res) => {
    try {
        if (!chatbotService) {
            return res.json({ success: false, message: 'Chatbot service not initialized' });
        }
        
        const testResponse = await chatbotService.processMessage('how many rooms are available in boys block');
        res.json({ success: true, response: testResponse, service: 'New Alex Chatbot' });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and go to: http://localhost:${PORT}`);
    console.log('🔐 Admin Login: admin@hostel.com / Admin123');
    console.log('🤖 Alex Chatbot: Direct Database Queries');
    console.log('🧠 Alex Assistant: Smart Question Detection');
    console.log('🔗 Test Alex: http://localhost:${PORT}/api/test-ai');
    console.log('🏠 Hostel Management System Ready');
});