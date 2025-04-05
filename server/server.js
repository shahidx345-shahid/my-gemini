require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// CORS Configuration (Update this)
const corsOptions = {
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API Key Validation Endpoint (Updated)
app.get('/api/validate-key', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });  
    await model.generateContent('Test connection'); // Simple validation
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('API Key Validation Error:', error);
    res.status(401).json({ valid: false, error: 'Invalid API Key' });
  }
});

// API Key Validation Endpoint
app.get('/api/validate-key', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });  
    await model.generateContent("Test connection");
    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: error.message
    });
  }
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, modelName = "gemini-1.5-pro" } = req.body;
    
    // Input validation
    if (!Array.isArray(messages)) {
      return res.status(400).json({ 
        error: "Messages must be an array",
        example: {
          messages: [
            { role: "user", content: "Hello" },
            { role: "assistant", content: "Hi there!" }
          ]
        }
      });
    }

    // Convert messages to Gemini format
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      return res.status(400).json({ error: "No user message found" });
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(lastUserMessage.content);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      message: {
        role: "assistant",
        content: text
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    res.status(500).json({
      error: "AI service unavailable",
      details: error.message
    });
  }
});

// Start server
app.listen(5000, () => {
  console.log(`Server ready at http://localhost:5000`);
});