require('dotenv').config();
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper function to mask API keys in logs
const maskKey = (key) => key ? `${key.slice(0, 4)}...${key.slice(-4)}` : 'MISSING';



// Test Gemini API
async function testGemini() {
  console.log('\n=== Testing Gemini ===');
  console.log('Using Key:', maskKey(process.env.GEMINI_API_KEY));

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Updated model
    
    const result = await model.generateContent('Hello');
    const text = await result.response.text();
    
    console.log('✅ Success! Response:', text.trim());
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

// Run tests
(async () => {

  await testGemini();
})();