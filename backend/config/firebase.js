const admin = require('firebase-admin');
try {
  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  } else {
    const serviceAccount = require('../serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
  }
  admin.initializeApp({ credential });
} catch (error) {
  console.error('Firebase initialization error:', error.message);
}


const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
