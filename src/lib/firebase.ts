import { initializeApp } from 'firebase/app';
import { getAuth } from 'Firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyBqiSXRNA-poTmiNgAfHxHVtEwqeH0-0ao',
	authDomain: 'daitove-gaikole.firebaseapp.com',
	projectId: 'daitove-gaikole',
	storageBucket: 'daitove-gaikole.appspot.com',
	messagingSenderId: '639033392258',
	appId: '1:639033392258:web:830aa3bed1bdbf5001089b'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
