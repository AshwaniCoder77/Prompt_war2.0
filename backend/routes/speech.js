const express = require('express');
const router = express.Router();
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const multer = require('multer');

// Configure multer for memory storage (we don't want to store voice data on disk)
const upload = multer({ storage: multer.memoryStorage() });

// Helper to get Google Cloud credentials
const getGCloudConfig = () => {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return { credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) };
  }
  // Fallback to local file for dev (one level up from backend)
  return { keyFilename: '../speechServiceAccount.json' };
};


// Initialize Google Cloud Speech Client
const client = new speech.SpeechClient(getGCloudConfig());

const ttsClient = new textToSpeech.TextToSpeechClient(getGCloudConfig());


router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audioBytes = req.file.buffer.toString('base64');

    const audio = {
      content: audioBytes,
    };
    
    const { language } = req.body;
    const speechLangMap = {
      'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'te': 'te-IN', 
      'mr': 'mr-IN', 'ta': 'ta-IN', 'ur': 'ur-IN', 'gu': 'gu-IN',
      'kn': 'kn-IN', 'ml': 'ml-IN', 'pa': 'pa-IN', 'as': 'as-IN',
      'ne': 'ne-NP', 'or': 'or-IN'
    };
    const targetLangCode = speechLangMap[language] || 'en-IN';

    // We expect webm or wav from browser media recorder
    const config = {
      encoding: 'WEBM_OPUS',
      languageCode: targetLangCode,
      // Omitted sampleRateHertz to let Google Cloud auto-detect from the WEBM container
    };

    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
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
    const { text, language } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

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
