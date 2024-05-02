import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

console.log('hello from firebase!');

const firebaseConfig = {
  apiKey: 'AIzaSyBqiSXRNA-poTmiNgAfHxHVtEwqeH0-0ao',
  authDomain: 'daitove-gaikole.firebaseapp.com',
  projectId: 'daitove-gaikole',
  storageBucket: 'daitove-gaikole.appspot.com',
  messagingSenderId: '639033392258',
  appId: '1:639033392258:web:830aa3bed1bdbf5001089b'
};

const app = initializeApp(firebaseConfig);

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LeXKs0pAAAAADK3nU17YIn06S12f3SFqWul-w6X'),
  isTokenAutoRefreshEnabled: true
});

const auth = getAuth(app);
auth.languageCode = 'ka';

const firestore = getFirestore(app);

export { app, auth, firestore };
