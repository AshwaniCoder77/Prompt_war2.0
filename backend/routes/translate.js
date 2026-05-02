const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');

let genAI;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenerativeAI:", e.message);
}


const TRANSLATIONS_DIR = path.join(__dirname, '..', 'translations');

// Ensure translations directory exists
const ensureTranslationsDir = async () => {
  try {
    await fs.mkdir(TRANSLATIONS_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating translations directory:', err);
  }
};
ensureTranslationsDir();

/**
 * @route POST /api/translate
 * @description Translates a JSON object of text strings into a target language using Gemini AI with file caching.
 * @param {Object} req.body.texts - Key-value pairs of strings to translate.
 * @param {string} req.body.targetLanguage - Target language code (e.g., 'hi', 'bn').
 * @returns {Object} 200 - JSON with 'translated' object containing translated strings.
 * @returns {Object} 400 - Error if texts or targetLanguage is missing.
 * @returns {Object} 500 - Translation or parsing error.
 */
router.post('/', async (req, res) => {
  try {
    const { texts, targetLanguage } = req.body;
    
    if (!texts || typeof texts !== 'object') {
      return res.status(400).json({ error: 'Texts object is required' });
    }
    if (!targetLanguage) {
      return res.status(400).json({ error: 'targetLanguage is required' });
    }
    if (targetLanguage === 'en') {
      return res.json({ translated: texts }); // return as is
    }

    const cacheFilePath = path.join(TRANSLATIONS_DIR, `${targetLanguage}.json`);

    // Check if translation exists in file cache
    try {
      const cachedData = await fs.readFile(cacheFilePath, 'utf8');
      const parsedCache = JSON.parse(cachedData);
      return res.json({ translated: parsedCache });
    } catch (err) {
      // File doesn't exist or isn't valid, proceed to Gemini
      if (err.code !== 'ENOENT') {
        console.error(`Error reading cache for ${targetLanguage}:`, err);
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a highly accurate translation engine. 
Translate the following JSON object's VALUES into the language code/name: ${targetLanguage}.
Keep the EXACT same JSON keys. Do not translate the keys.
Return ONLY valid JSON. Do not include markdown code blocks.

JSON to translate:
${JSON.stringify(texts, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    
    // Clean up potential markdown formatting from Gemini
    let cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let translatedObj;
    try {
      translatedObj = JSON.parse(cleanedJson);
      
      // Save successful translation to file cache
      await fs.writeFile(cacheFilePath, JSON.stringify(translatedObj, null, 2), 'utf8');
      
    } catch (parseError) {
      console.error("Failed to parse translated JSON:", cleanedJson);
      return res.status(500).json({ error: 'Translation response was malformed.' });
    }

    res.json({ translated: translatedObj });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate' });
  }
});

module.exports = router;
