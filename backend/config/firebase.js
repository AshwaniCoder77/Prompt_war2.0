const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../../serviceAccountKey.json');

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Cloud Mode
    const credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    admin.initializeApp({ credential });
    console.log('✅ Firebase initialized via Environment Variable');
  } else if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    // Local Mode
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🏠 Firebase initialized via Local File');
  } else {
    console.warn('⚠️ No Firebase credentials found (ENV or File).');
  }
} catch (error) {
  console.error('❌ Firebase Init Error:', error.message);
}

const db = admin.apps.length > 0 ? admin.firestore() : null;
const auth = admin.apps.length > 0 ? admin.auth() : null;

module.exports = { admin, db, auth };
