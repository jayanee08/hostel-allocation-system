-- Run this in your Azure SQL Database to fix the admin message issue
ALTER TABLE Bookings ADD AdminMessage NVARCHAR(500) NULL;