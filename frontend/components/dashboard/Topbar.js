'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function DashboardTopbar() {
    const { user, logOut } = useAuth();
    const router = useRouter();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

    const avatarUrl = user?.photoURL;
    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? '?';

    const handleSignOut = async () => {
        await logOut();
        router.push('/');
    };

    // Fetch reviews when profile menu opens
    useEffect(() => {
        if (profileMenuOpen) {
            const fetchReviews = async () => {
                try {
                    const res = await api.get('/reviews/');
                    const recentReviews = res.data
                        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                        .slice(0, 3);
                    setReviews(recentReviews);
                } catch (err) {
                    console.error('Error fetching reviews:', err);
                }
            };
            fetchReviews();
        }
    }, [profileMenuOpen]);

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left — logo */}
            <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Novella" width={26} height={26} />
                <span className="font-bold text-black" style={{ fontFamily: 'Outfit' }}>Novella</span>
            </div>

            {/* Right — greeting + avatar with dropdown */}
            <div className="flex items-center gap-3 relative">
                <p className="hidden sm:block text-sm text-gray-500" style={{ fontFamily: 'Manrope' }}>
                    Hey, <span className="font-semibold text-black">{user?.displayName?.split(' ')[0] ?? 'Reader'}</span> 👋
                </p>
                <button
                    onClick={() => setProfileMenuOpen((v) => !v)}
                    className="relative"
                    aria-label="Profile menu"
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-orange-200 cursor-pointer hover:border-orange-300 transition-all" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                            {initials}
                        </div>
                    )}
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                    <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-72 max-h-96 overflow-y-auto">
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                                        {initials}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-black truncate" style={{ fontFamily: 'Manrope' }}>
                                        {user?.displayName ?? 'Reader'}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate" style={{ fontFamily: 'Manrope' }}>
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide" style={{ fontFamily: 'Manrope' }}>
                                    📚 My Reviews
                                </p>
                                <a href="/dashboard/reviews" onClick={() => setProfileMenuOpen(false)}
                                    className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-all">
                                    View all
                                </a>
                            </div>
                            {reviews.length > 0 ? (
                                <div className="space-y-2">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="text-xs font-semibold text-black line-clamp-1" style={{ fontFamily: 'Manrope' }}>
                                                    {review.book?.title || 'Unknown Book'}
                                                </h4>
                                                <span className="text-sm">
                                                    {'⭐'.repeat(review.rating)}
                                                </span>
                                            </div>
                                            {review.body && (
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-1" style={{ fontFamily: 'Manrope' }}>
                                                    "{review.body}"
                                                </p>
                                            )}
                                            {review.recommended !== null && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                                        review.recommended
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {review.recommended ? '👍 Recommended' : '👎 Not recommended'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500" style={{ fontFamily: 'Manrope' }}>
                                    You haven't written any reviews yet. Mark books as completed to start reviewing!
                                </p>
                            )}
                        </div>

                        {/* Settings and Other Options */}
                        <div className="px-4 py-2 border-b border-gray-100">
                            <button
                                onClick={() => {
                                    router.push('/settings');
                                    setProfileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-all font-medium"
                                style={{ fontFamily: 'Manrope' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>
                        </div>

                        {/* Sign Out Button */}
                        <div className="px-4 py-2">
                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setProfileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
                                style={{ fontFamily: 'Manrope' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
