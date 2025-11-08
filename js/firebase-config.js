// Firebase Configuration for GiftJoy
// Replace these values with your own Firebase project credentials

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db, storage;
let isFirebaseInitialized = false;

function initializeFirebase() {
    try {
        if (typeof firebase !== 'undefined' && !isFirebaseInitialized) {
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();
            storage = firebase.storage();
            isFirebaseInitialized = true;
            console.log('✅ Firebase initialized successfully');
            return true;
        }
    } catch (error) {
        console.warn('⚠️ Firebase not available, using local storage:', error.message);
        return false;
    }
    return isFirebaseInitialized;
}

// Google Sign-In
async function signInWithGoogle() {
    if (!isFirebaseInitialized) {
        alert('Firebase is not configured. Using local storage instead.');
        return null;
    }
    
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        console.log('✅ Signed in as:', result.user.displayName);
        return result.user;
    } catch (error) {
        console.error('❌ Sign-in error:', error);
        alert('Sign-in failed: ' + error.message);
        return null;
    }
}

// Sign Out
async function signOut() {
    if (!isFirebaseInitialized) return;
    
    try {
        await auth.signOut();
        console.log('✅ Signed out successfully');
    } catch (error) {
        console.error('❌ Sign-out error:', error);
    }
}

// Save gift to Firestore
async function saveGiftToCloud(giftData) {
    if (!isFirebaseInitialized) {
        console.log('📦 Saving to local storage instead');
        return await window.giftStorage.saveGift(giftData);
    }
    
    try {
        const user = auth.currentUser;
        const giftRef = db.collection('gifts').doc(giftData.id);
        
        await giftRef.set({
            ...giftData,
            userId: user ? user.uid : 'anonymous',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Gift saved to cloud:', giftData.id);
        return giftData.id;
    } catch (error) {
        console.error('❌ Error saving to cloud:', error);
        // Fallback to local storage
        return await window.giftStorage.saveGift(giftData);
    }
}

// Load gift from Firestore
async function loadGiftFromCloud(giftId) {
    if (!isFirebaseInitialized) {
        console.log('📦 Loading from local storage instead');
        return await window.giftStorage.getGift(giftId);
    }
    
    try {
        const giftRef = db.collection('gifts').doc(giftId);
        const doc = await giftRef.get();
        
        if (doc.exists) {
            console.log('✅ Gift loaded from cloud:', giftId);
            return doc.data();
        } else {
            console.log('⚠️ Gift not found in cloud, checking local storage');
            return await window.giftStorage.getGift(giftId);
        }
    } catch (error) {
        console.error('❌ Error loading from cloud:', error);
        // Fallback to local storage
        return await window.giftStorage.getGift(giftId);
    }
}

// Upload image to Firebase Storage
async function uploadImageToCloud(imageData, giftId) {
    if (!isFirebaseInitialized) {
        return imageData; // Return base64 for local storage
    }
    
    try {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`gifts/${giftId}/image.jpg`);
        
        // Convert base64 to blob
        const response = await fetch(imageData);
        const blob = await response.blob();
        
        // Upload
        await imageRef.put(blob);
        
        // Get download URL
        const downloadURL = await imageRef.getDownloadURL();
        console.log('✅ Image uploaded to cloud');
        return downloadURL;
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        return imageData; // Fallback to base64
    }
}

// Upload audio to Firebase Storage
async function uploadAudioToCloud(audioData, giftId) {
    if (!isFirebaseInitialized) {
        return audioData;
    }
    
    try {
        const storageRef = storage.ref();
        const audioRef = storageRef.child(`gifts/${giftId}/audio.mp3`);
        
        const response = await fetch(audioData);
        const blob = await response.blob();
        
        await audioRef.put(blob);
        const downloadURL = await audioRef.getDownloadURL();
        console.log('✅ Audio uploaded to cloud');
        return downloadURL;
    } catch (error) {
        console.error('❌ Error uploading audio:', error);
        return audioData;
    }
}

// Auth state observer
function onAuthStateChanged(callback) {
    if (!isFirebaseInitialized) return;
    
    auth.onAuthStateChanged((user) => {
        callback(user);
    });
}

// Export functions
window.firebaseApp = {
    initialize: initializeFirebase,
    signInWithGoogle,
    signOut,
    saveGift: saveGiftToCloud,
    loadGift: loadGiftFromCloud,
    uploadImage: uploadImageToCloud,
    uploadAudio: uploadAudioToCloud,
    onAuthStateChanged,
    get currentUser() {
        return isFirebaseInitialized ? auth.currentUser : null;
    },
    get isInitialized() {
        return isFirebaseInitialized;
    }
};
