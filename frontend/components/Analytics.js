export function Analytics() {
    return (
        <section className="w-full min-h-screen flex items-center px-4 md:px-8 lg:px-20 py-16 md:py-24">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>📈 Reading Insights</h2>
                    <p className="text-base md:text-lg text-gray-700" style={{ fontFamily: 'Manrope' }}>Visualize your reading journey with beautiful analytics.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { icon: '📊', border: 'border-blue-400',   title: 'Books Completed Yearly', desc: 'Track how many books you complete each year with beautiful year-over-year comparisons.' },
                        { icon: '🎯', border: 'border-purple-400', title: 'Favourite Genres',        desc: 'Discover which genres dominate your library and explore new recommendations.' },
                        { icon: '⚡', border: 'border-green-400',  title: 'Reading Pace',            desc: 'Monitor how many pages you read per day and optimise your reading schedule.' },
                        { icon: '⭐', border: 'border-yellow-400', title: 'Average Ratings',         desc: 'See your average book ratings and identify your favourite authors.' },
                        { icon: '🔥', border: 'border-pink-400',   title: 'Reading Heatmaps',        desc: 'Visualise your reading consistency throughout the year with intuitive heatmaps.' },
                        { icon: '📈', border: 'border-orange-400', title: 'Growth Stats',            desc: 'Track your reading growth and celebrate your achievements over time.' },
                    ].map(({ icon, border, title, desc }) => (
                        <div key={title} className={`bg-transparent border-2 ${border} p-6 md:p-8 rounded-xl hover:shadow-lg transition`}>
                            <div className="text-3xl md:text-4xl mb-3">{icon}</div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Manrope' }}>{title}</h3>
                            <p className="text-sm md:text-base text-gray-700" style={{ fontFamily: 'Outfit' }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
