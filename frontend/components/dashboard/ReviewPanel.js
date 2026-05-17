'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function ReviewPanel({ book, onClose, onSave }) {
    const [rating, setRating] = useState(book?.reviews?.[0]?.rating || 0);
    const [review, setReview] = useState(book?.reviews?.[0]?.body || '');
    const [recommended, setRecommended] = useState(book?.reviews?.[0]?.recommended || null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSaving(true);
        try {
            // Check if review already exists
            const existingReview = book?.reviews?.[0];

            if (existingReview) {
                // Update existing review
                await api.patch(`/reviews/${existingReview.id}/`, {
                    rating,
                    body: review,
                    recommended,
                });
            } else {
                // Create new review
                await api.post('/reviews/', {
                    book_id: book.id,
                    rating,
                    body: review,
                    recommended,
                });
            }

            // Update book status to COMPLETED
            await api.patch(`/books/${book.id}/`, { status: 'COMPLETED' });

            onSave({ ...book, status: 'COMPLETED' });
            onClose();
        } catch (err) {
            console.error('Error saving review:', err);
            const errorMsg = err?.response?.data?.detail ||
                           err?.response?.data?.message ||
                           JSON.stringify(err?.response?.data) ||
                           err?.message ||
                           'Failed to save review';
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                    <div>
                        <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'Outfit' }}>
                            Great Job! 🎉
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Manrope' }}>
                            You finished "{book.title}"
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm" style={{ fontFamily: 'Manrope' }}>
                            <span className="shrink-0">⚠️</span><span>{error}</span>
                        </div>
                    )}

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Manrope' }}>
                            How would you rate this book?
                        </label>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => { setRating(star); setError(''); }}
                                    className="transition-transform hover:scale-110 active:scale-95"
                                >
                                    <span className={`text-4xl ${star <= rating ? 'filter drop-shadow-lg' : 'opacity-30'}`}>
                                        ⭐
                                    </span>
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-center text-sm text-gray-500 mt-2" style={{ fontFamily: 'Manrope' }}>
                                {rating === 1 && 'Not for me'}
                                {rating === 2 && 'Could be better'}
                                {rating === 3 && 'It was okay'}
                                {rating === 4 && 'Really enjoyed it'}
                                {rating === 5 && 'Absolutely loved it'}
                            </p>
                        )}
                    </div>

                    {/* Review */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Manrope' }}>
                            Write a review <span className="text-xs font-normal text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your thoughts about this book..."
                            rows={4}
                            className="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-orange-50/20 transition-all resize-none"
                            style={{ fontFamily: 'Manrope' }}
                        />
                        {review.length > 0 && (
                            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Manrope' }}>
                                {review.length} characters
                            </p>
                        )}
                    </div>

                    {/* Recommendation */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Manrope' }}>
                            Would you recommend this book?
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setRecommended(true); setError(''); }}
                                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all ${
                                    recommended === true
                                        ? 'bg-green-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                style={{ fontFamily: 'Manrope' }}
                            >
                                👍 Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => { setRecommended(false); setError(''); }}
                                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all ${
                                    recommended === false
                                        ? 'bg-red-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                style={{ fontFamily: 'Manrope' }}
                            >
                                👎 No
                            </button>
                            <button
                                type="button"
                                onClick={() => { setRecommended(null); setError(''); }}
                                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all ${
                                    recommended === null
                                        ? 'bg-gray-400 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                style={{ fontFamily: 'Manrope' }}
                            >
                                🤔 Skip
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
                        style={{ fontFamily: 'Manrope' }}>
                        Skip for now
                    </button>
                    <button type="submit" onClick={handleSave} disabled={saving || rating === 0}
                        className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md disabled:opacity-50 active:scale-[0.98]"
                        style={{ fontFamily: 'Share Tech', letterSpacing: '0.03em' }}>
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Saving...
                            </span>
                        ) : 'Save Review'}
                    </button>
                </div>
            </div>
        </div>
    );
}
