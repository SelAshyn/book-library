'use client';

import { useState } from 'react';

const faqs = [
    { question: 'Is the app free to use?',       answer: 'Yes, the core features are completely free. We offer a freemium model with optional premium features for power users.' },
    { question: 'Can I track physical books?',    answer: 'Absolutely. You can manage both digital and physical books. Add them manually or scan ISBN codes for quick entry.' },
    { question: 'Does it support mobile devices?', answer: 'Yes. The platform is fully responsive and mobile-friendly. Use it seamlessly on your phone, tablet, or desktop.' },
    { question: 'Can I keep my notes private?',   answer: 'Yes. Your reading notes can remain completely private. You have full control over sharing settings for each book.' },
    { question: 'How do I export my library?',    answer: 'You can export your entire library as CSV or JSON format anytime from your settings. Your data is always yours.' },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="w-full min-h-screen flex items-center px-4 md:px-8 lg:px-20 py-16 md:py-24">
            <div className="max-w-3xl mx-auto w-full">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Outfit' }}>❓ Frequently Asked Questions</h2>
                    <p className="text-base md:text-lg text-gray-700" style={{ fontFamily: 'Manrope' }}>Got questions? We've got answers.</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-transparent border-2 border-gray-400 rounded-lg hover:shadow-lg transition">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full flex justify-between items-center p-4 md:p-6 text-left gap-4"
                            >
                                <h3 className="text-base md:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Manrope' }}>
                                    {faq.question}
                                </h3>
                                <span className={`text-lg md:text-xl shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            {openIndex === index && (
                                <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-100">
                                    <p className="text-sm md:text-base text-gray-700 leading-relaxed pt-3" style={{ fontFamily: 'Outfit' }}>
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
