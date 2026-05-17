'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import StatsBar from '../../components/dashboard/StatsBar';
import BookCard from '../../components/dashboard/BookCard';
import BookModal from '../../components/dashboard/BookModal';
import NotesPanel from '../../components/dashboard/NotesPanel';

const TABS = [
    { key: 'ALL',       label: 'All',        icon: '📚' },
    { key: 'READING',   label: 'Reading',    icon: '📖' },
    { key: 'PLANNED',   label: 'Want to Read', icon: '🔖' },
    { key: 'COMPLETED', label: 'Completed',  icon: '✅' },
];

export default function DashboardPage() {
    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [notesPanelBook, setNotesPanelBook] = useState(null);

    const fetchBooks = useCallback(async () => {
        try {
            setFetchLoading(true);
            const res = await api.get('/books/');
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetchLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchBooks();
    }, [user, fetchBooks]);

    const handleSave = async (formData, bookId) => {
        if (bookId) {
            const res = await api.patch(`/books/${bookId}/`, formData);
            setBooks((prev) => prev.map((b) => (b.id === bookId ? res.data : b)));
        } else {
            const res = await api.post('/books/', formData);
            setBooks((prev) => [res.data, ...prev]);
        }
    };

    const handleDelete = async (bookId) => {
        await api.delete(`/books/${bookId}/`);
        setBooks((prev) => prev.filter((b) => b.id !== bookId));
    };

    const handleStatusChange = async (bookId, newStatus) => {
        const res = await api.patch(`/books/${bookId}/`, { status: newStatus });
        setBooks((prev) => prev.map((b) => (b.id === bookId ? res.data : b)));
    };

    const openAdd  = () => { setEditingBook(null); setModalOpen(true); };
    const openEdit = (book) => { setEditingBook(book); setModalOpen(true); };
    const openNotes = (book) => setNotesPanelBook(book);

    const handleNotesSave = (bookId, newNotes) => {
        setBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, notes: newNotes } : b));
        setNotesPanelBook((prev) => prev?.id === bookId ? { ...prev, notes: newNotes } : prev);
    };

    const handleReviewSave = (bookId, updatedBook) => {
        setBooks((prev) => prev.map((b) => (b.id === bookId ? updatedBook : b)));
    };

    const filtered = books.filter((b) => {
        const matchTab = activeTab === 'ALL' || b.status === activeTab;
        const q = search.toLowerCase();
        const matchSearch = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
        return matchTab && matchSearch;
    });

    return (
        <>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'Outfit' }}>My Library</h1>
                    <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: 'Manrope' }}>
                        {books.length === 0 ? 'Start adding books to your collection' : `${books.length} book${books.length !== 1 ? 's' : ''} in your collection`}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] shrink-0"
                    style={{ fontFamily: 'Share Tech', letterSpacing: '0.03em' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Book
                </button>
            </div>

            {/* Stats */}
            <StatsBar books={books} />

            {/* Search + Tabs */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
                <div className="relative w-full sm:w-64">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all"
                        style={{ fontFamily: 'Manrope' }}
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {TABS.map((tab) => {
                        const count = tab.key === 'ALL' ? books.length : books.filter((b) => b.status === tab.key).length;
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    active ? 'bg-orange-500 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                                }`}
                                style={{ fontFamily: 'Manrope' }}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid */}
            {fetchLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 p-5 animate-pulse">
                            <div className="w-full h-40 bg-gray-200 rounded-xl mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState tab={activeTab} search={search} onAdd={openAdd} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onEdit={() => openEdit(book)}
                            onDelete={() => handleDelete(book.id)}
                            onStatusChange={(s) => handleStatusChange(book.id, s)}
                            onNotes={() => openNotes(book)}
                            onReviewSave={handleReviewSave}
                        />
                    ))}
                </div>
            )}

            {modalOpen && (
                <BookModal
                    book={editingBook}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {notesPanelBook && (
                <NotesPanel
                    book={notesPanelBook}
                    onClose={() => setNotesPanelBook(null)}
                    onSave={handleNotesSave}
                />
            )}
        </>
    );
}

function EmptyState({ tab, search, onAdd }) {
    const isSearch = search.length > 0;
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">{isSearch ? '🔍' : '📭'}</span>
            <h3 className="text-xl font-bold text-black mb-2" style={{ fontFamily: 'Outfit' }}>
                {isSearch ? 'No results found' : 'No books here yet'}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6" style={{ fontFamily: 'Manrope' }}>
                {isSearch
                    ? `Nothing matches "${search}". Try a different search.`
                    : tab === 'ALL'
                    ? 'Start building your library by adding your first book.'
                    : `No books marked as "${tab.toLowerCase()}" yet.`}
            </p>
            {!isSearch && (
                <button onClick={onAdd}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                    style={{ fontFamily: 'Share Tech' }}>
                    + Add your first book
                </button>
            )}
        </div>
    );
}
