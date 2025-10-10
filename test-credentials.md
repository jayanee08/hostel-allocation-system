# Test Credentials for Hostel Room Allocation System

## Admin Login
- **Email:** admin@hostel.com
- **Password:** Admin123

## Student Test Accounts (Register New or Use These)

### For Registration Testing - Use These Details:
1. **Student 1:**
   - Name: Alex Johnson
   - Register Number: REG005
   - Department: Computer Science
   - Gender: Male
   - Email: alex@student.com
   - Password: password123

2. **Student 2:**
   - Name: Emma Davis
   - Register Number: REG006
   - Department: Information Technology
   - Gender: Female
   - Email: emma@student.com
   - Password: password123

3. **Student 3:**
   - Name: David Brown
   - Register Number: REG007
   - Department: Electronics
   - Gender: Male
   - Email: david@student.com
   - Password: password123

4. **Student 4:**
   - Name: Lisa Miller
   - Register Number: REG008
   - Department: Mechanical
   - Gender: Female
   - Email: lisa@student.com
   - Password: password123

## Testing Steps:

### 1. Admin Testing:
1. Go to http://localhost:3001
2. Click "Login"
3. Switch to "Admin" tab
4. Use admin credentials above
5. Should redirect to admin dashboard

### 2. Student Registration Testing:
1. Go to http://localhost:3001
2. Click "Register"
3. Fill form with any of the student details above
4. Should show "Registration successful"
5. Try logging in with the same credentials

### 3. Student Login Testing:
1. Go to http://localhost:3001
2. Click "Login"
3. Stay on "Student" tab
4. Use registered student credentials
5. Should redirect to student dashboard

### 4. Room Booking Testing:
1. Login as student
2. Click "Available Rooms"
3. Should see rooms based on gender
4. Click "Book Room" on any available room
5. Check "My Bookings" to see status

## Available Rooms:
- **Boys Block A:** Rooms 101, 102, 103, 201, 202, 203
- **Girls Block B:** Rooms 101, 102, 103, 201, 202, 203
- All rooms are initially available for booking