'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

const GRADIENTS = [
    'from-orange-400 to-red-400',
    'from-blue-400 to-indigo-400',
    'from-green-400 to-teal-400',
    'from-purple-400 to-pink-400',
    'from-yellow-400 to-orange-400',
    'from-teal-400 to-cyan-400',
];

export default function ReviewsPage() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('recent'); // recent | rating | title

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/reviews/');
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await api.delete(`/reviews/${reviewId}/`);
            setReviews(reviews.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error('Error deleting review:', err);
            alert('Failed to delete review');
        }
    };

    useEffect(() => {
        if (user) fetchReviews();
    }, [user, fetchReviews]);

    const filtered = reviews
        .filter((r) => {
            const q = search.toLowerCase();
            return (r.book?.title || '').toLowerCase().includes(q) || (r.book?.author || '').toLowerCase().includes(q);
        })
        .sort((a, b) => {
            if (sortBy === 'recent') return new Date(b.updated_at) - new Date(a.updated_at);
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'title') return (a.book?.title || '').localeCompare(b.book?.title || '');
            return 0;
        });

    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'Outfit' }}>My Reviews</h1>
                <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: 'Manrope' }}>
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''} written
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-8">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
                    <span className="text-2xl">⭐</span>
                    <p className="text-2xl font-bold text-yellow-600 mt-2" style={{ fontFamily: 'Outfit' }}>
                        {avgRating}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5" style={{ fontFamily: 'Manrope' }}>
                        Average rating
                    </p>
                </div>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative w-full sm:w-64">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all"
                        style={{ fontFamily: 'Manrope' }}
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-orange-400 transition-all"
                    style={{ fontFamily: 'Manrope' }}
                >
                    <option value="recent">Most Recent</option>
                    <option value="rating">Highest Rated</option>
                    <option value="title">Title (A-Z)</option>
                </select>
            </div>

            {/* Reviews grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden animate-pulse">
                            <div className="w-full h-40 bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-5xl mb-4">📭</span>
                    <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'Outfit' }}>
                        {search ? 'No reviews found' : 'No reviews yet'}
                    </h3>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Manrope' }}>
                        {search ? `Nothing matches "${search}"` : 'Complete some books and write reviews to see them here'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((review) => {
                        const book = review.book;
                        const gradient = GRADIENTS[book?.title?.charCodeAt(0) % GRADIENTS.length];
                        const reviewDate = new Date(review.updated_at);
                        const formattedDate = reviewDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        });

                        return (
                            <div key={review.id} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all flex flex-col relative group">
                                {/* Delete Button - Top Right Corner */}
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete review"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>

                                {/* Cover - Full Width Top */}
                                <div className={`w-full h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                                    {book?.cover_url ? (
                                        <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl">📖</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-1">
                                    {/* Title and Author */}
                                    <div className="mb-3">
                                        <h3 className="font-bold text-black text-sm line-clamp-2" style={{ fontFamily: 'Outfit' }}>
                                            {book?.title || 'Unknown Book'}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-1" style={{ fontFamily: 'Manrope' }}>
                                            {book?.author}
                                        </p>
                                    </div>

                                    {/* Rating and Date */}
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="text-lg">{'⭐'.repeat(review.rating)}</div>
                                        <p className="text-xs text-gray-400" style={{ fontFamily: 'Manrope' }}>
                                            {formattedDate}
                                        </p>
                                    </div>

                                    {/* Review Text */}
                                    {review.body && (
                                        <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-3 italic" style={{ fontFamily: 'Manrope' }}>
                                            "{review.body}"
                                        </p>
                                    )}

                                    {/* Stats - Bottom */}
                                    <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-gray-100">
                                        {review.recommended !== null && (
                                            <span
                                                className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                                                    review.recommended
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                                style={{ fontFamily: 'Manrope' }}
                                            >
                                                {review.recommended ? '👍 Recommended' : '👎 Not Recommended'}
                                            </span>
                                        )}
                                        {book?.pages > 0 && (
                                            <span className="text-xs text-gray-400 text-center" style={{ fontFamily: 'Manrope' }}>
                                                📖 {book.pages.toLocaleString()} pages
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
