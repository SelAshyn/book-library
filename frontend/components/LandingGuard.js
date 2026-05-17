'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps the landing page. If the user is already signed in,
 * redirects them to /dashboard so they can't view the landing page
 * while authenticated (unless they log out).
 */
export default function LandingGuard({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/dashboard');
        }
    }, [user, loading, router]);

    // While Firebase is resolving the session, render nothing to avoid flash
    if (loading) return null;

    // If user is logged in, render nothing while the redirect happens
    if (user) return null;

    return children;
}
