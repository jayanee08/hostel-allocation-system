
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    RegisterNumber NVARCHAR(50) UNIQUE NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL
);


CREATE TABLE Rooms (
    RoomID INT IDENTITY(1,1) PRIMARY KEY,
    BlockName NVARCHAR(50) NOT NULL,
    FloorNumber INT NOT NULL,
    RoomNumber NVARCHAR(10) NOT NULL,
    RoomType NVARCHAR(20) NOT NULL,
    ACType NVARCHAR(10) NOT NULL,
    Availability NVARCHAR(20) DEFAULT 'Available'
);


CREATE TABLE Bookings (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    RoomID INT FOREIGN KEY REFERENCES Rooms(RoomID),
    Status NVARCHAR(20) DEFAULT 'Pending',
    BookingDate DATETIME DEFAULT GETDATE(),
    AdminMessage NVARCHAR(500) NULL
);


CREATE TABLE Admin (
    AdminID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL
);


INSERT INTO Admin (Email, Password) VALUES ('admin@hostel.com', 'Admin123');


INSERT INTO Rooms (BlockName, FloorNumber, RoomNumber, RoomType, ACType, Availability) VALUES
('Boys Block A', 1, '101', 'Single', 'AC', 'Available'),
('Boys Block A', 1, '102', 'Double', 'Non-AC', 'Available'),
('Boys Block A', 2, '201', 'Single', 'AC', 'Available'),
('Boys Block A', 2, '202', 'Double', 'AC', 'Available'),
('Girls Block B', 1, '101', 'Single', 'AC', 'Available'),
('Girls Block B', 1, '102', 'Double', 'Non-AC', 'Available'),
('Girls Block B', 2, '201', 'Single', 'AC', 'Available'),
('Girls Block B', 2, '202', 'Double', 'AC', 'Available');

INSERT INTO Users (Name, RegisterNumber, Department, Gender, Email, Password) VALUES
('John Doe', 'REG001', 'Computer Science', 'Male', 'john@student.com', '$2b$10$example_hashed_password');