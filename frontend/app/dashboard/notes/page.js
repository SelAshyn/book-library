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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                    <span className="text-2xl">📝</span>
                    <p className="text-2xl font-bold text-orange-600 mt-2" style={{ fontFamily: 'Outfit' }}>{booksWithNotes}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5" style={{ fontFamily: 'Manrope' }}>Books with notes</p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                    <span className="text-2xl">✍️</span>
                    <p className="text-2xl font-bold text-blue-600 mt-2" style={{ fontFamily: 'Outfit' }}>{totalWords.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5" style={{ fontFamily: 'Manrope' }}>Total words written</p>
                </div>
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
                    <span className="text-2xl">📚</span>
                    <p className="text-2xl font-bold text-purple-600 mt-2" style={{ fontFamily: 'Outfit' }}>{books.length - booksWithNotes}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5" style={{ fontFamily: 'Manrope' }}>Books without notes</p>
                </div>
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
                <div className="space-y">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 p-5 animate-pulse flex gap-4">
                            <div className="w-12 h-16 bg-gray-200 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((book) => {
                        const status = STATUS_CONFIG[book.status] ?? STATUS_CONFIG.PLANNED;
                        const gradient = GRADIENTS[book.title.charCodeAt(0) % GRADIENTS.length];
                        const words = wordCount(book.notes);
                        const hasNotes = !!book.notes?.trim();

                        return (
                            <div
                                key={book.id}
                                className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer flex flex-col overflow-hidden"
                                onClick={() => setActiveBook(book)}
                            >
                                {/* Cover */}
                                <div className={`w-full h-40 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 overflow-hidden shrink-0`}>
                                    {book.cover_url ? (
                                        <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl">📖</span>
                                    )}
                                </div>

                                {/* Book Info */}
                                <div className="flex-1 flex flex-col">
                                    <div className="mb-3">
                                        <h3 className="font-bold text-black text-sm leading-tight line-clamp-2" style={{ fontFamily: 'Outfit' }}>
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Manrope' }}>{book.author}</p>
                                    </div>

                                    {/* Status badge */}
                                    <div className="mb-3">
                                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`} style={{ fontFamily: 'Manrope' }}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Notes preview or call-to-action */}
                                    <div className="mt-auto">
                                        {hasNotes ? (
                                            <>
                                                <p className="text-xs text-gray-500 line-clamp-3 italic leading-relaxed mb-2" style={{ fontFamily: 'Manrope' }}>
                                                    "{book.notes}"
                                                </p>
                                                <p className="text-xs text-orange-500 font-semibold" style={{ fontFamily: 'Manrope' }}>
                                                    {words} {words === 1 ? 'word' : 'words'} · Click to edit
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-gray-300 italic" style={{ fontFamily: 'Manrope' }}>
                                                No notes yet — click to add
                                            </p>
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
