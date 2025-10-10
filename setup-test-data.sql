-- Clear existing data and setup fresh test data
-- Run this in Azure SQL Query Editor

-- Clear existing data
DELETE FROM Bookings;
DELETE FROM Users;
DELETE FROM Rooms;
DELETE FROM Admin;

-- Reset identity columns
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Rooms', RESEED, 0);
DBCC CHECKIDENT ('Bookings', RESEED, 0);
DBCC CHECKIDENT ('Admin', RESEED, 0);

-- Insert Admin (for testing)
INSERT INTO Admin (Email, Password) VALUES ('admin@hostel.com', 'Admin123');

-- Insert Test Students (passwords are hashed for 'password123')
INSERT INTO Users (Name, RegisterNumber, Department, Gender, Email, Password) VALUES
('John Doe', 'REG001', 'Computer Science', 'Male', 'john@student.com', '$2b$10$rOvHPnRkZjKjZjKjZjKjZeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1'),
('Jane Smith', 'REG002', 'Information Technology', 'Female', 'jane@student.com', '$2b$10$rOvHPnRkZjKjZjKjZjKjZeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1'),
('Mike Johnson', 'REG003', 'Electronics', 'Male', 'mike@student.com', '$2b$10$rOvHPnRkZjKjZjKjZjKjZeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1'),
('Sarah Wilson', 'REG004', 'Mechanical', 'Female', 'sarah@student.com', '$2b$10$rOvHPnRkZjKjZjKjZjKjZeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J1');

-- Insert Rooms
INSERT INTO Rooms (BlockName, FloorNumber, RoomNumber, RoomType, ACType, Availability) VALUES
-- Boys Block A
('Boys Block A', 1, '101', 'Single', 'AC', 'Available'),
('Boys Block A', 1, '102', 'Double', 'Non-AC', 'Available'),
('Boys Block A', 1, '103', 'Single', 'AC', 'Available'),
('Boys Block A', 2, '201', 'Double', 'AC', 'Available'),
('Boys Block A', 2, '202', 'Single', 'Non-AC', 'Available'),
('Boys Block A', 2, '203', 'Double', 'AC', 'Available'),

-- Girls Block B
('Girls Block B', 1, '101', 'Single', 'AC', 'Available'),
('Girls Block B', 1, '102', 'Double', 'Non-AC', 'Available'),
('Girls Block B', 1, '103', 'Single', 'AC', 'Available'),
('Girls Block B', 2, '201', 'Double', 'AC', 'Available'),
('Girls Block B', 2, '202', 'Single', 'Non-AC', 'Available'),
('Girls Block B', 2, '203', 'Double', 'AC', 'Available');

-- Verify data
SELECT 'Admin Count' as TableName, COUNT(*) as Count FROM Admin
UNION ALL
SELECT 'Users Count', COUNT(*) FROM Users
UNION ALL
SELECT 'Rooms Count', COUNT(*) FROM Rooms
UNION ALL
SELECT 'Bookings Count', COUNT(*) FROM Bookings;