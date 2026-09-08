import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setDemoUser: (role: UserRole) => void;
  canAccess: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo profiles for rapid testing
const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  super_admin: {
    uid: 'demo-superadmin-001',
    email: 'superadmin@eidgah.org.bd',
    displayName: 'আলহাজ্ব কাজী রফিকুল ইসলাম',
    role: 'super_admin',
    phone: '01711-123456',
    designation: 'প্রধান নির্বাহী ও সুপার অ্যাডমিন',
    status: 'active'
  },
  admin: {
    uid: 'demo-admin-002',
    email: 'admin@eidgah.org.bd',
    displayName: 'ইঞ্জিনিয়ার কামরুল হাসান',
    role: 'admin',
    phone: '01715-567890',
    designation: 'ম্যানেজিং অ্যাডমিনিস্ট্রেটর',
    status: 'active'
  },
  committee: {
    uid: 'demo-committee-003',
    email: 'committee@eidgah.org.bd',
    displayName: 'মাওলানা মুজাম্মেল হক কাসেমী',
    role: 'committee',
    phone: '01713-987654',
    designation: 'সম্মানিত কমিটি সদস্য',
    status: 'active'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ems_demo_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const isSuperUser =
          user.email === 'saiyadul123.bd@gmail.com' ||
          user.email === 'superadmin@eidgah.org.bd';

        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (isSuperUser && data.role !== 'super_admin') {
              const updatedProfile: UserProfile = { ...data, role: 'super_admin' };
              try {
                await setDoc(docRef, { role: 'super_admin' }, { merge: true });
              } catch (e) {
                console.warn('Failed to persist super_admin role update:', e);
              }
              setUserProfile(updatedProfile);
            } else {
              setUserProfile(data);
            }
          } else {
            // Check if Super Admin already pre-assigned a profile by email
            const userEmail = (user.email || '').toLowerCase().trim();
            let assignedRole: UserRole = isSuperUser ? 'super_admin' : 'committee';
            let assignedName = user.displayName || user.email?.split('@')[0] || 'User';
            let assignedDesignation = '';
            let assignedPhone = '';

            try {
              if (userEmail) {
                const q = query(collection(db, 'users'), where('email', '==', userEmail));
                const qSnap = await getDocs(q);
                if (!qSnap.empty) {
                  const preData = qSnap.docs[0].data() as UserProfile;
                  if (preData.role) assignedRole = isSuperUser ? 'super_admin' : preData.role;
                  if (preData.displayName) assignedName = preData.displayName;
                  if (preData.designation) assignedDesignation = preData.designation;
                  if (preData.phone) assignedPhone = preData.phone;
                }
              }
            } catch (queryErr) {
              console.warn('Could not query pre-assigned user by email:', queryErr);
            }

            // Also check local storage cached users
            try {
              const rawLocal = localStorage.getItem('ems_users');
              if (rawLocal && userEmail) {
                const localUsers: UserProfile[] = JSON.parse(rawLocal);
                const matched = localUsers.find(u => u.email && u.email.toLowerCase().trim() === userEmail);
                if (matched) {
                  if (matched.role) assignedRole = isSuperUser ? 'super_admin' : matched.role;
                  if (matched.displayName) assignedName = matched.displayName;
                  if (matched.designation) assignedDesignation = matched.designation;
                  if (matched.phone) assignedPhone = matched.phone;
                }
              }
            } catch (localErr) {
              // ignore
            }

            // New user profile
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: assignedName,
              role: assignedRole,
              designation: assignedDesignation,
              phone: assignedPhone,
              status: 'active',
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(docRef, newProfile);
            } catch (e) {
              console.warn('Failed to persist new profile:', e);
            }
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('Could not fetch user profile from Firestore:', err);
          if (isSuperUser) {
            setUserProfile({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'সুপার অ্যাডমিন',
              role: 'super_admin',
              status: 'active',
              createdAt: new Date().toISOString()
            });
          }
        }
      } else {
        // If not logged in via Firebase Auth, keep demo profile if active
        const saved = localStorage.getItem('ems_demo_profile');
        if (!saved) {
          setUserProfile(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    localStorage.removeItem('ems_demo_profile');
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signInWithGoogle = async () => {
    localStorage.removeItem('ems_demo_profile');
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signUp = async (email: string, pass: string, name: string, role: UserRole = 'committee') => {
    localStorage.removeItem('ems_demo_profile');
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: name,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', user.uid), profile);
    setUserProfile(profile);
  };

  const logout = async () => {
    localStorage.removeItem('ems_demo_profile');
    setUserProfile(null);
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const setDemoUser = (role: UserRole) => {
    const profile = DEMO_PROFILES[role];
    setUserProfile(profile);
    localStorage.setItem('ems_demo_profile', JSON.stringify(profile));
  };

  const canAccess = (requiredRole: UserRole): boolean => {
    const currentRole = userProfile?.role;
    if (!currentRole) return false;
    if (currentRole === 'super_admin') return true;
    if (requiredRole === 'admin') return currentRole === 'admin';
    if (requiredRole === 'committee') return currentRole === 'admin' || currentRole === 'committee';
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        userRole: userProfile?.role || null,
        isLoading,
        signIn,
        signInWithGoogle,
        signUp,
        logout,
        resetPassword,
        setDemoUser,
        canAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
