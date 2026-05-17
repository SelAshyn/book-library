export function Features() {
    return (
        <main>
            <div className="flex flex-col w-full min-h-screen px-4 md:px-8 lg:px-20 items-center text-black justify-center py-16 pt-24 md:pt-28">
                <div className="w-full max-w-4xl mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center" style={{ fontFamily: 'Outfit' }}>Features</h1>
                    <p className="text-sm md:text-base text-center mt-4 text-gray-700" style={{ fontFamily: 'Manrope' }}>Discover everything you need to become a better reader</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl">
                    <div className="bg-transparent border-2 border-green-500 p-6 md:p-8 rounded-xl hover:shadow-2xl transition-all">
                        <h3 className="text-lg md:text-2xl font-bold text-black mb-3" style={{ fontFamily: 'Manrope' }}>📚 Organize Your Library</h3>
                        <p className="text-sm md:text-base text-black opacity-90 leading-relaxed" style={{ fontFamily: 'Outfit' }}>Build your own digital bookshelf and keep every book organized in one place. Categorize your collection with genres, tags, reading status, and custom covers.</p>
                    </div>
                    <div className="bg-transparent border-2 border-purple-500 p-6 md:p-8 rounded-xl hover:shadow-2xl transition-all">
                        <h3 className="text-lg md:text-2xl font-bold text-black mb-3" style={{ fontFamily: 'Manrope' }}>📈 Track Your Progress</h3>
                        <p className="text-sm md:text-base text-black opacity-90 leading-relaxed" style={{ fontFamily: 'Outfit' }}>Stay consistent with your reading goals by tracking your progress in real time. Update your current page, monitor completion percentages, and manage reading statuses.</p>
                    </div>
                    <div className="bg-transparent border-2 border-yellow-500 p-6 md:p-8 rounded-xl hover:shadow-2xl transition-all">
                        <h3 className="text-lg md:text-2xl font-bold text-black mb-3" style={{ fontFamily: 'Manrope' }}>🔥 Build Reading Streaks</h3>
                        <p className="text-sm md:text-base text-black opacity-90 leading-relaxed" style={{ fontFamily: 'Outfit' }}>Capture your thoughts while reading and create a deeper connection with every book. Save private notes, highlight favourite quotes, and write detailed reviews.</p>
                    </div>
                    <div className="bg-transparent border-2 border-pink-500 p-6 md:p-8 rounded-xl hover:shadow-2xl transition-all">
                        <h3 className="text-lg md:text-2xl font-bold text-black mb-3" style={{ fontFamily: 'Manrope' }}>✍️ Notes, Highlights & Reviews</h3>
                        <p className="text-sm md:text-base text-black opacity-90 leading-relaxed" style={{ fontFamily: 'Outfit' }}>Capture your thoughts and insights with built-in note-taking and highlighting features. Share your reviews with the community and discover new books.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
