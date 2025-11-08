# Firebase Setup Guide for GiftJoy

## Overview
GiftJoy now supports cloud storage using Firebase! This allows gifts to be saved online and accessed from anywhere.

## Features Added
✅ **Cloud Storage** - Gifts saved to Firebase Firestore  
✅ **Google Sign-In** - User authentication  
✅ **File Storage** - Images and audio stored in Firebase Storage  
✅ **Color Customization** - Choose gift box colors  
✅ **Audio Messages** - Add music or voice messages  
✅ **Stickers/Emojis** - Decorate gifts with emojis  
✅ **Quest/Puzzle Mode** - Optional interactive puzzles  

## Firebase Setup Instructions

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `GiftJoy` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click on **Sign-in method** tab
4. Enable **Google** sign-in provider
5. Add your email as authorized domain
6. Click "Save"

### Step 3: Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (for development)
4. Choose a location (closest to your users)
5. Click "Enable"

### Step 4: Set up Storage
1. Go to **Storage**
2. Click "Get started"
3. Start in **test mode**
4. Click "Done"

### Step 5: Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app name: `GiftJoy`
5. Copy the `firebaseConfig` object

### Step 6: Update firebase-config.js
1. Open `js/firebase-config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### Step 7: Configure Firestore Security Rules
In Firebase Console > Firestore Database > Rules, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read gifts
    match /gifts/{giftId} {
      allow read: if true;
      allow write: if request.auth != null || true;
    }
  }
}
```

### Step 8: Configure Storage Security Rules
In Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gifts/{giftId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null || true;
    }
  }
}
```

## Testing

### Without Firebase (Local Mode)
- App works with IndexedDB (browser storage)
- No sign-in required
- Gifts stored locally only

### With Firebase (Cloud Mode)
1. Open the app
2. Click "Sign In" button
3. Sign in with Google
4. Create a gift
5. Gift is saved to cloud
6. Share link works from any device

## Features Usage

### Color Picker
- Select from 6 gradient colors for gift box
- Default: Pink gradient

### Audio Upload
- Click "Add Music/Audio"
- Select MP3, WAV, or other audio file
- Max size: 5MB
- Plays when gift is revealed

### Stickers
- Click on emojis to select (max 5)
- Appear on gift card
- Click again to remove

### Quest Mode
- Check "Add Fun Quest/Puzzle"
- Recipient solves puzzle before seeing gift
- 3 puzzle types: Math, Word, Memory

## Troubleshooting

### Firebase not loading
- Check browser console for errors
- Verify Firebase SDK scripts are loaded
- Check firebaseConfig values

### Sign-in not working
- Verify Google Auth is enabled in Firebase
- Check authorized domains include your domain
- Clear browser cache

### Gifts not saving
- Check Firestore rules allow writes
- Verify internet connection
- Check browser console for errors

### Images/Audio not uploading
- Check file size limits (2MB images, 5MB audio)
- Verify Storage rules allow writes
- Check internet connection

## Local Development
App works without Firebase! Just:
1. Open `index.html` in browser
2. Create gifts (saved locally)
3. Share links work on same device

## Deployment
To deploy with Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Support
For issues, check:
- Browser console (F12)
- Firebase Console logs
- Network tab for failed requests

---

**Note**: Firebase free tier includes:
- 1GB storage
- 10GB/month bandwidth
- 50K reads/day
- 20K writes/day

Perfect for personal use! 🎁
