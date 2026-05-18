'use client';

import { useState, useEffect, useRef } from 'react';

const EMPTY = { title: '', author: '', pages: '', status: 'PLANNED', cover_url: '', notes: '' };

const STATUS_OPTIONS = [
    { value: 'PLANNED',   label: '🔖 Want to Read' },
    { value: 'READING',   label: '📖 Currently Reading' },
    { value: 'COMPLETED', label: '✅ Completed' },
];

const CLOUD_NAME   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'novella/covers');

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText).secure_url);
            } else {
                reject(new Error('Upload failed'));
            }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(formData);
    });
}

export default function BookModal({ book, onClose, onSave }) {
    const [form, setForm]               = useState(EMPTY);
    const [saving, setSaving]           = useState(false);
    const [uploading, setUploading]     = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl]   = useState('');
    const [error, setError]             = useState('');
    const firstRef  = useRef(null);
    const fileRef   = useRef(null);

    useEffect(() => {
        const data = book ? {
            title:     book.title     ?? '',
            author:    book.author    ?? '',
            pages:     book.pages     ?? '',
            status:    book.status    ?? 'PLANNED',
            cover_url: book.cover_url ?? '',
            notes:     book.notes     ?? '',
        } : EMPTY;
        setForm(data);
        setPreviewUrl(book?.cover_url ?? '');
        setError('');
        setUploadProgress(0);
        setTimeout(() => firstRef.current?.focus(), 50);
    }, [book]);

    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (name === 'cover_url') setPreviewUrl(value);
        setError('');
    };

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
        if (file.size > 10 * 1024 * 1024)   { setError('Image must be under 10 MB.'); return; }

        // Instant local preview
        setPreviewUrl(URL.createObjectURL(file));
        setError('');
        setUploading(true);
        setUploadProgress(0);

        try {
            const url = await uploadToCloudinary(file, setUploadProgress);
            setForm((p) => ({ ...p, cover_url: url }));
            setPreviewUrl(url);
        } catch (err) {
            setError(`Upload failed: ${err.message}`);
            setPreviewUrl(form.cover_url); // revert preview
        } finally {
            setUploading(false);
            setUploadProgress(0);
            // reset file input so same file can be re-selected
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const clearCover = () => {
        setPreviewUrl('');
        setForm((p) => ({ ...p, cover_url: '' }));
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim())                    { setError('Title is required.'); return; }
        if (!form.author.trim())                   { setError('Author is required.'); return; }
        if (!form.pages || Number(form.pages) < 1) { setError('Enter a valid page count.'); return; }
        if (uploading)                             { setError('Please wait for the image to finish uploading.'); return; }

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
                            placeholder="e.g. The Great Gatsby" className={inputCls} style={{ fontFamily: 'Manrope' }} />
                    </Field>

                    <Field label="Author *">
                        <input type="text" name="author" value={form.author} onChange={handleChange}
                            placeholder="e.g. F. Scott Fitzgerald" className={inputCls} style={{ fontFamily: 'Manrope' }} />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Pages *">
                            <input type="number" name="pages" value={form.pages} onChange={handleChange}
                                placeholder="180" min="1" className={inputCls} style={{ fontFamily: 'Manrope' }} />
                        </Field>
                        <Field label="Status">
                            <select name="status" value={form.status} onChange={handleChange}
                                className={inputCls} style={{ fontFamily: 'Manrope' }}>
                                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </Field>
                    </div>

                    {/* Cover image */}
                    <Field label="Cover Image" hint="Optional">
                        {/* Preview */}
                        {previewUrl && (
                            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2 bg-gray-100">
                                <img src={previewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                                        <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        <span className="text-white text-xs font-semibold">{uploadProgress}%</span>
                                    </div>
                                )}
                                {!uploading && (
                                    <button type="button" onClick={clearCover}
                                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xs transition-all">
                                        ✕
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Upload progress bar (when no preview yet) */}
                        {uploading && !previewUrl && (
                            <div className="mb-2">
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full transition-all duration-200"
                                        style={{ width: `${uploadProgress}%` }} />
                                </div>
                                <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Manrope' }}>Uploading... {uploadProgress}%</p>
                            </div>
                        )}

                        {/* URL input + upload buttons */}
                        <div className="flex gap-2">
                            <input type="url" name="cover_url" value={form.cover_url} onChange={handleChange}
                                placeholder="Paste image URL..."
                                className={`${inputCls} flex-1 min-w-0`} style={{ fontFamily: 'Manrope' }} />

                            {/* Browse file */}
                            <button type="button" onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                title="Browse file"
                                className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300 rounded-xl text-sm font-semibold text-gray-600 transition-all disabled:opacity-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Browse
                            </button>

                            {/* Camera (mobile) */}
                            <button type="button" onClick={() => {
                                    if (fileRef.current) {
                                        fileRef.current.removeAttribute('capture');
                                        fileRef.current.setAttribute('capture', 'environment');
                                        fileRef.current.click();
                                    }
                                }}
                                disabled={uploading}
                                title="Take photo"
                                className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300 rounded-xl text-sm font-semibold text-gray-600 transition-all disabled:opacity-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Camera
                            </button>
                        </div>

                        {/* Hidden file input — no capture attr by default so Browse works on desktop */}
                        <input ref={fileRef} type="file" accept="image/*"
                            onChange={handleFile} className="hidden" />

                        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Manrope' }}>
                            Paste a URL, browse from device, or take a photo · Max 10 MB
                        </p>
                    </Field>

                    <Field label="Notes" hint="Optional">
                        <textarea name="notes" value={form.notes} onChange={handleChange}
                            placeholder="Your thoughts, quotes, reminders..." rows={3}
                            className={`${inputCls} resize-none`} style={{ fontFamily: 'Manrope' }} />
                    </Field>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
                        style={{ fontFamily: 'Manrope' }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={saving || uploading}
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
                        ) : uploading ? 'Uploading...' : book ? 'Save Changes' : 'Add Book'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const inputCls = 'w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:bg-orange-50/20 transition-all';

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
