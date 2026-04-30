const express = require('express');
const router = express.Router();
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper to get Google Cloud credentials
const getGCloudConfig = () => {
  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const cleanJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON.trim();
      return { credentials: JSON.parse(cleanJson) };
    }
  } catch (err) {
    console.error('❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', err.message);
  }
  
  // Local fallback: Look in the backend folder
  const localKey = path.join(__dirname, '..', 'speechServiceAccount.json');
  if (fs.existsSync(localKey)) {
    return { keyFilename: localKey };
  }
  
  return null;
};

// Safely initialize clients
let client;
let ttsClient;

try {
  const config = getGCloudConfig();
  if (config) {
    client = new speech.SpeechClient(config);
    ttsClient = new textToSpeech.TextToSpeechClient(config);
    console.log('🎙️ Speech & TTS Clients initialized.');
  } else {
    console.warn('⚠️ Speech credentials not found. Speech features disabled.');
  }
} catch (e) {
  console.error('❌ Speech Init Error:', e.message);
}

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!client) return res.status(503).json({ error: 'Speech service not available' });
    if (!req.file) return res.status(400).json({ error: 'No audio file provided' });

    const audioBytes = req.file.buffer.toString('base64');
    const audio = { content: audioBytes };
    
    const { language } = req.body;
    const speechLangMap = {
      'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'te': 'te-IN', 
      'mr': 'mr-IN', 'ta': 'ta-IN', 'ur': 'ur-IN', 'gu': 'gu-IN',
      'kn': 'kn-IN', 'ml': 'ml-IN', 'pa': 'pa-IN', 'as': 'as-IN',
      'ne': 'ne-NP', 'or': 'or-IN'
    };
    const targetLangCode = speechLangMap[language] || 'en-IN';

    const config = {
      encoding: 'WEBM_OPUS',
      languageCode: targetLangCode,
    };

    const [response] = await client.recognize({ audio, config });
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    res.json({ text: transcription });
  } catch (error) {
    console.error('Speech-to-Text Error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

router.post('/tts', async (req, res) => {
  try {
    if (!ttsClient) return res.status(503).json({ error: 'TTS service not available' });
    const { text, language } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const speechLangMap = {
      'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'te': 'te-IN', 
      'mr': 'mr-IN', 'ta': 'ta-IN', 'ur': 'ur-IN', 'gu': 'gu-IN',
      'kn': 'kn-IN', 'ml': 'ml-IN', 'pa': 'pa-IN', 'as': 'as-IN',
      'ne': 'ne-NP', 'or': 'or-IN'
    };
    
    const targetLangCode = speechLangMap[language] || 'en-IN';

    const request = {
      input: { text: text },
      voice: { languageCode: targetLangCode },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.audioContent.length
    });
    res.send(response.audioContent);
  } catch (error) {
    console.error('Text-to-Speech Error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

module.exports = router;
