export function Testimonials() {
    const cards = [
        { border: 'border-blue-400',   quote: '"This app completely changed how I manage my reading habits. The streak system keeps me motivated every day."', name: '— Sarah M.', role: 'Avid Reader' },
        { border: 'border-purple-400', quote: '"The private notes and progress tracker make it perfect for students and avid readers."',                        name: '— David K.', role: 'Student' },
        { border: 'border-pink-400',   quote: '"Finally a clean and modern library tracker that actually feels enjoyable to use."',                             name: '— Emily R.', role: 'Book Enthusiast' },
    ];

    return (
        <section className="w-full min-h-screen flex items-center px-4 md:px-8 lg:px-20 py-16 md:py-24">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>💬 What Readers Say</h2>
                    <p className="text-base md:text-lg text-gray-700" style={{ fontFamily: 'Manrope' }}>Join thousands of happy readers building their reading habits.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {cards.map(({ border, quote, name, role }) => (
                        <div key={name} className={`bg-transparent border-2 ${border} p-6 md:p-8 rounded-xl hover:shadow-xl transition`}>
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => <span key={i} className="text-xl md:text-2xl">⭐</span>)}
                            </div>
                            <p className="text-gray-800 mb-6 leading-relaxed text-sm md:text-base" style={{ fontFamily: 'Manrope' }}>{quote}</p>
                            <p className="text-gray-900 font-bold text-sm md:text-base" style={{ fontFamily: 'Outfit' }}>{name}</p>
                            <p className="text-gray-600 text-xs md:text-sm" style={{ fontFamily: 'Manrope' }}>{role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
