'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true until Firebase resolves the session

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    /** Email + password sign-up */
    const signUp = async (name, email, password) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        // Attach display name immediately
        await updateProfile(credential.user, { displayName: name });
        setUser({ ...credential.user, displayName: name });
        return credential.user;
    };

    /** Email + password sign-in */
    const signIn = async (email, password) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return credential.user;
    };

    /** Google OAuth pop-up */
    const signInWithGoogle = async () => {
        const credential = await signInWithPopup(auth, googleProvider);
        return credential.user;
    };

    /** Sign out */
    const logOut = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

/** Hook — throws if used outside AuthProvider */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
