# Classroom Response System Setup Guide

This guide explains how to set up the real-time classroom response system for the annotation worksheets.

## Overview

The system allows students to submit their worksheet answers, and you can view aggregated statistics on a dashboard in real-time.

**Components:**
- **Worksheets** (25 HTML files) - Students complete these and submit via session code
- **Dashboard** (`dashboard.html`) - You display this on the big screen to show statistics
- **Firebase** - Backend that stores responses (free tier is sufficient)

## Quick Start (Demo Mode)

You can try the system without Firebase setup:

1. Open `dashboard.html` in your browser
2. Click "New Session" to generate a session code
3. Select any worksheet and click "Start Viewing"
4. The dashboard will show demo data and simulate real-time updates

## Full Setup with Firebase

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it (e.g., "annotation-worksheets")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In your Firebase project, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for classroom use)
4. Choose a location close to you
5. Click "Enable"

### Step 3: Get Configuration

1. Go to Project Settings (gear icon) → "General"
2. Scroll to "Your apps" and click the web icon `</>`
3. Register your app (any nickname)
4. Copy the `firebaseConfig` object

### Step 4: Update firebase-config.js

Edit `firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## In-Class Usage

### Before Class
1. Open `dashboard.html`
2. Click "New Session" to generate a 6-character code (e.g., `ABC123`)
3. Write the session code on the board or slide

### During Class
1. Share the worksheet URL with students (or have them open the file)
2. Students see a "Submit Answers" panel in the top-right corner
3. Students enter the session code and complete the worksheet
4. When ready, students click "Submit to Class"

### On the Big Screen
1. Select the worksheet you assigned from the dropdown
2. Click "Start Viewing"
3. Watch responses appear in real-time!
4. Click "Fullscreen" for presentation mode

## Dashboard Features

- **Answer Distribution**: Bar charts showing how students answered each question
- **Agreement Metrics**: Percentage agreement and Fleiss' Kappa scores
- **Text Responses**: Anonymized display of free-text answers
- **Real-time Updates**: Statistics update automatically as students submit
- **Color-coded Kappa**:
  - Green (≥0.8): Excellent agreement
  - Yellow (0.4-0.6): Moderate agreement
  - Red (<0.2): Poor agreement - great for discussion!

## Troubleshooting

**"Demo mode" appears on worksheets:**
- Firebase config not loaded. Check that `firebase-config.js` has valid credentials.

**No responses appearing:**
- Verify students are using the correct session code (case-insensitive)
- Check browser console for errors
- Ensure Firestore is in "test mode" or has appropriate security rules

**Dashboard shows "Disconnected":**
- Check internet connection
- Verify Firebase project is active
- Check browser console for Firebase errors

## Security Notes

- Test mode Firestore rules expire after 30 days
- For production use, set up proper security rules
- Session codes are simple and predictable - fine for classroom use, not for sensitive data

## Files Overview

```
Activities/
├── dashboard.html          # Teacher's dashboard
├── firebase-config.js      # Firebase configuration (edit this!)
├── classroom-submit.js     # Submission module (don't edit)
├── add-submission.js       # Setup script (already ran)
├── SETUP-GUIDE.md         # This file
└── *-worksheet.html       # 25 worksheet files
```

## Customization

### Adding New Worksheets
If you create new worksheets, run `node add-submission.js` to add the submission functionality.

### Modifying the Dashboard
Edit `dashboard.html` to customize colors, add features, or change the layout.

### Different Session per Worksheet
You can use different session codes for different worksheets if teaching multiple sections.
