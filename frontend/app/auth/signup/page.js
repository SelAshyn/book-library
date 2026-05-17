'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function SignUpPage() {
    const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

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

    const getPasswordStrength = (pwd) => {
        if (!pwd) return null;
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
        if (score === 2) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
        if (score === 3) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' };
        return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    };

    const strength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                setError('Please fill in all fields');
                return;
            }
            if (formData.name.trim().length < 2) {
                setError('Name must be at least 2 characters');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email');
                return;
            }
            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (!agreedToTerms) {
                setError('Please agree to the Terms of Service');
                return;
            }

            await signUp(formData.name.trim(), formData.email, formData.password);
            setSuccess('Account created! Redirecting...');
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
                        Start your reading<br />adventure today.
                    </h2>
                    <p className="text-orange-100 text-base leading-relaxed max-w-sm" style={{ fontFamily: 'Manrope' }}>
                        Join 50,000+ readers who track their books, build habits, and discover their next great story.
                    </p>
                    <ul className="mt-10 space-y-4">
                        {[
                            { icon: '📚', text: 'Organize your entire library' },
                            { icon: '🔥', text: 'Build daily reading streaks' },
                            { icon: '✨', text: 'AI-powered book recommendations' },
                            { icon: '📊', text: 'Track your reading analytics' },
                        ].map(({ icon, text }) => (
                            <li key={text} className="flex items-center gap-3">
                                <span className="text-xl">{icon}</span>
                                <span className="text-orange-100 text-sm font-medium" style={{ fontFamily: 'Manrope' }}>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="z-10 flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3 w-fit">
                    <span className="text-2xl">⭐</span>
                    <div>
                        <p className="text-white text-sm font-bold" style={{ fontFamily: 'Manrope' }}>Rated 4.9 / 5</p>
                        <p className="text-orange-200 text-xs" style={{ fontFamily: 'Manrope' }}>by 50K+ readers</p>
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 overflow-y-auto">
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
                <div className="flex lg:hidden items-center gap-3 mb-8">
                    <Image src="/logo.png" alt="Novella" width={36} height={36} />
                    <p className="text-xl font-bold text-black" style={{ fontFamily: 'Outfit' }}>Novella</p>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-black mb-1" style={{ fontFamily: 'Outfit' }}>Create your account</h1>
                        <p className="text-gray-500 text-sm" style={{ fontFamily: 'Manrope' }}>Free forever. No credit card required.</p>
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
                        {googleLoading ? 'Signing up...' : 'Continue with Google'}
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-gray-400 text-xs font-medium" style={{ fontFamily: 'Manrope' }}>or sign up with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>Full name</label>
                            <input
                                type="text" id="name" name="name"
                                value={formData.name} onChange={handleChange}
                                placeholder="Jane Doe" autoComplete="name" disabled={loading}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-orange-50/30 transition-all disabled:opacity-60"
                                style={{ fontFamily: 'Manrope' }}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>Email address</label>
                            <input
                                type="email" id="email" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="you@example.com" autoComplete="email" disabled={loading}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-orange-50/30 transition-all disabled:opacity-60"
                                style={{ fontFamily: 'Manrope' }}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} id="password" name="password"
                                    value={formData.password} onChange={handleChange}
                                    placeholder="••••••••" autoComplete="new-password" disabled={loading}
                                    className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-orange-50/30 transition-all disabled:opacity-60"
                                    style={{ fontFamily: 'Manrope' }}
                                />
                                <button type="button" onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                            {strength && (
                                <div className="mt-2">
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Manrope' }}>
                                        Password strength: <span className="font-semibold text-gray-700">{strength.label}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>Confirm password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword"
                                    value={formData.confirmPassword} onChange={handleChange}
                                    placeholder="••••••••" autoComplete="new-password" disabled={loading}
                                    className={`w-full px-4 py-3 pr-12 bg-white border-2 rounded-xl text-black placeholder-gray-400 focus:outline-none transition-all disabled:opacity-60 ${
                                        formData.confirmPassword && formData.password !== formData.confirmPassword
                                            ? 'border-red-400 focus:border-red-500'
                                            : formData.confirmPassword && formData.password === formData.confirmPassword
                                            ? 'border-green-400 focus:border-green-500'
                                            : 'border-gray-200 focus:border-orange-500 focus:bg-orange-50/30'
                                    }`}
                                    style={{ fontFamily: 'Manrope' }}
                                />
                                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                                    <EyeIcon open={showConfirm} />
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Manrope' }}>Passwords don't match</p>
                            )}
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5 shrink-0">
                                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} disabled={loading} className="sr-only" />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${agreedToTerms ? 'bg-orange-500 border-orange-500' : 'border-gray-300 group-hover:border-orange-400'}`}>
                                    {agreedToTerms && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-gray-600 leading-snug" style={{ fontFamily: 'Manrope' }}>
                                I agree to the{' '}
                                <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-semibold">Terms of Service</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold">Privacy Policy</Link>
                            </span>
                        </label>

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
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-8" style={{ fontFamily: 'Manrope' }}>
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function EyeIcon({ open }) {
    return open ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function getFirebaseError(code) {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        default:
            return 'An error occurred. Please try again.';
    }
}
