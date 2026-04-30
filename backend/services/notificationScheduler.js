const cron = require('node-cron');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/reminders.json');
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../serviceAccountKey.json');

if (admin.apps.length === 0 && fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  try {
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized successfully.');
  } catch (err) {
    console.error('❌ Firebase Init Error:', err.message);
  }
} else if (admin.apps.length > 0) {
  console.log('🔄 Firebase Admin already initialized, reusing existing app.');
} else {
  console.warn('⚠️ Firebase Service Account not found at:', SERVICE_ACCOUNT_PATH);
}

const checkAndSendNotifications = async () => {
  if (!fs.existsSync(DB_PATH)) return;

  const db = JSON.parse(fs.readFileSync(DB_PATH));
  const now = new Date();
  
  const dueReminders = db.reminders.filter(r => {
    const reminderTime = new Date(r.time);
    // Check if reminder is enabled and time is within this minute
    return r.enabled && 
           reminderTime <= now && 
           !r.sent; // Ensure we don't send multiple times
  });

  if (dueReminders.length === 0) {
    // console.log('No due reminders found.');
    return;
  }

  console.log(`Found ${dueReminders.length} due reminders.`);

  for (const reminder of dueReminders) {
    console.log(`Attempting to send notification for: ${reminder.title}`);
    
    const message = {
      notification: {
        title: reminder.title,
        body: `Time for your election reminder: ${reminder.title}`,
      },
      tokens: db.tokens, 
    };

    if (admin.apps.length > 0 && db.tokens.length > 0) {
      try {
        console.log(`Sending to ${db.tokens.length} tokens...`);
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`✅ ${response.successCount} messages were sent successfully. Failures: ${response.failureCount}`);
        if (response.failureCount > 0) {
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              console.error(`❌ Failure for token ${db.tokens[idx].substring(0, 10)}...: ${resp.error.message}`);
            }
          });
        }
      } catch (error) {
        console.error('❌ FCM Send Error:', error);
      }
    } else {
      console.warn('⚠️ Cannot send: No Firebase app initialized or no tokens registered.');
    }


    // Mark as sent
    reminder.sent = true;
  }

  // Update DB
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

// Run every minute
cron.schedule('* * * * *', () => {
  console.log('Checking reminders...');
  checkAndSendNotifications();
});
