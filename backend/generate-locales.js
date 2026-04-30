const fs = require('fs').promises;
const path = require('path');

const enDict = {
  // Sidebar
  "nav.home": "Home",
  "nav.askAssistant": "Ask Assistant",
  "nav.electionProcess": "Election Process",
  "nav.timeline": "Timeline",
  "nav.pollingStation": "Polling Station",
  "nav.resources": "Resources",
  "nav.settings": "Settings",
  "nav.accessibilityMode": "Accessibility Mode",
  "nav.textSize": "Text Size:",
  "nav.contrast": "Contrast:",

  // Home Dashboard
  "home.greeting": "Hi, 👋",
  "home.title": "How can we help you today?",
  "home.subtitle": "Get instant answers about elections, processes, timelines and more.",
  "home.askBtn": "Ask Assistant",
  "home.typeOrSpeak": "You can type or speak your question 🎙️",
  "home.quickAccess": "Quick Access",
  
  "card.processTitle": "Election Process",
  "card.processDesc": "Understand the step-by-step election process.",
  "card.datesTitle": "Important Dates",
  "card.datesDesc": "Check deadlines and important timelines.",
  "card.pollingTitle": "Polling Station",
  "card.pollingDesc": "Find your polling booth and location.",
  "card.guidelinesTitle": "Voter Guidelines",
  "card.guidelinesDesc": "View documents and voter information.",
  
  "banner.nextElection": "Next Election Day",
  "banner.date": "15th May 2026",
  "banner.daysLeft": "12 Days Left",

  // Timeline
  "timeline.countdownTitle": "Countdown to Election Day",
  "timeline.countdownDate": "May 15, 2026",
  "timeline.journeyTitle": "Your Election Journey",
  "timeline.enableReminders": "Enable Reminders",
  "timeline.step1Title": "Voter Registration",
  "timeline.step1Date": "April 15, 2026",
  "timeline.step1Desc": "You have successfully registered on the National Voter Services Portal.",
  "timeline.step2Title": "Voter Slip Verification",
  "timeline.step2Date": "May 5, 2026",
  "timeline.step2Desc": "Please verify your digital voter slip before election day.",
  "timeline.step3Title": "Election Day",
  "timeline.step3Date": "May 15, 2026",
  "timeline.step3Desc": "Cast your vote at your designated polling station.",
  "timeline.step4Title": "Results Declaration",
  "timeline.step4Date": "June 4, 2026",
  "timeline.step4Desc": "Counting of votes and official results announcement.",
  "timeline.actionReq": "Action Required",

  // Settings
  "settings.title": "Settings & Preferences",
  "settings.appearance": "Appearance & Theme",
  "settings.darkTheme": "Dark Theme",
  "settings.darkThemeDesc": "Switch between Light and Dark interface",
  "settings.highContrast": "High Contrast Mode",
  "settings.highContrastDesc": "Increase contrast for better readability",
  "settings.aiVoice": "AI & Voice Assistant",
  "settings.explLevel": "Explanation Level",
  "settings.explLevelDesc": "Choose how detailed the AI answers should be",
  "settings.beginner": "Beginner",
  "settings.intermediate": "Intermediate",
  "settings.expert": "Expert",
  "settings.autoRead": "Auto-Read AI Responses",
  "settings.autoReadDesc": "Automatically read out the AI's answers via speech",
  "settings.privacy": "Privacy & Data",
  "settings.voiceData": "Voice Data Storage",
  "settings.voiceDataDesc": "We process audio strictly in-memory. No voice data is ever stored on disk.",
  // Resources
  "resources.title": "Voter Resources & Guidelines",
  "resources.officialPortals": "Official Portals",
  "resources.nvsp": "National Voters' Services Portal",
  "resources.eci": "Election Commission of India",
  "resources.downloadGuides": "Downloadable Guides",
  "resources.guide1": "First-Time Voter Checklist",
  "resources.guide2": "Polling Day Guidelines",
  "resources.faqTitle": "Frequently Asked Questions",
  "faq.q1": "What documents do I need to register?",
  "faq.a1": "You need a recent passport size photograph, age proof (birth certificate, passport, PAN card), and address proof (Aadhar, utility bill, passport).",
  "faq.q2": "How do I check if my name is on the voter list?",
  "faq.a2": "You can verify your name on the Electoral Roll through the official NVSP portal or by using the 'Search in Electoral Roll' feature.",
  "faq.q3": "Can I vote if I don't have my Voter ID card?",
  "faq.a3": "Yes, if your name is on the electoral roll, you can vote using alternate approved photo identity documents like Aadhar, Passport, PAN Card, or Driving License.",

  // Process List
  "process.title": "Your Election Journey",
  "process.desc": "Follow these steps to ensure you are ready to vote.",
  "process.progress": "Progress",
  "process.completed": "completed",
  "process.s1.title": "1. Check Eligibility",
  "process.s1.desc": "Ensure you are an Indian citizen and 18 years or older as of January 1st of the election year.",
  "process.s2.title": "2. Register to Vote",
  "process.s2.desc": "Fill out Form 6 online via the NVSP portal to get your Voter ID card (EPIC).",
  "process.s3.title": "3. Verify Name in Voter List",
  "process.s3.desc": "Check the Electoral Roll to ensure your name is correctly listed before election day.",
  "process.s4.title": "4. Find Polling Station",
  "process.s4.desc": "Locate your designated polling booth and note down the date and time of voting.",
  "process.s5.title": "5. Cast Your Vote",
  "process.s5.desc": "Carry your Voter ID or approved ID proof, press the EVM button for your candidate, and verify the VVPAT slip.",

  // Practice Simulation
  "nav.practice": "Let's Practice",
  "practice.disclaimer": "This is a practice simulation for learning purposes only. No real vote is recorded, stored, or submitted.",
  "practice.step": "Step",
  "practice.of": "of",
  "practice.next": "Next",
  "practice.back": "Back",
  "practice.confirm": "Confirm",
  "practice.change": "Change",
  "practice.reset": "Reset Simulation",
  "practice.explanationMode": "Explanation Mode",
  "practice.beginner": "Beginner",
  "practice.advanced": "Advanced",
  
  "practice.s1.title": "1. Eligibility Check",
  "practice.s1.beginner": "You must be 18+ and an Indian citizen.",
  "practice.s1.advanced": "As per the Constitution of India, citizens aged 18 and above are eligible to vote. You must be registered in the electoral roll of your constituency.",
  "practice.s1.q1": "Are you 18 years of age or older?",
  "practice.s1.q2": "Are you an Indian citizen?",

  "practice.s2.title": "2. Identity Verification",
  "practice.s2.beginner": "Choose what ID you brought today.",
  "practice.s2.advanced": "At the polling station, officials will verify your identity against the electoral roll using approved ID documents.",
  "practice.s2.prompt": "Select the ID you are carrying (Mock Selection):",
  "practice.s2.id1": "Voter ID (EPIC)",
  "practice.s2.id2": "Aadhaar Card",
  "practice.s2.id3": "PAN Card",
  "practice.s2.id4": "Driving License",

  "practice.s3.title": "3. Enter Polling Booth",
  "practice.s3.beginner": "The official checks your ID and marks your finger with ink.",
  "practice.s3.advanced": "The Polling Officer will check your name on the voter list, verify your ID, mark your left forefinger with indelible ink, and take your signature.",
  "practice.s3.msg": "Identity verified. Ink applied to finger. You may proceed to the voting compartment.",

  "practice.s4.title": "4. View Candidate List",
  "practice.s4.beginner": "This is what an EVM (Electronic Voting Machine) looks like.",
  "practice.s4.advanced": "Inside the voting compartment, you will find the Ballot Unit of the EVM. It displays candidate names and their election symbols.",
  "practice.s4.prompt": "Review the dummy candidate list below.",
  "practice.s4.c1": "Apple Party",
  "practice.s4.c2": "Banana Party",
  "practice.s4.c3": "Orange Party",
  "practice.s4.c4": "NOTA (None of the Above)",

  "practice.s5.title": "5. Select Candidate",
  "practice.s5.beginner": "Press the blue button next to your choice.",
  "practice.s5.advanced": "Press the blue button on the Ballot Unit against the name/symbol of the candidate of your choice. A red light will glow.",

  "practice.s6.title": "6. Confirmation",
  "practice.s6.beginner": "Did you pick the right one? In a real election, a paper slip prints out.",
  "practice.s6.advanced": "Review your choice. In a real scenario, the VVPAT machine will print a slip showing your candidate's serial number, name, and symbol for 7 seconds before dropping it into the sealed box.",
  "practice.s6.youSelected": "You selected:",

  "practice.s7.title": "7. Final Success",
  "practice.s7.beginner": "Great job! You learned how to vote.",
  "practice.s7.advanced": "Simulation Complete. Remember, your vote is secret and crucial for democracy.",
  "practice.s7.msg": "You have successfully completed the mock voting simulation!"
};

