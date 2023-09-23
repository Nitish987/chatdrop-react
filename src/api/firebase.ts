import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Messaging, getMessaging } from "firebase/messaging";
import { FirebaseStorage, getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

class FireApi {
  static analytics: Analytics;
  static auth: Auth;
  static firestore: Firestore;
  static storage: FirebaseStorage;
  static fcm: Messaging;

  static initialize() {
    const app = initializeApp(firebaseConfig);
    FireApi.analytics = getAnalytics(app);
    FireApi.auth = getAuth(app);
    FireApi.firestore = getFirestore(app);
    FireApi.fcm = getMessaging(app);
    FireApi.storage = getStorage(app);
  }
}

export default FireApi;