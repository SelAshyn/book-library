'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, loading, logOut } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLinkClick = () => setIsOpen(false);

    const handleSignOut = async () => {
        setDropdownOpen(false);
        await logOut();
        router.push('/');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Avatar: photo from Google, or initials fallback
    const avatarUrl = user?.photoURL;
    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? '?';

    return (
        <div className='relative'>
            <nav className="fixed left-0 right-0 mx-auto top-0 z-50 w-full bg-white/40 backdrop-blur-md shadow-md">
                <div className="flex justify-between items-center text-black p-4 md:px-8 md:py-3 max-w-7xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img src="/logo.png" className="w-8 h-8" alt="Novella Logo" />
                        <div className="ml-6">
                            <h1 className="text-xl font-bold" style={{ fontFamily: 'Outfit' }}>Novella</h1>
                            <p className="text-[10px]" style={{ fontFamily: 'Manrope' }}>Stories That Stay Yours</p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="ml-6 hidden md:block">
                        <ul className="flex space-x-6 text-[16px] font-bold tracking-wide" style={{ fontFamily: 'Share Tech' }}>
                            <li className="px-2 py-1 rounded-lg hover:bg-orange-100 hover:text-orange-600 cursor-pointer transition-all">
                                <a href="#features" className="block">Features</a>
                            </li>
                            <li className="px-2 py-1 rounded-lg hover:bg-orange-100 hover:text-orange-600 cursor-pointer transition-all">
                                <a href="#analytics" className="block">Analytics</a>
                            </li>
                            <li className="px-2 py-1 rounded-lg hover:bg-orange-100 hover:text-orange-600 cursor-pointer transition-all">
                                <a href="#testimonials" className="block">Testimonials</a>
                            </li>
                            <li className="px-2 py-1 rounded-lg hover:bg-orange-100 hover:text-orange-600 cursor-pointer transition-all">
                                <a href="#faq" className="block">FAQ</a>
                            </li>
                        </ul>
                    </div>

                    {/* Desktop — auth buttons or user menu */}
                    <div className="hidden md:flex gap-3 items-center">
                        {loading ? (
                            // Skeleton while Firebase resolves session
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        ) : user ? (
                            // Logged-in: avatar + dropdown
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen((v) => !v)}
                                    className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                                    aria-label="User menu"
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={user.displayName ?? 'User'} className="w-9 h-9 rounded-full object-cover border-2 border-orange-400" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold border-2 border-orange-400">
                                            {initials}
                                        </div>
                                    )}
                                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-black truncate" style={{ fontFamily: 'Manrope' }}>
                                                {user.displayName ?? 'Reader'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Manrope' }}>{user.email}</p>
                                        </div>
                                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                            style={{ fontFamily: 'Manrope' }}>
                                            <span>📚</span> My Library
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            style={{ fontFamily: 'Manrope' }}>
                                            <span>🚪</span> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Logged-out: login + get started
                            <>
                                <Link href="/auth/signin">
                                    <button className="border-2 border-gray-400 text-black px-6 py-2 rounded-lg hover:border-orange-600 hover:text-orange-600 transition-all font-semibold" style={{ fontFamily: 'Share Tech' }}>Login</button>
                                </Link>
                                <Link href="/auth/signup">
                                    <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-md hover:shadow-lg" style={{ fontFamily: 'Share Tech' }}>Get Started</button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button className="md:hidden flex flex-col gap-1.5" onClick={() => setIsOpen(!isOpen)}>
                        <span className={`w-6 h-0.5 bg-black transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-black transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-black transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="flex flex-col p-4 space-y-1" style={{ fontFamily: 'Share Tech' }}>
                        <li className="py-3 px-3 rounded-lg hover:bg-orange-50 cursor-pointer hover:text-orange-600 transition-all font-semibold">
                            <a href="#features" onClick={handleLinkClick}>✨ Features</a>
                        </li>
                        <li className="py-3 px-3 rounded-lg hover:bg-orange-50 cursor-pointer hover:text-orange-600 transition-all font-semibold">
                            <a href="#analytics" onClick={handleLinkClick}>📊 Analytics</a>
                        </li>
                        <li className="py-3 px-3 rounded-lg hover:bg-orange-50 cursor-pointer hover:text-orange-600 transition-all font-semibold">
                            <a href="#testimonials" onClick={handleLinkClick}>⭐ Testimonials</a>
                        </li>
                        <li className="py-3 px-3 rounded-lg hover:bg-orange-50 cursor-pointer hover:text-orange-600 transition-all font-semibold">
                            <a href="#faq" onClick={handleLinkClick}>❓ FAQ</a>
                        </li>
                    </ul>

                    <div className="flex flex-col gap-3 p-4 border-t border-gray-100">
                        {user ? (
                            <>
                                {/* Mobile user info */}
                                <div className="flex items-center gap-3 px-1 py-2">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="User" className="w-9 h-9 rounded-full object-cover border-2 border-orange-400" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                                            {initials}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-black" style={{ fontFamily: 'Manrope' }}>{user.displayName ?? 'Reader'}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[180px]" style={{ fontFamily: 'Manrope' }}>{user.email}</p>
                                    </div>
                                </div>
                                <Link href="/dashboard" onClick={handleLinkClick}>
                                    <button className="border-2 border-gray-300 text-black px-4 py-2.5 rounded-lg w-full hover:bg-orange-50 hover:border-orange-400 transition-all font-semibold" style={{ fontFamily: 'Share Tech' }}>
                                        📚 My Library
                                    </button>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="border-2 border-red-200 text-red-600 px-4 py-2.5 rounded-lg w-full hover:bg-red-50 transition-all font-semibold"
                                    style={{ fontFamily: 'Share Tech' }}>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/signin" onClick={handleLinkClick}>
                                    <button className="border-2 border-gray-300 text-black px-4 py-2.5 rounded-lg w-full hover:bg-gray-100 hover:border-orange-600 transition-all font-semibold">Log In</button>
                                </Link>
                                <Link href="/auth/signup" onClick={handleLinkClick}>
                                    <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 rounded-lg w-full hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-md hover:shadow-lg">Get Started</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
