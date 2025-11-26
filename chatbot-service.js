const OpenAI = require('openai');

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: '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'
});

class ChatbotService {
    constructor(pool) {
        this.pool = pool;
    }

    async processMessage(message, userContext = null) {
        const lowerMessage = message.toLowerCase();
        
        // Direct room count queries
        if (this.isRoomCountQuestion(lowerMessage)) {
            return await this.handleRoomCountQuestion(lowerMessage);
        }
        
        // Other specific questions
        if (lowerMessage.includes('login') || lowerMessage.includes('admin')) {
            return "🔐 Admin login: admin@hostel.com / Admin123. Students need to register first.";
        }
        
        if (lowerMessage.includes('book') || lowerMessage.includes('booking')) {
            return "📋 To book: Login → Available Rooms → Select room → Click 'Book This Room'. It's FREE and auto-approved!";
        }
        
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('free')) {
            return "💰 All rooms are completely FREE! No payment required.";
        }
        
        if (lowerMessage.includes('block') && !this.isRoomCountQuestion(lowerMessage)) {
            return "🏢 Boys Block A (3 floors) for male students, Girls Block B (3 floors) for female students.";
        }
        
        return "👋 Hi! I'm Alex. Ask me about room counts, booking, login, or any hostel questions!";
    }
    
    isRoomCountQuestion(message) {
        const countKeywords = ['how many', 'available', 'count', 'number of'];
        const roomKeywords = ['room', 'rooms'];
        const blockKeywords = ['boys', 'girls', 'block'];
        
        const hasCountKeyword = countKeywords.some(keyword => message.includes(keyword));
        const hasRoomKeyword = roomKeywords.some(keyword => message.includes(keyword));
        const hasBlockKeyword = blockKeywords.some(keyword => message.includes(keyword));
        
        return hasCountKeyword && hasRoomKeyword && hasBlockKeyword;
    }
    
    async handleRoomCountQuestion(message) {
        try {
            if (message.includes('boys')) {
                if (message.includes('available')) {
                    const result = await this.pool.request().query(
                        "SELECT COUNT(*) as count FROM Rooms WHERE BlockName LIKE 'Boys%' AND Availability = 'Available'"
                    );
                    return `🏠 Boys Block A has ${result.recordset[0].count} available rooms right now.`;
                } else {
                    const result = await this.pool.request().query(
                        "SELECT COUNT(*) as count FROM Rooms WHERE BlockName LIKE 'Boys%'"
                    );
                    return `🏠 Boys Block A has ${result.recordset[0].count} total rooms.`;
                }
            }
            
            if (message.includes('girls')) {
                if (message.includes('available')) {
                    const result = await this.pool.request().query(
                        "SELECT COUNT(*) as count FROM Rooms WHERE BlockName LIKE 'Girls%' AND Availability = 'Available'"
                    );
                    return `🏠 Girls Block B has ${result.recordset[0].count} available rooms right now.`;
                } else {
                    const result = await this.pool.request().query(
                        "SELECT COUNT(*) as count FROM Rooms WHERE BlockName LIKE 'Girls%'"
                    );
                    return `🏠 Girls Block B has ${result.recordset[0].count} total rooms.`;
                }
            }
            
            // General room count
            const boysResult = await this.pool.request().query(
                "SELECT COUNT(*) as count FROM Rooms WHERE BlockName LIKE 'Boys%'"
            );
            const girlsResult = await this.pool.request().query(
                "SELECT COUNT(*) as count FROM Rooms WHERE BlockName LIKE 'Girls%'"
            );
            
            return `🏠 Total rooms: Boys Block A has ${boysResult.recordset[0].count} rooms, Girls Block B has ${girlsResult.recordset[0].count} rooms.`;
            
        } catch (error) {
            console.error('Database query error:', error);
            return "🏠 I'm having trouble accessing the room data right now. Please try again.";
        }
    }
}

module.exports = ChatbotService;