const languages = [
  'hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'ml', 'pa', 
  'as', 'brx', 'doi', 'ks', 'kok', 'mai', 'mni', 'ne', 'or', 'sa', 'sat', 'sd'
];

async function generateLocales() {
  const localesDir = path.join(__dirname, '..', 'frontend', 'src', 'locales');
  await fs.mkdir(localesDir, { recursive: true });

  // Save English dict first
  await fs.writeFile(path.join(localesDir, 'en.json'), JSON.stringify(enDict, null, 2));
  console.log('Saved en.json');

  for (const lang of languages) {
    const filePath = path.join(localesDir, `${lang}.json`);
    
    // Check if it already exists to skip
    try {
      await fs.access(filePath);
      console.log(`Skipping ${lang}, already exists.`);
      continue;
    } catch (e) {
      // Doesn't exist, proceed
    }

    console.log(`Translating to ${lang}...`);
    
    let translatedObj = {};
    let errorOccurred = false;

    // Translate each key individually using the free Google Translate API
    for (const [key, value] of Object.entries(enDict)) {
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(value)}`);
        const json = await res.json();
        
        // Google Translate returns an array of chunks, we need to join them
        let translatedText = '';
        if (json[0]) {
          json[0].forEach(chunk => {
            if (chunk[0]) translatedText += chunk[0];
          });
        }
        
        translatedObj[key] = translatedText || value;
      } catch (err) {
        console.error(`Failed to translate key ${key} to ${lang}:`, err.message);
        translatedObj[key] = value; // fallback to English
        errorOccurred = true;
      }
      // Small delay to prevent HTTP 429
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!errorOccurred || Object.keys(translatedObj).length > 0) {
      await fs.writeFile(filePath, JSON.stringify(translatedObj, null, 2));
      console.log(`Saved ${lang}.json`);
    }
  }
  
  console.log('Done generating all locales!');
}

generateLocales();
