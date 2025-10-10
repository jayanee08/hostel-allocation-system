# Hostel Room Allocation System

A modern web application for managing hostel room bookings with automatic approval system.

## Features

- **Student Registration & Login**
- **Admin Dashboard**
- **Automatic Room Approval**
- **Gender-based Block Access**
- **Real-time Room Availability**
- **Modern Black-themed UI**

## Setup Instructions

### 1. Azure SQL Database Setup

1. **Create Azure SQL Database:**
   - Go to Azure Portal (portal.azure.com)
   - Create a new SQL Database named "HostelDB"
   - Note down the server name, username, and password

2. **Run Database Script:**
   - Open Azure SQL Query Editor
   - Copy and paste the content from `database.sql`
   - Execute the script to create tables and sample data

3. **Update Connection String:**
   - Open `server.js`
   - Update the config object with your Azure SQL credentials:
   ```javascript
   const config = {
       user: 'your_username',
       password: 'your_password',
       server: 'your_server.database.windows.net',
       database: 'HostelDB',
       options: {
           encrypt: true,
           trustServerCertificate: false
       }
   };
   ```

### 2. Backend Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Server:**
   ```bash
   npm start
   ```
   Server will run on http://localhost:3000

### 3. Frontend Access

1. Open browser and go to `http://localhost:3000`
2. Use the following credentials:

**Admin Login:**
- Email: admin@hostel.com
- Password: Admin123

**Student Registration:**
- Register new students through the registration page

## Project Structure

```
├── server.js              # Node.js backend server
├── database.sql           # Azure SQL database setup script
├── package.json           # Node.js dependencies
├── index.html             # Landing page
├── login.html             # Login page
├── register.html          # Student registration
├── student_dashboard.html # Student dashboard
├── admin_dashboard.html   # Admin dashboard
├── styles.css             # Modern black-themed CSS
└── README.md              # This file
```

## API Endpoints

- `POST /api/register` - Student registration
- `POST /api/login` - User authentication
- `GET /api/rooms/:gender` - Get available rooms by gender
- `POST /api/book` - Book a room (auto-approval)
- `GET /api/bookings/:userId` - Get user bookings

## Database Tables

- **Users** - Student information
- **Rooms** - Room details and availability
- **Bookings** - Booking records and status
- **Admin** - Admin credentials

## Auto-Approval Logic

When a student books a room:
1. System checks room availability
2. If available → Auto-approve and mark room as occupied
3. If occupied → Auto-reject booking
4. Status updates instantly in student dashboard

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** Azure SQL Database
- **Styling:** Modern black theme with gradient effects