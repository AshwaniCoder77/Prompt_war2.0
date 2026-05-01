/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbfoCr3qy7QNTIQKPF9Pl5Amn-1wp_76A",
  authDomain: "prompt-war-492920.firebaseapp.com",
  projectId: "prompt-war-492920",
  storageBucket: "prompt-war-492920.firebasestorage.app",
  messagingSenderId: "666422970821",
  appId: "1:666422970821:web:f42560894b2ccaf33a63ac",
  measurementId: "G-7LP9BV8QFS"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
