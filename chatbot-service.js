const OpenAI = require('openai');

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: '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'
});

class ChatbotService {
    constructor(pool) {
        this.pool = pool;
    }

    async getSystemContext() {
        try {
            const [rooms, users, bookings] = await Promise.all([
                this.pool.request().query('SELECT COUNT(*) as total, SUM(CASE WHEN Availability = \'Available\' THEN 1 ELSE 0 END) as available FROM Rooms'),
                this.pool.request().query('SELECT COUNT(*) as total FROM Users'),
                this.pool.request().query('SELECT COUNT(*) as total, SUM(CASE WHEN Status = \'Approved\' THEN 1 ELSE 0 END) as approved FROM Bookings')
            ]);

            return {
                totalRooms: rooms.recordset[0].total,
                availableRooms: rooms.recordset[0].available,
                totalStudents: users.recordset[0].total,
                totalBookings: bookings.recordset[0].total,
                approvedBookings: bookings.recordset[0].approved
            };
        } catch (error) {
            return null;
        }
    }

    async getRelevantData(message) {
        const lowerMessage = message.toLowerCase();
        let data = {};

        try {
            if (lowerMessage.includes('room') || lowerMessage.includes('available')) {
                const rooms = await this.pool.request().query(`
                    SELECT BlockName, COUNT(*) as Total, 
                    SUM(CASE WHEN Availability = 'Available' THEN 1 ELSE 0 END) as Available
                    FROM Rooms GROUP BY BlockName
                `);
                data.rooms = rooms.recordset;
            }

            if (lowerMessage.includes('booking') || lowerMessage.includes('status')) {
                const bookings = await this.pool.request().query(`
                    SELECT Status, COUNT(*) as Count FROM Bookings GROUP BY Status
                `);
                data.bookings = bookings.recordset;
            }

            if (lowerMessage.includes('block') || lowerMessage.includes('boys') || lowerMessage.includes('girls')) {
                const blocks = await this.pool.request().query(`
                    SELECT BlockName, RoomType, ACType, COUNT(*) as Count,
                    SUM(CASE WHEN Availability = 'Available' THEN 1 ELSE 0 END) as Available
                    FROM Rooms GROUP BY BlockName, RoomType, ACType
                `);
                data.blocks = blocks.recordset;
            }
        } catch (error) {
            console.error('Error fetching relevant data:', error);
        }

        return data;
    }

    async processMessage(message, userContext = null) {
        try {
            const systemStats = await this.getSystemContext();
            const relevantData = await this.getRelevantData(message);

            const systemPrompt = `You are Alex, a hostel assistant. Give VERY SHORT answers (1-2 sentences max).

CURRENT DATA:
- Available Rooms: ${systemStats?.availableRooms || 0}
- Total Bookings: ${systemStats?.totalBookings || 0}
- Approved: ${systemStats?.approvedBookings || 0}

${relevantData.rooms ? `ROOMS: ${JSON.stringify(relevantData.rooms)}` : ''}
${relevantData.bookings ? `BOOKINGS: ${JSON.stringify(relevantData.bookings)}` : ''}
${relevantData.blocks ? `BLOCKS: ${JSON.stringify(relevantData.blocks)}` : ''}

HOSTEL RULES:
- Boys: Boys Block A only
- Girls: Girls Block B only  
- Auto-approval if room available
- Admin login: admin@hostel.com / Admin123
- No payment required - rooms are FREE

Be EXTREMELY BRIEF. Use emojis. Answer ONLY about hostel rooms/booking/login.`;

            const response = await openai.chat.completions.create({
                model: 'openai/gpt-oss-20b',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 80,
                temperature: 0.7
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return this.getFallbackResponse(message);
        }
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('room') || lowerMessage.includes('available')) {
            return "🏠 Boys → Boys Block A, Girls → Girls Block B. Check Available Rooms tab.";
        }
        
        if (lowerMessage.includes('book') || lowerMessage.includes('booking')) {
            return "📋 Pick your room → Click 'Book This Room'. Auto-approved if available.";
        }
        
        if (lowerMessage.includes('login') || lowerMessage.includes('password')) {
            return "🔐 Admin: admin@hostel.com / Admin123. Students register first.";
        }
        
        if (lowerMessage.includes('admin')) {
            return "👨💼 admin@hostel.com / Admin123";
        }
        
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('payment')) {
            return "💰 All rooms are FREE! No payment required.";
        }
        
        return "👋 Ask about: rooms, booking, login, admin.";
    }
}

module.exports = ChatbotService;