const cron = require('node-cron');
const { admin, db } = require('../config/firebase');

const checkAndSendNotifications = async () => {
  if (!db) return;

  const now = new Date();
  
  try {
    console.log(`🔍 Checking Firestore for reminders at ${now.toISOString()}`);
    
    // 1. Fetch due reminders (enabled and not yet sent)
    const remindersSnapshot = await db.collection('reminders')
      .where('enabled', '==', true)
      .where('sent', '==', false)
      .get();

    console.log(`📝 Found ${remindersSnapshot.size} total pending reminders in Firestore.`);

    if (remindersSnapshot.empty) return;

    // 2. Fetch all registered FCM tokens
    const tokensSnapshot = await db.collection('fcm_tokens').get();
    const tokens = tokensSnapshot.docs.map(doc => doc.id);

    console.log(`📱 Found ${tokens.length} registered device tokens.`);

    if (tokens.length === 0) {
      console.warn('⚠️ No registered FCM tokens found in collection "fcm_tokens".');
      return;
    }

    for (const doc of remindersSnapshot.docs) {
      const reminder = doc.data();
      const reminderTime = new Date(reminder.time);
      
      console.log(`⏰ Reminder "${reminder.title}" scheduled for ${reminderTime.toISOString()}. Current time: ${now.toISOString()}`);

      // Only send if the scheduled time has arrived
      if (reminderTime <= now) {
        console.log(`🚀 TRIGGERING notification for: ${reminder.title}`);
        
        const message = {
          notification: {
            title: reminder.title,
            body: `Election Assistant: ${reminder.title}`,
          },
          tokens: tokens, 
        };

        try {
          const response = await admin.messaging().sendEachForMulticast(message);
          console.log(`✅ Result: ${response.successCount} sent, ${response.failureCount} failed.`);
          
          // Mark as sent in Firestore
          await doc.ref.update({ sent: true, sentAt: new Date().toISOString() });
          
        } catch (error) {
          console.error(`❌ FCM Send Error for reminder ${doc.id}:`, error);
        }
      } else {
        console.log(`⏳ Reminder "${reminder.title}" is still in the future. Skipping.`);
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
