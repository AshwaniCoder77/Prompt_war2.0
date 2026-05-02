import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Replace with your actual Firebase project configuration
// You can find this in Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyCbfoCr3qy7QNTIQKPF9Pl5Amn-1wp_76A",
  authDomain: "prompt-war-492920.firebaseapp.com",
  projectId: "prompt-war-492920",
  storageBucket: "prompt-war-492920.firebasestorage.app",
  messagingSenderId: "666422970821",
  appId: "1:666422970821:web:f42560894b2ccaf33a63ac",
  measurementId: "G-7LP9BV8QFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = (registration) => {
  return getToken(messaging, { 
    vapidKey: 'BBDd8aLa-SHyZFphOeQGN0DCSoeZArZaiHgP7ogsEa4YOsfLQFBS2VS3fQt3wHdaoeqqsTts_BBN0ndWNzfUNUI',
    serviceWorkerRegistration: registration
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log('Current token for client: ', currentToken);
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = (callback) =>
  onMessage(messaging, (payload) => {
    console.log("Payload received: ", payload);
    callback(payload);
  });

