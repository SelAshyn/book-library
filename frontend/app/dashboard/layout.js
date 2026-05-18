'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../../components/dashboard/Sidebar';
import DashboardTopbar from '../../components/dashboard/Topbar';
import FeedbackButton from '../../components/dashboard/FeedbackButton';

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace('/auth/signin');
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Manrope' }}>Loading your library...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar — desktop */}
            <DashboardSidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardTopbar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-28 lg:pb-8">
                    {children}
                </main>
                <FeedbackButton />
            </div>
        </div>
    );
}
