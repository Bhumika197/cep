import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC_KjR0sXAXm97uFGsy0LObdNvfkSPZx2Q",
  authDomain: "smart-gaushala.firebaseapp.com",
  projectId: "smart-gaushala",
  storageBucket: "smart-gaushala.firebasestorage.app",
  messagingSenderId: "418539506019",
  appId: "1:418539506019:web:df49c5943e96356119eb56",
  measurementId: "G-P3HHZ4JM83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Phone authentication functions
let recaptchaVerifier;

export const setUpRecaptcha = () => {
  recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => {
      console.log('reCAPTCHA solved');
    }
  }, auth);
};

export const signInWithPhone = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Phone auth error:', error);
    throw error;
  }
};

export { recaptchaVerifier };
export default app;
