import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier
} from "firebase/auth";

import type {
  AuthUser,
  IAuthService,
  EmailPasswordCredentials,
  PhoneCredentials
} from "./auth-interface";

const firebaseConfig = {
  apiKey: "AIzaSyDqoSMSlrsgTvFjKvzvXIeFanKvhG5c4-I",
  authDomain: "lab06-expense-0151.firebaseapp.com",
  projectId: "lab06-expense-0151",
  storageBucket: "lab06-expense-0151.firebasestorage.app",
  messagingSenderId: "987703365037",
  appId: "1:987703365037:web:6d92d97cd4954f7e1a6524",
  measurementId: "G-58CHBE3C89"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
    phoneNumber: u.phoneNumber
  };
}

let confirmationResult: ConfirmationResult | null = null;

export class FirebaseWebAuthService implements IAuthService {
  async getCurrentUser() {
    return auth.currentUser ? mapUser(auth.currentUser) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(
      auth,
      creds.email,
      creds.password
    );
    return mapUser(r.user);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(auth, provider);
    return mapUser(r.user);
  }

async startPhoneLogin(
  creds: PhoneCredentials
): Promise<{ verificationId: string }> {

  const verifier = new RecaptchaVerifier(
    auth,                       // auth มาก่อน
    "recaptcha-container",      // container id
    {
      size: "invisible"
    }
  );

  await verifier.render(); // สำคัญ

  confirmationResult = await signInWithPhoneNumber(
    auth,
    creds.phoneNumberE164,
    verifier
  );

  return { verificationId: confirmationResult.verificationId };
}
  async confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }) {
    if (!confirmationResult) throw new Error("No confirmation");

    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }

  async logout() {
    await auth.signOut();
  }
}