'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function SignInPage() {
    const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Already signed in → go to dashboard
    useEffect(() => {
        if (!authLoading && user) router.replace('/dashboard');
    }, [user, authLoading, router]);

    if (authLoading || user) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!formData.email || !formData.password) {
                setError('Please fill in all fields');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email');
                return;
            }

            await signIn(formData.email, formData.password);
            setSuccess('Signed in! Redirecting...');
            router.push('/dashboard');
        } catch (err) {
            setError(getFirebaseError(err.code));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            await signInWithGoogle();
            router.push('/dashboard');
        } catch (err) {
            setError(getFirebaseError(err.code));
            console.error(err);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 p-12 relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full" />
                <div className="absolute top-1/3 -right-16 w-56 h-56 bg-white/10 rounded-full" />
                <div className="absolute -bottom-16 left-1/4 w-64 h-64 bg-white/10 rounded-full" />

                <div className="flex items-center gap-3 z-10">
                    <Image src="/logo.png" alt="Novella" width={40} height={40} />
                    <div>
                        <p className="text-white text-xl font-bold leading-none" style={{ fontFamily: 'Outfit' }}>Novella</p>
                        <p className="text-orange-100 text-[11px]" style={{ fontFamily: 'Manrope' }}>Stories That Stay Yours</p>
                    </div>
                </div>

                <div className="z-10">
                    <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Outfit' }}>
                        Your reading<br />journey awaits.
                    </h2>
                    <p className="text-orange-100 text-base leading-relaxed max-w-sm" style={{ fontFamily: 'Manrope' }}>
                        Track every book, build streaks, and discover your next great read — all in one place.
                    </p>
                    <div className="flex gap-8 mt-10">
                        {[
                            { icon: '📚', value: '10K+', label: 'Books tracked' },
                            { icon: '🔥', value: '365+', label: 'Day streaks' },
                            { icon: '👥', value: '50K+', label: 'Readers' },
                        ].map(({ icon, value, label }) => (
                            <div key={label}>
                                <p className="text-2xl mb-1">{icon}</p>
                                <p className="text-white font-bold text-lg leading-none" style={{ fontFamily: 'Outfit' }}>{value}</p>
                                <p className="text-orange-200 text-xs mt-0.5" style={{ fontFamily: 'Manrope' }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <blockquote className="z-10 border-l-2 border-white/40 pl-4">
                    <p className="text-orange-100 text-sm italic leading-relaxed" style={{ fontFamily: 'Manrope' }}>
                        "A reader lives a thousand lives before he dies."
                    </p>
                    <cite className="text-white/60 text-xs mt-1 block not-italic">— George R.R. Martin</cite>
                </blockquote>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12">
                {/* Back to home */}
                <div className="w-full max-w-md mb-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors group" style={{ fontFamily: 'Manrope' }}>
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to home
                    </Link>
                </div>

                {/* Mobile logo */}
                <div className="flex lg:hidden items-center gap-3 mb-10">
                    <Image src="/logo.png" alt="Novella" width={36} height={36} />
                    <p className="text-xl font-bold text-black" style={{ fontFamily: 'Outfit' }}>Novella</p>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-black mb-1" style={{ fontFamily: 'Outfit' }}>Welcome back</h1>
                        <p className="text-gray-500 text-sm" style={{ fontFamily: 'Manrope' }}>Sign in to continue to your library</p>
                    </div>

                    {error && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm" style={{ fontFamily: 'Manrope' }}>
                            <span className="mt-0.5 shrink-0">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm" style={{ fontFamily: 'Manrope' }}>
                            <span className="mt-0.5 shrink-0">✅</span>
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Google */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-black font-semibold hover:border-orange-400 hover:bg-orange-50 transition-all mb-6 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'Manrope' }}
                    >
                        {googleLoading ? (
                            <svg className="animate-spin w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-gray-400 text-xs font-medium" style={{ fontFamily: 'Manrope' }}>or sign in with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={loading}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-orange-50/30 transition-all disabled:opacity-60"
                                style={{ fontFamily: 'Manrope' }}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700" style={{ fontFamily: 'Manrope' }}>
                                    Password
                                </label>
                                <Link href="/auth/forgot-password" className="text-xs text-orange-600 hover:text-orange-700 font-semibold transition-colors" style={{ fontFamily: 'Manrope' }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-orange-50/30 transition-all disabled:opacity-60"
                                    style={{ fontFamily: 'Manrope' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
                            style={{ fontFamily: 'Share Tech', fontSize: '1rem', letterSpacing: '0.03em' }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-8" style={{ fontFamily: 'Manrope' }}>
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

/** Map Firebase error codes to friendly messages */
function getFirebaseError(code) {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        default:
            return 'An error occurred. Please try again.';
    }
}
