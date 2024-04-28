import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDybZE01cY3NhHDCXpvFK3ArKxMWd7tmt0',
  authDomain: 'vibeweave-3d57c.firebaseapp.com',
  projectId: 'vibeweave-3d57c',

  storageBucket: 'vibeweave-3d57c.appspot.com',
  messagingSenderId: '104651636212',
  appId: '1:104651636212:web:45f274db5fe50744c70da1'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
