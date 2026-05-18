'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const FORMSPREE_URL = `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`;

const RATINGS = [
    { value: 5, emoji: '😍', label: 'Love it' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 2, emoji: '😕', label: 'Not great' },
    { value: 1, emoji: '😞', label: 'Poor' },
];

export default function FeedbackButton() {
    const { user } = useAuth();
    const [open, setOpen]       = useState(false);
    const [visible, setVisible] = useState(false);
    const [rating, setRating]   = useState(null);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent]       = useState(false);
    const [error, setError]     = useState('');
    const textareaRef = useRef(null);

    const openModal = () => {
        setOpen(true);
        requestAnimationFrame(() => setVisible(true));
        setTimeout(() => textareaRef.current?.focus(), 150);
    };

    const closeModal = () => {
        setVisible(false);
        setTimeout(() => {
            setOpen(false);
            setSent(false);
            setRating(null);
            setMessage('');
            setError('');
        }, 200);
    };

    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') closeModal(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) { setError('Please write a message.'); return; }

        setSending(true);
        setError('');

        try {
            const res = await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name:    user?.displayName ?? 'Anonymous',
                    email:   user?.email ?? 'No email',
                    rating:  rating ? `${rating}/5 — ${RATINGS.find(r => r.value === rating)?.label}` : 'Not rated',
                    message,
                    _subject: `Novella Feedback${rating ? ` — ${rating}★` : ''}`,
                }),
            });

            if (res.ok) {
                setSent(true);
            } else {
                setError('Failed to send. Please try again.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes fbIn  { from{opacity:0;transform:scale(0.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
                @keyframes fbOut { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(0.93) translateY(10px)} }
                @keyframes bdIn  { from{opacity:0} to{opacity:1} }
                @keyframes bdOut { from{opacity:1} to{opacity:0} }
                .fb-in  { animation: fbIn  0.22s cubic-bezier(0.34,1.56,0.64,1) forwards }
                .fb-out { animation: fbOut 0.18s ease forwards }
                .bd-in  { animation: bdIn  0.18s ease forwards }
                .bd-out { animation: bdOut 0.18s ease forwards }
            `}</style>

            {/* Floating button */}
            <button
                onClick={openModal}
                className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl transition-all active:scale-95"
                style={{ fontFamily: 'Share Tech', letterSpacing: '0.03em' }}
                aria-label="Send feedback"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Feedback
            </button>

            {/* Modal */}
            {open && (
                <>
                    <div
                        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm ${visible ? 'bd-in' : 'bd-out'}`}
                        onClick={closeModal}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div className={`w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto ${visible ? 'fb-in' : 'fb-out'}`}>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-lg font-bold text-black" style={{ fontFamily: 'Outfit' }}>Share your feedback</h2>
                                    <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Manrope' }}>Help us make Novella better</p>
                                </div>
                                <button onClick={closeModal}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {sent ? (
                                /* Success state */
                                <div className="px-6 py-10 flex flex-col items-center text-center">
                                    <span className="text-5xl mb-4">🎉</span>
                                    <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'Outfit' }}>Thank you!</h3>
                                    <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Manrope' }}>
                                        Your feedback has been sent. We really appreciate it.
                                    </p>
                                    <button onClick={closeModal}
                                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                                        style={{ fontFamily: 'Share Tech' }}>
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm" style={{ fontFamily: 'Manrope' }}>
                                            <span>⚠️</span><span>{error}</span>
                                        </div>
                                    )}

                                    {/* Rating */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Manrope' }}>
                                            How's your experience?
                                        </label>
                                        <div className="flex gap-2 justify-between">
                                            {RATINGS.map((r) => (
                                                <button
                                                    key={r.value}
                                                    type="button"
                                                    onClick={() => setRating(r.value)}
                                                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all ${
                                                        rating === r.value
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                                >
                                                    <span className="text-xl">{r.emoji}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium" style={{ fontFamily: 'Manrope' }}>{r.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>
                                            Your message *
                                        </label>
                                        <textarea
                                            ref={textareaRef}
                                            value={message}
                                            onChange={(e) => { setMessage(e.target.value); setError(''); }}
                                            placeholder="Tell us what you think, what's missing, or what you love..."
                                            rows={4}
                                            className="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 transition-all resize-none"
                                            style={{ fontFamily: 'Manrope' }}
                                        />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-1">
                                        <p className="text-xs text-gray-400" style={{ fontFamily: 'Manrope' }}>
                                            Sending as <span className="font-semibold text-gray-600">{user?.displayName ?? 'you'}</span>
                                        </p>
                                        <button type="submit" disabled={sending}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:opacity-50 active:scale-[0.98]"
                                            style={{ fontFamily: 'Share Tech', letterSpacing: '0.03em' }}>
                                            {sending ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : 'Send Feedback'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
