const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Local JSON storage (for demo without Azure SQL)
const dataFile = path.join(__dirname, 'local-data.json');

// Initialize local data
let localData = {
    users: [],
    rooms: [],
    bookings: [],
    admin: [{ AdminID: 1, Email: 'admin@hostel.com', Password: 'Admin123' }]
};

// Initialize with test students
async function initializeTestData() {
    if (localData.users.length === 0) {
        const testPassword = await bcrypt.hash('password123', 10);
        
        localData.users = [
            {
                UserID: 1,
                Name: 'John Doe',
                RegisterNumber: 'REG001',
                Department: 'Computer Science',
                Gender: 'Male',
                Email: 'john@student.com',
                Password: testPassword
            },
            {
                UserID: 2,
                Name: 'Jane Smith',
                RegisterNumber: 'REG002',
                Department: 'Information Technology',
                Gender: 'Female',
                Email: 'jane@student.com',
                Password: testPassword
            },
            {
                UserID: 3,
                Name: 'Mike Johnson',
                RegisterNumber: 'REG003',
                Department: 'Electronics',
                Gender: 'Male',
                Email: 'mike@student.com',
                Password: testPassword
            },
            {
                UserID: 4,
                Name: 'Sarah Wilson',
                RegisterNumber: 'REG004',
                Department: 'Mechanical',
                Gender: 'Female',
                Email: 'sarah@student.com',
                Password: testPassword
            }
        ];
        
        saveData();
    }
}

// Load existing data or create initial data
if (fs.existsSync(dataFile)) {
    localData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
} else {
    // Create initial rooms
    const rooms = [
        // Boys Block A
        { RoomID: 1, BlockName: 'Boys Block A', FloorNumber: 1, RoomNumber: '101', RoomType: 'Single', ACType: 'AC', Availability: 'Available' },
        { RoomID: 2, BlockName: 'Boys Block A', FloorNumber: 1, RoomNumber: '102', RoomType: 'Double', ACType: 'Non-AC', Availability: 'Available' },
        { RoomID: 3, BlockName: 'Boys Block A', FloorNumber: 1, RoomNumber: '103', RoomType: 'Single', ACType: 'AC', Availability: 'Available' },
        { RoomID: 4, BlockName: 'Boys Block A', FloorNumber: 2, RoomNumber: '201', RoomType: 'Double', ACType: 'AC', Availability: 'Available' },
        { RoomID: 5, BlockName: 'Boys Block A', FloorNumber: 2, RoomNumber: '202', RoomType: 'Single', ACType: 'Non-AC', Availability: 'Available' },
        { RoomID: 6, BlockName: 'Boys Block A', FloorNumber: 2, RoomNumber: '203', RoomType: 'Double', ACType: 'AC', Availability: 'Available' },
        
        // Girls Block B
        { RoomID: 7, BlockName: 'Girls Block B', FloorNumber: 1, RoomNumber: '101', RoomType: 'Single', ACType: 'AC', Availability: 'Available' },
        { RoomID: 8, BlockName: 'Girls Block B', FloorNumber: 1, RoomNumber: '102', RoomType: 'Double', ACType: 'Non-AC', Availability: 'Available' },
        { RoomID: 9, BlockName: 'Girls Block B', FloorNumber: 1, RoomNumber: '103', RoomType: 'Single', ACType: 'AC', Availability: 'Available' },
        { RoomID: 10, BlockName: 'Girls Block B', FloorNumber: 2, RoomNumber: '201', RoomType: 'Double', ACType: 'AC', Availability: 'Available' },
        { RoomID: 11, BlockName: 'Girls Block B', FloorNumber: 2, RoomNumber: '202', RoomType: 'Single', ACType: 'Non-AC', Availability: 'Available' },
        { RoomID: 12, BlockName: 'Girls Block B', FloorNumber: 2, RoomNumber: '203', RoomType: 'Double', ACType: 'AC', Availability: 'Available' }
    ];
    
    localData.rooms = rooms;
    saveData();
}

function saveData() {
    fs.writeFileSync(dataFile, JSON.stringify(localData, null, 2));
}

