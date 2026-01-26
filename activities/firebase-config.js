// Firebase Configuration for Classroom Response System
//
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing one)
// 3. Go to Project Settings > General > Your apps > Add app > Web
// 4. Register your app and copy the config values below
// 5. Go to Firestore Database > Create database > Start in test mode
// 6. Replace the placeholder values below with your actual Firebase config

const firebaseConfig = {
  apiKey: "AIzaSyC6pc0s-NDcvnrLWlqueHmGXk8X7jvqTFY",
  authDomain: "cosi230.firebaseapp.com",
  projectId: "cosi230",
  storageBucket: "cosi230.firebasestorage.app",
  messagingSenderId: "1015096324204",
  appId: "1:1015096324204:web:708b25c669c113d8d86849",
  measurementId: "G-3CH66FZET7"
};

// Export for use in worksheets and dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}
