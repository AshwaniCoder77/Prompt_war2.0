const admin = require('firebase-admin');
try {
  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    admin.initializeApp({ credential });
    console.log('Firebase initialized via environment variable');
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT not found. Firebase features will be disabled.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message);
}



const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
