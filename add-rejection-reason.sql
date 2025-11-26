-- Add RejectionReason column to Bookings table
ALTER TABLE Bookings 
ADD RejectionReason NVARCHAR(255) NULL;

-- Update existing rejected bookings with a default reason
UPDATE Bookings 
SET RejectionReason = 'Room was not available' 
WHERE Status = 'Rejected' AND RejectionReason IS NULL;