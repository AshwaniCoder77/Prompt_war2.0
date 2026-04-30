const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Robust path finding for local dev
const rootDir = path.join(__dirname, '..', '..');
const SERVICE_ACCOUNT_PATH = path.join(rootDir, 'serviceAccountKey.json');

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Cloud Mode
    const credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    admin.initializeApp({ credential });
    console.log('✅ Firebase initialized via Environment Variable');
  } else if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    // Local Mode
    const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🏠 Firebase initialized via Local File:', SERVICE_ACCOUNT_PATH);
  } else {
    console.warn('⚠️ No Firebase credentials found. Checked:', SERVICE_ACCOUNT_PATH);
  }
} catch (error) {
  console.error('❌ Firebase Init Error:', error.message);
}

const db = admin.apps.length > 0 ? admin.firestore() : null;
const auth = admin.apps.length > 0 ? admin.auth() : null;

module.exports = { admin, db, auth };
