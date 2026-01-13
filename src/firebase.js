import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBp9MNp02gpE19e_ryzOPzk1WXWngsrJ3E",
  authDomain: "fintech-expense-tracker.firebaseapp.com",
  projectId: "fintech-expense-tracker",
  storageBucket: "fintech-expense-tracker.firebasestorage.app",
  messagingSenderId: "85855563371",
  appId: "1:85855563371:web:29d848d165578cf9294b2e",
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
