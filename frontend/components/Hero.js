
'use client';

import Link from 'next/link';

export function Hero() {
    const handleLearnMore = () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen px-4 md:px-8 lg:px-20 items-center gap-8 md:gap-16 md:flex-row text-black justify-center md:justify-around py-10 md:py-20 pt-24 md:pt-28 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-orange-300 rounded-full opacity-20 hidden md:block"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 border-2 border-blue-300 rounded-full opacity-20 hidden md:block"></div>

            {/* Left Content */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start z-10">
                <div className="mb-6 md:mb-8">
                    <img src="/logo.png" alt="Novella Logo" className="w-16 md:w-20 h-auto" />
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl text-center md:text-left font-bold mb-6 leading-tight" style={{ fontFamily: 'Outfit' }}>
                    <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                        Track Every Book.
                    </span>
                    <br />
                    Build Your
                    <span className="text-black"> Reading Habit.</span>
                </h1>

                <p className="text-sm md:text-lg text-gray-700 text-center md:text-left mb-10 leading-relaxed max-w-md" style={{ fontFamily: 'Manrope' }}>
                    Your personal reading companion to organize books, track progress, write private notes, manage wishlists, and maintain reading streaks — all in one beautiful place.
                </p>

                <div className="flex flex-row justify-center md:justify-start gap-4 w-full mb-8">
                    <Link href="/auth/signup">
                        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-semibold shadow-lg cursor-pointer" style={{ fontFamily: 'Share Tech' }}>
                            ✨ Get Started
                        </button>
                    </Link>
                    <button onClick={handleLearnMore} className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 transition-all font-semibold cursor-pointer" style={{ fontFamily: 'Share Tech' }}>
                        📚 Learn More
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-col sm:flex-row gap-6 text-center md:text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Manrope' }}>Rated 4.9/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">👥</span>
                        <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Manrope' }}>50K+ Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Manrope' }}>Free Forever</span>
                    </div>
                </div>
            </div>

            {/* Right Stats Cards */}
            <div className="w-full md:w-1/2 max-w-md z-10">
                <div className="grid grid-cols-2 gap-4 md:gap-6 auto-rows-max">
                    {/* Books Tracked Stat */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 md:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-orange-400">
                        <div className="text-4xl md:text-5xl mb-3">📚</div>
                        <h3 className="text-xs md:text-sm font-bold text-white opacity-95 mb-2 uppercase tracking-wide" style={{ fontFamily: 'Manrope' }}>Books Tracked</h3>
                        <p className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>10K+</p>
                        <p className="text-xs text-orange-100 mt-2">And counting...</p>
                    </div>

                    {/* Reading Streaks Stat */}
                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 md:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-red-400">
                        <div className="text-4xl md:text-5xl mb-3">🔥</div>
                        <h3 className="text-xs md:text-sm font-bold text-white opacity-95 mb-2 uppercase tracking-wide" style={{ fontFamily: 'Manrope' }}>Streaks</h3>
                        <p className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>365+</p>
                        <p className="text-xs text-red-100 mt-2">Days in a row</p>
                    </div>

                    {/* Smart Picks Stat */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 md:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-blue-400">
                        <div className="text-4xl md:text-5xl mb-3">✨</div>
                        <h3 className="text-xs md:text-sm font-bold text-white opacity-95 mb-2 uppercase tracking-wide" style={{ fontFamily: 'Manrope' }}>Smart Picks</h3>
                        <p className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>AI</p>
                        <p className="text-xs text-blue-100 mt-2">Powered</p>
                    </div>

                    {/* Analytics Stat */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 md:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-purple-400">
                        <div className="text-4xl md:text-5xl mb-3">📊</div>
                        <h3 className="text-xs md:text-sm font-bold text-white opacity-95 mb-2 uppercase tracking-wide" style={{ fontFamily: 'Manrope' }}>Analytics</h3>
                        <p className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>Live</p>
                        <p className="text-xs text-purple-100 mt-2">Real-time</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
