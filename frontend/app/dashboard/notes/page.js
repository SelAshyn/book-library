'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import NotesPanel from '../../../components/dashboard/NotesPanel';

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

function wordCount(text) {
    return !text || text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export default function NotesPage() {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL | WITH_NOTES | WITHOUT_NOTES
    const [activeBook, setActiveBook] = useState(null);

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/books/');
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchBooks();
    }, [user, fetchBooks]);

    const handleNotesSave = (bookId, newNotes) => {
        setBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, notes: newNotes } : b));
        setActiveBook((prev) => prev?.id === bookId ? { ...prev, notes: newNotes } : prev);
    };

    const filtered = books.filter((b) => {
        const q = search.toLowerCase();
        const matchSearch = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
        const matchFilter =
            filter === 'ALL' ? true :
            filter === 'WITH_NOTES' ? !!b.notes?.trim() :
            !b.notes?.trim();
        return matchSearch && matchFilter;
    });

    const totalWords = books.reduce((sum, b) => sum + wordCount(b.notes), 0);
    const booksWithNotes = books.filter((b) => b.notes?.trim()).length;

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'Outfit' }}>Notes</h1>
                <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: 'Manrope' }}>
                    {booksWithNotes} of {books.length} books have notes · {totalWords.toLocaleString()} total words
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {[
                    { icon: '📝', value: booksWithNotes, label: 'Books with notes', bg: 'bg-orange-50', border: 'border-orange-200', color: 'text-orange-600' },
                    { icon: '✍️', value: totalWords.toLocaleString(), label: 'Total words written', bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-600' },
                    { icon: '📚', value: books.length - booksWithNotes, label: 'Books without notes', bg: 'bg-purple-50', border: 'border-purple-200', color: 'text-purple-600' },
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

            {/* Search + filter */}
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
                <div className="flex gap-2">
                    {[
                        { key: 'ALL', label: 'All books' },
                        { key: 'WITH_NOTES', label: 'Has notes' },
                        { key: 'WITHOUT_NOTES', label: 'No notes' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                                filter === key
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                            }`}
                            style={{ fontFamily: 'Manrope' }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Book list */}
            {loading ? (
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 animate-pulse overflow-hidden">
                            <div className="w-full bg-gray-200" style={{ aspectRatio: '2/3' }} />
                            <div className="p-3 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-5xl mb-4">📭</span>
                    <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'Outfit' }}>No books found</h3>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Manrope' }}>
                        {search ? `Nothing matches "${search}"` : 'Add some books to start taking notes'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                    {filtered.map((book) => {
                        const status = STATUS_CONFIG[book.status] ?? STATUS_CONFIG.PLANNED;
                        const gradient = GRADIENTS[book.title.charCodeAt(0) % GRADIENTS.length];
                        const words = wordCount(book.notes);
                        const hasNotes = !!book.notes?.trim();

                        return (
                            <div
                                key={book.id}
                                className="bg-white border-2 border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer flex flex-col overflow-hidden"
                                onClick={() => setActiveBook(book)}
                            >
                                {/* Cover — 2:3 book aspect ratio */}
                                <div className={`relative w-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 overflow-hidden`}
                                    style={{ aspectRatio: '2/3' }}>
                                    {book.cover_url ? (
                                        <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">📖</span>
                                    )}
                                    {/* Notes indicator badge */}
                                    {hasNotes && (
                                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3 flex flex-col flex-1">
                                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5 w-fit ${status.color}`} style={{ fontFamily: 'Manrope' }}>
                                        {status.label}
                                    </span>
                                    <h3 className="font-bold text-black text-xs leading-tight line-clamp-2 mb-1" style={{ fontFamily: 'Outfit' }}>
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-2 truncate" style={{ fontFamily: 'Manrope' }}>{book.author}</p>
                                    <div className="mt-auto">
                                        {hasNotes ? (
                                            <p className="text-xs text-orange-500 font-semibold" style={{ fontFamily: 'Manrope' }}>
                                                {words} {words === 1 ? 'word' : 'words'}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-300 italic" style={{ fontFamily: 'Manrope' }}>No notes yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Notes slide-over */}
            {activeBook && (
                <NotesPanel
                    book={activeBook}
                    onClose={() => setActiveBook(null)}
                    onSave={handleNotesSave}
                />
            )}
        </>
    );
}
