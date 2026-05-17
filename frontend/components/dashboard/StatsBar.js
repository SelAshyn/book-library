'use client';

export default function StatsBar({ books }) {
    const total = books.length;
    const reading = books.filter((b) => b.status === 'READING').length;
    const completed = books.filter((b) => b.status === 'COMPLETED').length;
    const planned = books.filter((b) => b.status === 'PLANNED').length;
    const totalPages = books
        .filter((b) => b.status === 'COMPLETED')
        .reduce((sum, b) => sum + (b.pages || 0), 0);

    const stats = [
        { icon: '📚', value: total, label: 'Total Books', bg: 'bg-orange-50', border: 'border-orange-200', valueColor: 'text-orange-600' },
        { icon: '📖', value: reading, label: 'Reading', bg: 'bg-blue-50', border: 'border-blue-200', valueColor: 'text-blue-600' },
        { icon: '✅', value: completed, label: 'Completed', bg: 'bg-green-50', border: 'border-green-200', valueColor: 'text-green-600' },
        { icon: '🔖', value: planned, label: 'Want to Read', bg: 'bg-purple-50', border: 'border-purple-200', valueColor: 'text-purple-600' },
        { icon: '📄', value: totalPages.toLocaleString(), label: 'Pages Read', bg: 'bg-red-50', border: 'border-red-200', valueColor: 'text-red-600' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {stats.map(({ icon, value, label, bg, border, valueColor }) => (
                <div key={label} className={`${bg} border-2 ${border} rounded-2xl p-4`}>
                    <span className="text-2xl">{icon}</span>
                    <p className={`text-2xl font-bold mt-2 ${valueColor}`} style={{ fontFamily: 'Outfit' }}>{value}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5" style={{ fontFamily: 'Manrope' }}>{label}</p>
                </div>
            ))}
        </div>
    );
}
