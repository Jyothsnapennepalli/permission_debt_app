// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log("firebase.js loaded");

const firebaseConfig = {
  apiKey: "AIzaSyAXcWMR8VqIiaPjMfNyAi6jFhwzdWuy4-E",
  authDomain: "permission-debt-audit.firebaseapp.com",
  projectId: "permission-debt-audit",
  storageBucket: "permission-debt-audit.appspot.com",
  messagingSenderId: "628893900486",
  appId: "1:628893900486:web:66dbad7ed584fd550d81c7"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase app initialized");

// 🔥 THESE TWO LINES ARE CRITICAL
export const auth = getAuth(app);
export const db = getFirestore(app);

