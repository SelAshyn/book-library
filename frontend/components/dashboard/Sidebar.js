'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    {
        href: '/dashboard',
        label: 'My Library',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
    },
    {
        href: '/dashboard/notes',
        label: 'Notes',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
    },
    {
        href: '/dashboard/vocabulary',
        label: 'Vocabulary',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
        ),
    },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logOut } = useAuth();
    const [signingOut, setSigningOut] = useState(false);

    const avatarUrl = user?.photoURL;
    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? '?';

    const handleSignOut = async () => {
        setSigningOut(true);
        await logOut();
        router.push('/');
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-gray-100 min-h-screen sticky top-0">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                    <Image src="/logo.png" alt="Novella" width={32} height={32} />
                    <div>
                        <p className="font-bold text-black leading-none" style={{ fontFamily: 'Outfit' }}>Novella</p>
                        <p className="text-[10px] text-gray-400" style={{ fontFamily: 'Manrope' }}>Stories That Stay Yours</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV.map(({ href, label, icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    active
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                style={{ fontFamily: 'Manrope' }}
                            >
                                <span className={active ? 'text-orange-500' : 'text-gray-400'}>{icon}</span>
                                {label}
                                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User card at bottom */}
                <div className="px-3 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 mb-2">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-orange-200" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {initials}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-black truncate leading-none" style={{ fontFamily: 'Manrope' }}>
                                {user?.displayName ?? 'Reader'}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5" style={{ fontFamily: 'Manrope' }}>
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium disabled:opacity-50"
                        style={{ fontFamily: 'Manrope' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {signingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                </div>
            </aside>

            {/* Mobile Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-3 py-2">
                <div className="flex justify-around items-center">
                    {NAV.map(({ href, label, icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-1 ${
                                    active
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-600'
                                }`}
                                style={{ fontFamily: 'Manrope' }}
                            >
                                <span className={active ? 'text-orange-500' : 'text-gray-400'}>{icon}</span>
                                <span className="hidden sm:inline">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
