const cron = require('node-cron');
const { admin, db } = require('../config/firebase');

const checkAndSendNotifications = async () => {
  if (!db) return;

  const now = new Date();
  
  try {
    // 1. Fetch due reminders (enabled and not yet sent)
    const remindersSnapshot = await db.collection('reminders')
      .where('enabled', '==', true)
      .where('sent', '==', false)
      .get();

    if (remindersSnapshot.empty) return;

    // 2. Fetch all registered FCM tokens
    const tokensSnapshot = await db.collection('fcm_tokens').get();
    const tokens = tokensSnapshot.docs.map(doc => doc.id);

    if (tokens.length === 0) {
      console.warn('⚠️ Found due reminders but no registered FCM tokens.');
      return;
    }

    console.log(`🔔 Found ${remindersSnapshot.size} due reminders. Sending to ${tokens.length} tokens.`);

    for (const doc of remindersSnapshot.docs) {
      const reminder = doc.data();
      const reminderTime = new Date(reminder.time);

      // Only send if the scheduled time has arrived
      if (reminderTime <= now) {
        console.log(`🚀 Attempting to send notification for: ${reminder.title}`);
        
        const message = {
          notification: {
            title: reminder.title,
            body: `Time for your election reminder: ${reminder.title}`,
          },
          tokens: tokens, 
        };

        try {
          const response = await admin.messaging().sendEachForMulticast(message);
          console.log(`✅ ${response.successCount} messages were sent successfully. Failures: ${response.failureCount}`);
          
          // Mark as sent in Firestore
          await doc.ref.update({ sent: true, sentAt: new Date().toISOString() });
          
        } catch (error) {
          console.error(`❌ FCM Send Error for reminder ${doc.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Scheduler Error:', error);
  }
};

// Run every minute (except in test environment)
if (process.env.NODE_ENV !== 'test' && process.env.K_SERVICE === undefined) {
  cron.schedule('* * * * *', () => {
    console.log('🕒 Checking Firestore reminders (Local Cron)...');
    checkAndSendNotifications();
  });
}

module.exports = { checkAndSendNotifications };
