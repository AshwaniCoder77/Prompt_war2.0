const admin = require('firebase-admin');

// Total Cleanup: Only use environment variables for Cloud Run
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    admin.initializeApp({ credential });
    console.log('✅ Firebase initialized via Environment Variable');
  } else {
    console.warn('⚠️ No FIREBASE_SERVICE_ACCOUNT variable found.');
  }
} catch (error) {
  console.error('❌ Firebase Init Error:', error.message);
}

const db = admin.apps.length > 0 ? admin.firestore() : null;
const auth = admin.apps.length > 0 ? admin.auth() : null;

module.exports = { admin, db, auth };
