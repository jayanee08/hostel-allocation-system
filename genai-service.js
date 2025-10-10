const { OpenAI } = require('openai');

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

class GenAIService {
    // Room Recommendation System
    async getSmartRoomRecommendations(studentProfile, availableRooms) {
        const prompt = `
        Based on the student profile and available rooms, recommend the best 3 rooms:
        
        Student Profile:
        - Department: ${studentProfile.department}
        - Gender: ${studentProfile.gender}
        - Preferences: ${studentProfile.preferences || 'Standard room'}
        
        Available Rooms:
        ${availableRooms.map(room => 
            `- Room ${room.RoomNumber} in ${room.BlockName}: ${room.RoomType}, ${room.ACType}`
        ).join('\n')}
        
        Provide recommendations with reasons in JSON format:
        {
            "recommendations": [
                {
                    "roomId": 1,
                    "roomNumber": "101",
                    "reason": "Perfect for your department students",
                    "score": 95
                }
            ]
        }
        `;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500,
                temperature: 0.7
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('GenAI Recommendation Error:', error);
            return { recommendations: [] };
        }
    }

    // Chatbot Response System
    async getChatbotResponse(userMessage, context = {}) {
        const prompt = `
        You are a helpful hostel management assistant. Answer student queries about:
        - Room booking process
        - Available rooms
        - Hostel policies
        - General support
        
        Student Question: "${userMessage}"
        
        Context: ${JSON.stringify(context)}
        
        Provide a helpful, friendly response in under 150 words.
        `;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 200,
                temperature: 0.8
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Chatbot Error:', error);
            return "I'm sorry, I'm having trouble right now. Please try again later.";
        }
    }

    // Room Description Generator
    async generateRoomDescription(roomDetails) {
        const prompt = `
        Create an attractive room description for a hostel room:
        
        Room Details:
        - Room Number: ${roomDetails.RoomNumber}
        - Block: ${roomDetails.BlockName}
        - Type: ${roomDetails.RoomType}
        - AC: ${roomDetails.ACType}
        - Floor: ${roomDetails.FloorNumber}
        
        Write a compelling 2-3 sentence description that highlights the room's features.
        `;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.9
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Description Generation Error:', error);
            return `Comfortable ${roomDetails.RoomType} room in ${roomDetails.BlockName}`;
        }
    }

    // Booking Analytics
    async analyzeBookingPatterns(bookingData) {
        const prompt = `
        Analyze these hostel booking patterns and provide insights:
        
        Booking Data: ${JSON.stringify(bookingData)}
        
        Provide insights about:
        1. Peak booking times
        2. Popular room types
        3. Recommendations for management
        
        Format as JSON with insights array.
        `;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 400,
                temperature: 0.6
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Analytics Error:', error);
            return { insights: [] };
        }
    }
}

module.exports = new GenAIService();