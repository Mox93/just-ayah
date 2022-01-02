import { initializeApp } from "firebase/app";
import {
  getAuth,
  useDeviceLanguage as fromDeviceLanguage,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SEND_ID,
  appId: process.env.REACT_APP_APP_ID,
});

const auth = getAuth(app);
const db = getFirestore(app);

fromDeviceLanguage(auth);

export { auth, db };
