// ==============================
// Firebase Imports
// ==============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==============================
// Firebase Configuration
// Replace with your own config
// ==============================

const firebaseConfig = {

apiKey: "AIzaSyAXh-QGBAslhXjf3FRwNIYA2hNmCzSCPhU",

authDomain: "login-f5c62.firebaseapp.com",

projectId: "login-f5c62",

storageBucket: "login-f5c62.firebasestorage.app",

messagingSenderId: "618951041850",

appId: "1:618951041850:web:06c744a7d988d86bd9a603",

measurementId: "G-TSDBHNZBTP"

};

// ==============================
// Initialize Firebase
// ==============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// ==============================
// Export Everything
// ==============================

export {

    auth,

    db,

    provider,

    signInWithPopup,

    signOut,

    onAuthStateChanged,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword

};

console.log("firebase.js loaded");