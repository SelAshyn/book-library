'use client';

import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';

const STATUS_CONFIG = {
    READING:   { label: 'Reading',      color: 'bg-blue-100 text-blue-700' },
    COMPLETED: { label: 'Completed',    color: 'bg-green-100 text-green-700' },
    PLANNED:   { label: 'Want to Read', color: 'bg-purple-100 text-purple-700' },
};

function wordCount(text) {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export default function NotesPanel({ book, onClose, onSave }) {
    const [notes, setNotes] = useState(book.notes ?? '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [visible, setVisible] = useState(false);
    const textareaRef = useRef(null);
    const status = STATUS_CONFIG[book.status] ?? STATUS_CONFIG.PLANNED;

    // Trigger enter animation on mount
    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        setTimeout(() => textareaRef.current?.focus(), 200);
    }, []);

    // Close with exit animation
    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 200);
    };

    // Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch(`/books/${book.id}/`, { notes });
            onSave(book.id, notes);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const words = wordCount(notes);
    const chars = notes.length;
    const isDirty = notes !== (book.notes ?? '');

    return (
        <>
            <style>{`
                @keyframes backdropIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes backdropOut { from { opacity: 1 } to { opacity: 0 } }
                @keyframes modalIn     { from { opacity: 0; transform: scale(0.93) translateY(12px) } to { opacity: 1; transform: scale(1) translateY(0) } }
                @keyframes modalOut    { from { opacity: 1; transform: scale(1) translateY(0) } to { opacity: 0; transform: scale(0.93) translateY(12px) } }

                .notes-backdrop-in  { animation: backdropIn  0.2s ease forwards }
                .notes-backdrop-out { animation: backdropOut 0.2s ease forwards }
                .notes-modal-in     { animation: modalIn     0.22s cubic-bezier(0.34,1.56,0.64,1) forwards }
                .notes-modal-out    { animation: modalOut    0.18s ease forwards }
            `}</style>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm ${visible ? 'notes-backdrop-in' : 'notes-backdrop-out'}`}
                onClick={handleClose}
            />

            {/* Centered modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`w-full max-w-3xl h-auto bg-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto ${visible ? 'notes-modal-in' : 'notes-modal-out'}`}
                    style={{ maxHeight: '85vh' }}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                        <div className="min-w-0 pr-4">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`} style={{ fontFamily: 'Manrope' }}>
                                {status.label}
                            </span>
                            <h2 className="text-lg font-bold text-black leading-snug line-clamp-1 mt-1.5" style={{ fontFamily: 'Outfit' }}>
                                {book.title}
                            </h2>
                            <p className="text-sm text-gray-400 mt-0.5" style={{ fontFamily: 'Manrope' }}>{book.author}</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Notes area */}
                    <div className="flex flex-col px-6 py-5 flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-3 shrink-0">
                            <label className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Manrope' }}>
                                📝 My Notes
                            </label>
                            <div className="flex items-center gap-3 text-xs text-gray-400" style={{ fontFamily: 'Manrope' }}>
                                <span>{words} {words === 1 ? 'word' : 'words'}</span>
                                <span>·</span>
                                <span>{chars} {chars === 1 ? 'char' : 'chars'}</span>
                            </div>
                        </div>

                        <textarea
                            ref={textareaRef}
                            value={notes}
                            onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
                            placeholder="Write your thoughts, favourite quotes, key takeaways, or anything you want to remember about this book..."
                            className="flex-1 w-full resize-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all leading-relaxed"
                            style={{ fontFamily: 'Manrope', minHeight: '180px' }}
                        />

                        {/* Word count progress bar */}
                        <div className="mt-3 flex items-center gap-2 shrink-0">
                            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-400 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((words / 500) * 100, 100)}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 shrink-0" style={{ fontFamily: 'Manrope' }}>
                                {words}/500 words
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between gap-3 shrink-0">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition-all"
                            style={{ fontFamily: 'Manrope' }}
                        >
                            {isDirty ? 'Discard' : 'Close'}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                            style={{ fontFamily: 'Share Tech', letterSpacing: '0.03em' }}
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : saved ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Saved
                                </>
                            ) : 'Save Notes'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
