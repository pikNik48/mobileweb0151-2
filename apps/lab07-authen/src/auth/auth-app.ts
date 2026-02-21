import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import type {
  IAuthService,
  AuthUser,
  EmailPasswordCredentials,
  PhoneCredentials
} from "./auth-interface";

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? null,
    phoneNumber: u.phoneNumber ?? null,
    displayName: u.displayName ?? null,
    photoUrl: u.photoUrl ?? null
  };
}

export class FirebaseAppAuthService implements IAuthService {
  async getCurrentUser() {
    const { user } = await FirebaseAuthentication.getCurrentUser();
    return user ? mapUser(user) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const { user } =
      await FirebaseAuthentication.signInWithEmailAndPassword(creds);
    return mapUser(user);
  }

  async loginWithGoogle() {
    const { user } = await FirebaseAuthentication.signInWithGoogle();
    return mapUser(user);
  }

 async startPhoneLogin(
  creds: PhoneCredentials
): Promise<{ verificationId: string }> {
    return new Promise(async (resolve, reject) => {
      const offSent = await FirebaseAuthentication.addListener(
        "phoneCodeSent",
        (e) => {
          offSent.remove();
          resolve({ verificationId: e.verificationId });
        }
      );

      const offFailed = await FirebaseAuthentication.addListener(
        "phoneVerificationFailed",
        (e) => {
          offFailed.remove();
          reject(new Error(e.message ?? "Failed"));
        }
      );

      await FirebaseAuthentication.signInWithPhoneNumber({
        phoneNumber: creds.phoneNumberE164
      });
    });
  }

  async confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }) {
    const { user } =
      await FirebaseAuthentication.confirmVerificationCode(payload);
    return mapUser(user);
  }

  async logout() {
    await FirebaseAuthentication.signOut();
  }
}