function getNextId(array) {
    return array.length > 0 ? Math.max(...array.map(item => item.UserID || item.RoomID || item.BookingID || item.AdminID)) + 1 : 1;
}

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
        
        // Check if user already exists
        const existingUser = localData.users.find(u => u.Email === email || u.RegisterNumber === registerNumber);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email or Register Number already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            UserID: getNextId(localData.users),
            Name: name,
            RegisterNumber: registerNumber,
            Department: department,
            Gender: gender,
            Email: email,
            Password: hashedPassword
        };
        
        localData.users.push(newUser);
        saveData();
        
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
            const admin = localData.admin.find(a => a.Email === email);
            if (admin && password === admin.Password) {
                res.json({ success: true, userType: 'admin', user: admin });
            } else {
                res.status(401).json({ success: false, message: 'Invalid admin credentials' });
            }
        } else {
            const user = localData.users.find(u => u.Email === email);
            if (user) {
                const isValid = await bcrypt.compare(password, user.Password);
                if (isValid) {
                    res.json({ success: true, userType: 'student', user: user });
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
        const blockFilter = gender === 'Male' ? 'Boys' : 'Girls';
        
        const availableRooms = localData.rooms.filter(room => 
            room.BlockName.includes(blockFilter) && room.Availability === 'Available'
        );
        
        res.json(availableRooms);
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
        
        const room = localData.rooms.find(r => r.RoomID == roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        
        if (room.Availability === 'Available') {
            // Auto-approve and mark room as occupied
            const newBooking = {
                BookingID: getNextId(localData.bookings),
                UserID: parseInt(userId),
                RoomID: parseInt(roomId),
                Status: 'Approved',
                BookingDate: new Date().toISOString()
            };
            
            localData.bookings.push(newBooking);
            room.Availability = 'Occupied';
            saveData();
            
            res.json({ success: true, status: 'Approved', message: 'Room booked successfully' });
        } else {
            // Auto-reject
            const newBooking = {
                BookingID: getNextId(localData.bookings),
                UserID: parseInt(userId),
                RoomID: parseInt(roomId),
                Status: 'Rejected',
                BookingDate: new Date().toISOString()
            };
            
            localData.bookings.push(newBooking);
            saveData();
            
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
        
        const userBookings = localData.bookings
            .filter(b => b.UserID == userId)
            .map(booking => {
                const room = localData.rooms.find(r => r.RoomID === booking.RoomID);
                return {
                    ...booking,
                    BlockName: room?.BlockName,
                    FloorNumber: room?.FloorNumber,
                    RoomNumber: room?.RoomNumber,
                    RoomType: room?.RoomType,
                    ACType: room?.ACType
                };
            });
        
        res.json(userBookings);
    } catch (error) {
        console.error('Bookings fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings: ' + error.message });
    }
});

// Get all rooms (including occupied)
app.get('/api/all-rooms', async (req, res) => {
    try {
        res.json(localData.rooms);
    } catch (error) {
        console.error('All rooms fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch all rooms: ' + error.message });
    }
});

// Get all bookings with details
app.get('/api/all-bookings', async (req, res) => {
    try {
        res.json(localData.bookings);
    } catch (error) {
        console.error('All bookings fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch all bookings: ' + error.message });
    }
});

// Get all students
app.get('/api/all-students', async (req, res) => {
    try {
        res.json(localData.users);
    } catch (error) {
        console.error('All students fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch all students: ' + error.message });
    }
});

// Toggle room status (Admin only)
app.post('/api/toggle-room-status', async (req, res) => {
    try {
        const { roomId, newStatus } = req.body;
        
        if (!roomId || !newStatus) {
            return res.status(400).json({ success: false, message: 'Room ID and new status are required' });
        }
        
        const room = localData.rooms.find(r => r.RoomID == roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        
        room.Availability = newStatus;
        saveData();
        
        res.json({ success: true, message: `Room status updated to ${newStatus}` });
    } catch (error) {
        console.error('Toggle room status error:', error);
        res.status(500).json({ success: false, message: 'Failed to update room status: ' + error.message });
    }
});

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📱 Open your browser and go to: http://localhost:3002');
    console.log('');
    console.log('🔐 ADMIN LOGIN:');
    console.log('   Email: admin@hostel.com');
    console.log('   Password: Admin123');
    console.log('');
    console.log('👨🎓 TEST STUDENT LOGINS:');
    console.log('   Email: john@student.com | Password: password123');
    console.log('   Email: jane@student.com | Password: password123');
    console.log('   Email: mike@student.com | Password: password123');
    console.log('   Email: sarah@student.com | Password: password123');
    console.log('');
    console.log('✅ Using local JSON storage (no Azure SQL required for demo)');
    console.log('📁 Data stored in: local-data.json');
    
    // Initialize test data
    await initializeTestData();
    console.log('✅ Test data initialized');
});