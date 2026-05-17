'use client';

import { useState } from 'react';
import ReviewPanel from './ReviewPanel';

const STATUS_CONFIG = {
    READING:   { label: 'Reading',      color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
    COMPLETED: { label: 'Completed',    color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    PLANNED:   { label: 'Want to Read', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
};

const GRADIENTS = [
    'from-orange-400 to-red-400',
    'from-blue-400 to-indigo-400',
    'from-green-400 to-teal-400',
    'from-purple-400 to-pink-400',
    'from-yellow-400 to-orange-400',
    'from-teal-400 to-cyan-400',
];

export default function BookCard({ book, onEdit, onDelete, onStatusChange, onNotes, onReviewSave }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const status = STATUS_CONFIG[book.status] ?? STATUS_CONFIG.PLANNED;
    const gradient = GRADIENTS[book.title.charCodeAt(0) % GRADIENTS.length];

    const handleDelete = () => {
        if (confirmDelete) {
            onDelete();
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    };

    const handleStatusChange = async (newStatus) => {
        setStatusLoading(true);
        try {
            await onStatusChange(newStatus);
            // Show review panel if marking as completed
            if (newStatus === 'COMPLETED') {
                setShowReview(true);
            }
        }
        finally { setStatusLoading(false); }
    };

    return (
        <>
            <div className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all duration-200 flex flex-col">
            {/* Cover */}
            <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-5xl opacity-60">📖</span>
                )}
                {/* Hover actions */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onNotes}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-600 hover:text-yellow-600 hover:bg-white transition-all shadow-sm"
                        aria-label="Notes">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 448 512"><path d="M240 432L64 432c-8.8 0-16-7.2-16-16L48 96c0-8.8 7.2-16 16-16l320 0c8.8 0 16 7.2 16 16l0 176-88 0c-39.8 0-72 32.2-72 72l0 88zM380.1 320L288 412.1 288 344c0-13.3 10.7-24 24-24l68.1 0zM0 416c0 35.3 28.7 64 64 64l197.5 0c17 0 33.3-6.7 45.3-18.7L429.3 338.7c12-12 18.7-28.3 18.7-45.3L448 96c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96L0 416z"/></svg>
                    </button>
                    <button onClick={onEdit}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-600 hover:text-orange-600 hover:bg-white transition-all shadow-sm"
                        aria-label="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onClick={handleDelete}
                        className={`w-8 h-8 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all shadow-sm ${confirmDelete ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:text-red-600 hover:bg-white'}`}
                        aria-label={confirmDelete ? 'Confirm delete' : 'Delete'}
                        title={confirmDelete ? 'Click again to confirm' : 'Delete'}>
                        {confirmDelete ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`} style={{ fontFamily: 'Manrope' }}>
                        {status.label}
                    </span>
                </div>
                <h3 className="font-bold text-black text-base leading-snug line-clamp-2 mb-1" style={{ fontFamily: 'Outfit' }}>
                    {book.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3" style={{ fontFamily: 'Manrope' }}>{book.author}</p>

                {book.pages > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto" style={{ fontFamily: 'Manrope' }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {book.pages.toLocaleString()} pages
                    </div>
                )}

                {book.notes && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic" style={{ fontFamily: 'Manrope' }}>"{book.notes}"</p>
                )}

                {/* Quick status actions */}
                {book.status === 'PLANNED' && (
                    <button onClick={() => handleStatusChange('READING')} disabled={statusLoading}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 border-2 border-blue-200 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all disabled:opacity-50 active:scale-[0.98]"
                        style={{ fontFamily: 'Manrope' }}>
                        {statusLoading ? <Spinner /> : <span>📖</span>}
                        Start Reading
                    </button>
                )}
                {book.status === 'READING' && (
                    <button onClick={() => handleStatusChange('COMPLETED')} disabled={statusLoading}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 bg-green-50 border-2 border-green-200 text-green-700 text-xs font-bold rounded-xl hover:bg-green-100 hover:border-green-400 transition-all disabled:opacity-50 active:scale-[0.98]"
                        style={{ fontFamily: 'Manrope' }}>
                        {statusLoading ? <Spinner /> : <span>✅</span>}
                        Mark as Completed
                    </button>
                )}
            </div>
        </div>

        {showReview && (
            <ReviewPanel
                book={book}
                onClose={() => setShowReview(false)}
                onSave={(updatedBook) => {
                    if (onReviewSave) onReviewSave(book.id, updatedBook);
                    setShowReview(false);
                }}
            />
        )}
        </>
    );
}

function Spinner() {
    return (
        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
    );
}
