'use client';

import { useState, useEffect, useRef } from 'react';

const EMPTY = { title: '', author: '', pages: '', status: 'PLANNED', cover_url: '', notes: '' };

const STATUS_OPTIONS = [
    { value: 'PLANNED',   label: '🔖 Want to Read' },
    { value: 'READING',   label: '📖 Currently Reading' },
    { value: 'COMPLETED', label: '✅ Completed' },
];

export default function BookModal({ book, onClose, onSave }) {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const firstRef = useRef(null);

    useEffect(() => {
        setForm(book ? {
            title: book.title ?? '',
            author: book.author ?? '',
            pages: book.pages ?? '',
            status: book.status ?? 'PLANNED',
            cover_url: book.cover_url ?? '',
            notes: book.notes ?? '',
        } : EMPTY);
        setError('');
        setTimeout(() => firstRef.current?.focus(), 50);
    }, [book]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { setError('Title is required.'); return; }
        if (!form.author.trim()) { setError('Author is required.'); return; }
        if (!form.pages || Number(form.pages) < 1) { setError('Enter a valid page count.'); return; }
        setSaving(true);
        try {
            await onSave({ ...form, pages: Number(form.pages) }, book?.id ?? null);
            onClose();
        } catch (err) {
            const msg = err?.response?.data
                ? Object.values(err.response.data).flat().join(' ')
                : 'Something went wrong.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-black" style={{ fontFamily: 'Outfit' }}>
                        {book ? 'Edit Book' : 'Add a Book'}
                    </h2>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm" style={{ fontFamily: 'Manrope' }}>
                            <span className="shrink-0">⚠️</span><span>{error}</span>
                        </div>
                    )}
                    <Field label="Title *">
                        <input ref={firstRef} type="text" name="title" value={form.title} onChange={handleChange}
                            placeholder="e.g. The Great Gatsby" className={input} style={{ fontFamily: 'Manrope' }} />
                    </Field>
                    <Field label="Author *">
                        <input type="text" name="author" value={form.author} onChange={handleChange}
                            placeholder="e.g. F. Scott Fitzgerald" className={input} style={{ fontFamily: 'Manrope' }} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Pages *">
                            <input type="number" name="pages" value={form.pages} onChange={handleChange}
                                placeholder="180" min="1" className={input} style={{ fontFamily: 'Manrope' }} />
                        </Field>
                        <Field label="Status">
                            <select name="status" value={form.status} onChange={handleChange}
                                className={input} style={{ fontFamily: 'Manrope' }}>
                                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </Field>
                    </div>
                    <Field label="Cover Image URL" hint="Optional">
                        <input type="url" name="cover_url" value={form.cover_url} onChange={handleChange}
                            placeholder="https://..." className={input} style={{ fontFamily: 'Manrope' }} />
                    </Field>
                    <Field label="Notes" hint="Optional">
                        <textarea name="notes" value={form.notes} onChange={handleChange}
                            placeholder="Your thoughts, quotes, reminders..." rows={3}
                            className={`${input} resize-none`} style={{ fontFamily: 'Manrope' }} />
                    </Field>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
                        style={{ fontFamily: 'Manrope' }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={saving}
                        className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:opacity-50 active:scale-[0.98]"
                        style={{ fontFamily: 'Share Tech', letterSpacing: '0.03em' }}>
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Saving...
                            </span>
                        ) : book ? 'Save Changes' : 'Add Book'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const input = 'w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-orange-50/20 transition-all';

function Field({ label, hint, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Manrope' }}>
                {label}
                {hint && <span className="ml-1.5 text-xs font-normal text-gray-400">{hint}</span>}
            </label>
            {children}
        </div>
    );
}
