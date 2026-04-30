const cron = require('node-cron');
const { admin } = require('../config/firebase');

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/reminders.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ reminders: [], tokens: [] }));
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
