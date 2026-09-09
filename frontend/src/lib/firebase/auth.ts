import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getIdTokenResult,
} from 'firebase/auth';
import { auth } from './config';

export type UserRole = 'operator' | 'reviewer' | 'admin';

export interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  displayName?: string;
}

export const loginWithEmail = async (email: string, pass: string): Promise<FirebaseUser> => {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return credential.user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getUserRole = async (user: FirebaseUser): Promise<UserRole> => {
  const tokenResult = await getIdTokenResult(user, true);
  const role = (tokenResult.claims.role as UserRole) || 'operator';
  return role;
};

export const subscribeAuthChanges = (
  callback: (user: AppUser | null) => void
) => {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }

    try {
      const role = await getUserRole(fbUser);
      callback({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Operator',
        role,
      });
    } catch {
      callback({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: 'Operator',
        role: 'operator',
      });
    }
  });
};
