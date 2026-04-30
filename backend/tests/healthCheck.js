require('dotenv').config();
const { db } = require('../config/firebase');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const path = require('path');
const fs = require('fs');

async function runHealthCheck() {
  console.log('🔍 Starting System Health Check...\n');
  let overallSuccess = true;

  // 1. Check Firebase
  try {
    if (!db) throw new Error('Firebase Database not initialized');
    await db.collection('health_check').doc('status').set({ last_check: new Date() });
    console.log('✅ FIREBASE: Connection Successful');
  } catch (err) {
    console.error('❌ FIREBASE: Connection Failed -', err.message);
    overallSuccess = false;
  }

  // 2. Check Gemini AI
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemma-3-12b-it" });
    const result = await model.generateContent("Hello");
    if (result.response.text()) {
      console.log('✅ GEMINI AI: API Key is Valid & Active');
    }
  } catch (err) {
    console.error('❌ GEMINI AI: Failed -', err.message);
    overallSuccess = false;
  }

  // 3. Check Google Speech & TTS
  try {
    const localKey = path.join(__dirname, '..', 'speechServiceAccount.json');
    const config = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON 
      ? { credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) }
      : (fs.existsSync(localKey) ? { keyFilename: localKey } : null);

    if (!config) throw new Error('No credentials found for Speech/TTS');

    const speechClient = new speech.SpeechClient(config);
    const ttsClient = new textToSpeech.TextToSpeechClient(config);
    
    // Quick validation check
    await ttsClient.listVoices({});
    console.log('✅ GOOGLE SPEECH & TTS: Credentials Verified');
  } catch (err) {
    console.error('❌ GOOGLE SPEECH & TTS: Failed -', err.message);
    overallSuccess = false;
  }

  console.log('\n--------------------------------------');
  if (overallSuccess) {
    console.log('🏆 SYSTEM STATUS: ALL SERVICES HEALTHY');
  } else {
    console.log('⚠️ SYSTEM STATUS: SOME SERVICES NEED ATTENTION');
  }
  console.log('--------------------------------------');
}

runHealthCheck();
