const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Mock Knowledge Base for Indian Elections (Emulating RAG Context)
const electionKnowledgeBase = `
Indian Election Process Knowledge Base:
1. Eligibility: Must be an Indian citizen, 18 years or older as of January 1st of the election year.
2. Registration: Use Form 6 on the Voter Portal (voters.eci.gov.in) to register. Required documents include age proof (Birth Certificate, Aadhaar, PAN) and address proof (Aadhaar, Passport, Utility Bill).
3. Verification: Voters can check their name in the Electoral Roll online using their EPIC (Voter ID) number.
4. Polling: Polling stations are designated based on the voter's address. Voting usually happens from 7 AM to 6 PM.
5. Voting Machine: India uses EVMs (Electronic Voting Machines) along with VVPATs (Voter Verifiable Paper Audit Trail) for transparency.
6. Identity Proof: To vote, one must carry their EPIC card or one of the 11 alternative photo ID documents specified by the Election Commission of India.
`;

router.post('/', async (req, res) => {
  try {
    const { message, mode, language } = req.body; // mode: 'beginner', 'intermediate', 'expert'

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemma-3-12b-it" });

    let styleInstruction = "";
    if (mode === 'beginner') {
      styleInstruction = "Use very simple language, short sentences, and explain concepts like you are talking to a 10-year-old or a first-time voter.";
    } else if (mode === 'expert') {
      styleInstruction = "Use formal, constitutional terminology and precise language. Provide detailed legal context where applicable.";
    } else {
      styleInstruction = "Use clear, everyday language suitable for the general public.";
    }

    const targetLang = language || 'en';
    const languageNames = {
      'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi',
      'ta': 'Tamil', 'ur': 'Urdu', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam', 'pa': 'Punjabi',
      'as': 'Assamese', 'brx': 'Bodo', 'doi': 'Dogri', 'ks': 'Kashmiri', 'kok': 'Konkani', 'mai': 'Maithili',
      'mni': 'Manipuri', 'ne': 'Nepali', 'or': 'Odia', 'sa': 'Sanskrit', 'sat': 'Santali', 'sd': 'Sindhi'
    };
    const targetLangFull = languageNames[targetLang] || 'English';

    const prompt = `
You are the "Election Assistant", a secure and helpful AI designed to help users with the Indian election process.
CRITICAL RULES:
1. You MUST ONLY answer questions related to elections, voting, voter registration, and polling in India.
2. If the user asks about ANY other topic (e.g., programming, cooking, general knowledge), politely decline to answer and remind them you are an Election Assistant.
3. Use the following verified Knowledge Base to answer. Do NOT hallucinate information outside of this.
4. ${styleInstruction}
5. You MUST respond ONLY in **${targetLangFull}**. Do NOT include translations to other languages. If the user asks a question in a different language, you must still answer it in **${targetLangFull}**.


Knowledge Base:
${electionKnowledgeBase}

User Question: ${message}
Answer:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Chat error:', error);
    
    // Check if it's an API Key error
    if (error.status === 400 && error.message && error.message.includes("API key not valid")) {
       return res.status(400).json({ reply: "⚠️ System Error: The Gemini API Key in your backend .env file is invalid. Please update it to use the AI Assistant." });
    }

    res.status(500).json({ reply: "Sorry, I am having trouble connecting right now." });
  }
});

module.exports = router;
