// Mock GenAI Service for Demo Purposes
class MockGenAIService {
    // Mock Room Recommendations
    async getSmartRoomRecommendations(studentProfile, availableRooms) {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const recommendations = availableRooms.slice(0, 3).map((room, index) => ({
            roomId: room.RoomID,
            roomNumber: room.RoomNumber,
            blockName: room.BlockName,
            reason: this.generateRecommendationReason(studentProfile, room, index),
            score: 95 - (index * 5)
        }));
        
        return { recommendations };
    }
    
    generateRecommendationReason(profile, room, index) {
        const reasons = [
            `Perfect for ${profile.department} students - quiet study environment`,
            `Great location in ${room.BlockName} with excellent facilities`,
            `Ideal ${room.RoomType} room with ${room.ACType} for comfort`
        ];
        return reasons[index] || `Suitable room in ${room.BlockName}`;
    }
    
    // Mock Chatbot
    async getChatbotResponse(userMessage) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const message = userMessage.toLowerCase();
        
        if (message.includes('book') || message.includes('booking')) {
            return "To book a room, go to 'Available Rooms' section, choose your preferred room, and click 'Book Room'. The system will automatically approve if the room is available!";
        }
        
        if (message.includes('available') || message.includes('rooms')) {
            return "You can check available rooms by clicking 'Available Rooms' in your dashboard. Rooms are filtered based on your gender and show real-time availability.";
        }
        
        if (message.includes('cancel') || message.includes('change')) {
            return "To cancel or change your booking, please contact the hostel administration. You can view your current bookings in 'My Bookings' section.";
        }
        
        if (message.includes('policy') || message.includes('rules')) {
            return "Hostel policies include: 1) No outside guests after 10 PM, 2) Keep rooms clean, 3) No loud music after 11 PM, 4) Report maintenance issues promptly.";
        }
        
        if (message.includes('payment') || message.includes('fee')) {
            return "Room fees are collected monthly. You'll receive payment notifications via email. Contact administration for payment-related queries.";
        }
        
        return "I'm here to help with room bookings, availability, policies, and general hostel queries. Feel free to ask me anything specific!";
    }
    
    // Mock Room Description Generator
    async generateRoomDescription(roomDetails) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const descriptions = [
            `Spacious ${roomDetails.RoomType} room in ${roomDetails.BlockName} featuring ${roomDetails.ACType} and modern amenities. Perfect for comfortable living with excellent ventilation and natural lighting.`,
            `Well-furnished ${roomDetails.RoomType} accommodation on Floor ${roomDetails.FloorNumber} with ${roomDetails.ACType}. Ideal for students seeking a peaceful study environment.`,
            `Premium ${roomDetails.RoomType} room in ${roomDetails.BlockName} equipped with ${roomDetails.ACType} and all essential facilities for a comfortable hostel experience.`
        ];
        
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    // Mock Analytics
    async analyzeBookingPatterns(bookingData) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        return {
            insights: [
                "Peak booking time: 2-4 PM on weekdays",
                "Most popular: Single AC rooms in Block A",
                "Recommendation: Add more AC rooms to meet demand",
                "Average booking completion time: 3 minutes"
            ]
        };
    }
}

module.exports = new MockGenAIService();