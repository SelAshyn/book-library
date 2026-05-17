'use client';

import Link from 'next/link';

export function FinalCTA() {
    return (
        <section className="w-full min-h-screen flex items-center px-4 md:px-8 lg:px-20 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center w-full">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Outfit' }}>
                    Ready to Build Your Reading Habit?
                </h2>
                <p className="text-base md:text-xl text-gray-700 mb-10 leading-relaxed" style={{ fontFamily: 'Manrope' }}>
                    Start organising your books, tracking your progress, and achieving your reading goals today. Join thousands of readers building better habits.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/signup">
                        <button className="bg-orange-500 text-white font-bold px-8 py-4 rounded-lg hover:bg-orange-600 transition-all shadow-lg w-full sm:w-auto cursor-pointer" style={{ fontFamily: 'Share Tech' }}>
                            Start Reading
                        </button>
                    </Link>
                    <Link href="/auth/signup">
                        <button className="border-2 border-orange-500 text-orange-600 font-bold px-8 py-4 rounded-lg hover:bg-orange-50 transition-all w-full sm:w-auto cursor-pointer" style={{ fontFamily: 'Share Tech' }}>
                            Create Free Account
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
