'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

// ─── Word Form Modal ──────────────────────────────────────────────────────────

function WordModal({ word, books, onClose, onSave }) {
    const [form, setForm] = useState({
        word: word?.word ?? '',
        meaning: word?.meaning ?? '',
        example: word?.example ?? '',
        book: word?.book ?? '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);
    const firstRef = useRef(null);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        setTimeout(() => firstRef.current?.focus(), 100);
    }, []);

    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 180);
    };

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.word.trim()) { setError('Word is required.'); return; }
        setSaving(true);
        try {
            await onSave({ ...form, book: form.book || null }, word?.id ?? null);
            handleClose();
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes bdIn  { from{opacity:0} to{opacity:1} }
                @keyframes bdOut { from{opacity:1} to{opacity:0} }
                @keyframes mIn   { from{opacity:0;transform:scale(0.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
                @keyframes mOut  { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(0.93) translateY(10px)} }
                .bd-in  { animation: bdIn  0.18s ease forwards }
                .bd-out { animation: bdOut 0.18s ease forwards }
                .m-in   { animation: mIn   0.22s cubic-bezier(0.34,1.56,0.64,1) forwards }
                .m-out  { animation: mOut  0.16s ease forwards }
            `}</style>
            <div className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm ${visible ? 'bd-in' : 'bd-out'}`} onClick={handleClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className={`w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto ${visible ? 'm-in' : 'm-out'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-black" style={{ fontFamily: 'Outfit' }}>
                            {word ? 'Edit Word' : 'Add a Word'}
                        </h2>
                        <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm" style={{ fontFamily: 'Manrope' }}>
                                <span>⚠️</span><span>{error}</span>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>Word *</label>
                            <input ref={firstRef} type="text" name="word" value={form.word} onChange={handleChange}
                                placeholder="e.g. Ephemeral"
                                className="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 transition-all"
                                style={{ fontFamily: 'Manrope' }} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>
                                Meaning <span className="text-xs font-normal text-gray-400">optional</span>
                            </label>
                            <textarea name="meaning" value={form.meaning} onChange={handleChange}
                                placeholder="e.g. Lasting for a very short time"
                                rows={3}
                                className="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 transition-all resize-none"
                                style={{ fontFamily: 'Manrope' }} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>
                                Example sentence <span className="text-xs font-normal text-gray-400">optional</span>
                            </label>
                            <input type="text" name="example" value={form.example} onChange={handleChange}
                                placeholder="e.g. The ephemeral beauty of cherry blossoms..."
                                className="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 transition-all"
                                style={{ fontFamily: 'Manrope' }} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>
                                From book <span className="text-xs font-normal text-gray-400">optional</span>
                            </label>
                            <select name="book" value={form.book} onChange={handleChange}
                                className="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-black text-sm focus:outline-none focus:border-orange-500 transition-all"
                                style={{ fontFamily: 'Manrope' }}>
                                <option value="">— No book —</option>
                                {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                            </select>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <button type="button" onClick={handleClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 rounded-xl transition-all"
                            style={{ fontFamily: 'Manrope' }}>
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:opacity-50 active:scale-[0.98]"
                            style={{ fontFamily: 'Share Tech', letterSpacing: '0.03em' }}>
                            {saving ? (
                                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Saving...</>
                            ) : word ? 'Save Changes' : 'Add Word'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VocabularyPage() {
    const { user } = useAuth();
    const [words, setWords] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [bookFilter, setBookFilter] = useState('ALL');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingWord, setEditingWord] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [wordsRes, booksRes] = await Promise.all([
                api.get('/vocabulary/'),
                api.get('/books/'),
            ]);
            setWords(wordsRes.data);
            setBooks(booksRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchData();
    }, [user, fetchData]);

    const handleSave = async (formData, wordId) => {
        if (wordId) {
            const res = await api.patch(`/vocabulary/${wordId}/`, formData);
            setWords((prev) => prev.map((w) => (w.id === wordId ? res.data : w)));
        } else {
            const res = await api.post('/vocabulary/', formData);
            setWords((prev) => [res.data, ...prev]);
        }
    };

    const handleDelete = async (wordId) => {
        await api.delete(`/vocabulary/${wordId}/`);
        setWords((prev) => prev.filter((w) => w.id !== wordId));
    };

    const openAdd  = () => { setEditingWord(null); setModalOpen(true); };
    const openEdit = (w) => { setEditingWord(w); setModalOpen(true); };

    const bookMap = Object.fromEntries(books.map((b) => [b.id, b.title]));
    const booksWithWords = [...new Set(words.map((w) => w.book).filter(Boolean))];

    const filtered = words.filter((w) => {
        const q = search.toLowerCase();
        const matchSearch = w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q);
        const matchBook = bookFilter === 'ALL' ? true : String(w.book) === bookFilter;
        return matchSearch && matchBook;
    });

    // Group alphabetically
    const grouped = filtered.reduce((acc, w) => {
        const letter = w.word[0]?.toUpperCase() ?? '#';
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(w);
        return acc;
    }, {});
    const letters = Object.keys(grouped).sort();

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'Outfit' }}>Vocabulary</h1>
                    <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: 'Manrope' }}>
                        {words.length} {words.length === 1 ? 'word' : 'words'} collected across your reading
                    </p>
                </div>
                <button onClick={openAdd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] shrink-0"
                    style={{ fontFamily: 'Share Tech', letterSpacing: '0.03em' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Word
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {[
                    { icon: '🔤', value: words.length, label: 'Words collected', bg: 'bg-orange-50', border: 'border-orange-200', color: 'text-orange-600' },
                    { icon: '📚', value: booksWithWords.length, label: 'Books sourced', bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-600' },
                    { icon: '🔡', value: letters.length, label: 'Letters covered', bg: 'bg-purple-50', border: 'border-purple-200', color: 'text-purple-600' },
                ].map(({ icon, value, label, bg, border, color }) => (
                    <div key={label} className={`${bg} border-2 ${border} rounded-xl p-2.5 sm:p-4 flex items-center gap-2.5 sm:block`}>
                        <span className="text-xl sm:text-2xl shrink-0">{icon}</span>
                        <div className="sm:mt-2 min-w-0">
                            <p className={`text-lg sm:text-2xl font-bold leading-none ${color}`} style={{ fontFamily: 'Outfit' }}>{value}</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5 truncate" style={{ fontFamily: 'Manrope' }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + book filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative w-full sm:w-64">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <input type="text" placeholder="Search words or meanings..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all"
                        style={{ fontFamily: 'Manrope' }} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setBookFilter('ALL')}
                        className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${bookFilter === 'ALL' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'}`}
                        style={{ fontFamily: 'Manrope' }}>
                        All books
                    </button>
                    {booksWithWords.map((bookId) => (
                        <button key={bookId} onClick={() => setBookFilter(String(bookId))}
                            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all truncate max-w-40 ${String(bookFilter) === String(bookId) ? 'bg-orange-500 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'}`}
                            style={{ fontFamily: 'Manrope' }}>
                            {bookMap[bookId] ?? 'Unknown'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Word grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 p-5 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="text-5xl mb-4">📖</span>
                    <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'Outfit' }}>
                        {search ? 'No words found' : 'No words yet'}
                    </h3>
                    <p className="text-gray-400 text-sm max-w-xs mb-6" style={{ fontFamily: 'Manrope' }}>
                        {search ? `Nothing matches "${search}"` : 'Start adding words you discover while reading.'}
                    </p>
                    {!search && (
                        <button onClick={openAdd}
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                            style={{ fontFamily: 'Share Tech' }}>
                            + Add your first word
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {letters.map((letter) => (
                        <div key={letter}>
                            {/* Letter divider */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-lg font-bold text-orange-500 w-7 shrink-0" style={{ fontFamily: 'Outfit' }}>{letter}</span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            {/* Card grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {grouped[letter].map((w) => (
                                    <div key={w.id} className="group bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all flex flex-col gap-3">
                                        {/* Word + book tag */}
                                        <div>
                                            <h3 className="font-bold text-black text-lg leading-tight" style={{ fontFamily: 'Outfit' }}>
                                                {w.word}
                                            </h3>
                                            {w.book && (
                                                <span className="inline-block mt-1.5 text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-semibold border border-orange-200 truncate max-w-full" style={{ fontFamily: 'Manrope' }}>
                                                    📚 {bookMap[w.book] ?? 'Unknown'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Meaning */}
                                        {w.meaning ? (
                                            <p className="text-sm text-gray-600 leading-relaxed flex-1" style={{ fontFamily: 'Manrope' }}>
                                                {w.meaning}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-300 italic flex-1" style={{ fontFamily: 'Manrope' }}>
                                                No meaning added yet
                                            </p>
                                        )}

                                        {/* Example */}
                                        {w.example && (
                                            <p className="text-xs text-gray-400 italic border-l-2 border-orange-200 pl-3 leading-relaxed" style={{ fontFamily: 'Manrope' }}>
                                                "{w.example}"
                                            </p>
                                        )}

                                        {/* Actions — always visible on touch, hover-only on pointer devices */}
                                        <div className="flex gap-2 pt-1 border-t border-gray-50 opacity-100 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(w)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all"
                                                style={{ fontFamily: 'Manrope' }}>
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(w.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                                                style={{ fontFamily: 'Manrope' }}>
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <WordModal
                    word={editingWord}
                    books={books}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
