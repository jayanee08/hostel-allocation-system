require('dotenv').config();
const sql = require('mssql');
const ChatbotService = require('./chatbot-service');

// Azure SQL Database configuration
const config = {
    user: 'hostel_admin',
    password: 'Nikhil&2005',
    server: 'hostel-server-2024.database.windows.net',
    database: 'hostel_management',
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

async function testChatbot() {
    let pool;
    
    try {
        console.log('🔄 Connecting to Azure SQL Database...');
        pool = await sql.connect(config);
        console.log('✅ Connected to Azure SQL Database');
        
        console.log('🤖 Initializing Alex Chatbot Service...');
        const chatbotService = new ChatbotService(pool);
        console.log('✅ Alex Chatbot Service initialized');
        
        // Test chatbot with sample questions
        console.log('\n🧪 Testing chatbot responses:');
        
        const testQuestions = [
            'How many rooms are available in boys block?',
            'How many rooms are available in girls block?',
            'What is the admin login?',
            'How to book a room?',
            'Are rooms free?'
        ];
        
        for (const question of testQuestions) {
            console.log(`\n❓ Question: ${question}`);
            const response = await chatbotService.processMessage(question);
            console.log(`🤖 Alex: ${response}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (pool) {
            await pool.close();
            console.log('\n🔒 Database connection closed');
        }
    }
}

testChatbot();