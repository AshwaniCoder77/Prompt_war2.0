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
  // 1. Highest Priority: Environment Variable (Safe for Google Secret Manager)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      const cleanJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON.trim();
      console.log('🔐 Using credentials from environment variable.');
      return { credentials: JSON.parse(cleanJson) };
    } catch (err) {
      console.error('❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', err.message);
    }
  }

  // 2. Second Priority: Explicit Key Filename (Safe for local testing)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    // GHOST-BUSTER: Ignore the placeholder path from system env
    if (!keyPath.includes('path\\to') && fs.existsSync(keyPath)) {
      console.log('📂 Using credentials from GOOGLE_APPLICATION_CREDENTIALS file path.');
      return { keyFilename: keyPath };
    } else {
      console.warn('⚠️ Ignoring placeholder or invalid path in GOOGLE_APPLICATION_CREDENTIALS:', keyPath);
    }
  }

  // 3. Fallback: Local file in backend folder
  const localKey = path.join(__dirname, '..', 'speechServiceAccount.json');
  if (fs.existsSync(localKey)) {
    console.log('🏠 Using local speech service account key.');
    return { keyFilename: localKey };
  }

  // 4. Final Fallback: Application Default Credentials (ADC) for Cloud Run service account
  console.log('☁️ Falling back to Application Default Credentials (ADC).');
  return {};
};

// Safely initialize clients
let client;
let ttsClient;

const initSpeechClients = () => {
  try {
    const config = getGCloudConfig();
    client = new speech.SpeechClient(config);
    ttsClient = new textToSpeech.TextToSpeechClient(config);
    console.log('🎙️ Speech & TTS Clients initialized.');
  } catch (e) {
    console.error('❌ Speech Init Error:', e.message);
  }
};

initSpeechClients();

/**
 * @route POST /api/speech/transcribe
 * @description Transcribes audio data (WebM Opus) to text using Google Cloud Speech-to-Text.
 * @param {file} audio - Multi-part file containing the audio data.
 * @param {string} language - Source language code (e.g., 'en', 'hi').
 * @returns {Object} 200 - JSON with transcribed 'text'.
 * @returns {Object} 503 - Service unavailable if Speech client is not initialized.
 * @returns {Object} 500 - Transcription error details.
 */
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
    res.status(500).json({
      error: 'Failed to transcribe audio',
      details: error.message,
      code: error.code
    });
  }
});

/**
 * @route POST /api/speech/tts
 * @description Converts text into synthesized speech (MP3) using Google Cloud Text-to-Speech.
 * @param {string} req.body.text - The text to convert to speech.
 * @param {string} [req.body.language='en'] - Target language code.
 * @returns {Object} 200 - JSON with 'audioContent' (Base64) and 'contentType'.
 * @returns {Object} 503 - Service unavailable if TTS client is not initialized.
 * @returns {Object} 500 - Synthesis error details.
 */
router.post('/tts', async (req, res) => {
  try {
    if (!ttsClient) {
      console.error('❌ TTS Client is not initialized!');
      return res.status(503).json({ error: 'TTS service not available' });
    }

    const { text, language } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const nativeEngineMap = {
      'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'te': 'te-IN', 
      'mr': 'mr-IN', 'ta': 'ta-IN', 'ur': 'ur-IN', 'gu': 'gu-IN',
      'kn': 'kn-IN', 'ml': 'ml-IN', 'pa': 'pa-IN',
      'as': 'bn-IN', 'ne': 'ne-NP', 'or': 'bn-IN', 'sa': 'hi-IN',
      'kok': 'mr-IN', 'mai': 'hi-IN', 'doi': 'hi-IN', 'brx': 'hi-IN',
      'ks': 'ur-IN', 'mni': 'bn-IN', 'sat': 'bn-IN', 'sd': 'hi-IN'
    };
    
    const targetLangCode = nativeEngineMap[language] || 'en-IN';

    // Only use Wavenet if supported, else use Standard
    const supportedWavenet = ['hi-IN', 'en-IN', 'bn-IN', 'te-IN', 'mr-IN', 'ta-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN'];
    
    let voiceName;
    if (targetLangCode === 'hi-IN') {
      voiceName = 'hi-IN-Neural2-A';
    } else if (targetLangCode === 'en-IN') {
      voiceName = 'en-IN-Neural2-A'; 
    } else if (supportedWavenet.includes(targetLangCode)) {
      voiceName = `${targetLangCode}-Wavenet-A`;
    } else {
      voiceName = `${targetLangCode}-Standard-A`;
    }

    const request = {
      input: { text: text },
      voice: { 
        languageCode: targetLangCode,
        ssmlGender: 'FEMALE',
        name: voiceName
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 0.88,
        pitch: -1.5 
      },
    };

    console.log(`🔥 [TRUE-NATIVE] Attempting: ${voiceName}`);
    
    let response;
    try {
      [response] = await ttsClient.synthesizeSpeech(request);
    } catch (e) {
      console.warn(`⚠️ [FALLBACK] ${voiceName} failed. Retrying with Standard Native.`);
      // SELF-HEALING: Retry with basic standard voice if premium fails
      const fallbackRequest = {
        input: { text: text },
        voice: { languageCode: targetLangCode, ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' }
      };
      [response] = await ttsClient.synthesizeSpeech(fallbackRequest);
    }

    const audioBase64 = response.audioContent.toString('base64');
    
    res.json({ 
      audioContent: audioBase64,
      contentType: 'audio/mpeg',
      source: 'google-cloud'
    });
  } catch (error) {
    console.error('❌ [CRITICAL-TTS-ERROR]:', error);
    res.status(500).json({ 
      error: 'Failed to synthesize speech', 
      details: error.message,
      stack: error.stack, 
      code: error.code
    });
  }
});

module.exports = router;