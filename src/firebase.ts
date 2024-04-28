import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC6spFl1fxjADY-Ii4JTFoRUSmRGWRXBuY',
  authDomain: 'vibeweave.firebaseapp.com',
  projectId: 'vibeweave',
  storageBucket: 'vibeweave.appspot.com',
  messagingSenderId: '1088254463059',
  appId: '1:1088254463059:web:8ba14e6bd566432ad08aa6',
  measurementId: 'G-8YY2E4QD1D'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
