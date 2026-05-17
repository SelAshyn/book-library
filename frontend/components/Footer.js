import { FaInstagramSquare, FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

export function Footer() {
    return (
        <footer className="w-full bg-gray-800/10 border-t border-gray-300 text-gray-900">
            <div className="px-4 md:px-8 lg:px-20 py-12 md:py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo.png" className="w-8 h-8" alt="Novella Logo" />
                                <div>
                                    <h3 className="text-xl font-bold" style={{ fontFamily: 'Outfit' }}>Novella</h3>
                                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Manrope' }}>Stories That Stay Yours</p>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm" style={{ fontFamily: 'Manrope' }}>
                                Your personal reading companion to organise books and build better reading habits.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Quick Links</h4>
                            <ul className="space-y-2 text-gray-700 text-sm" style={{ fontFamily: 'Manrope' }}>
                                <li><a href="#home" className="hover:text-orange-400 transition">Home</a></li>
                                <li><a href="#features" className="hover:text-orange-400 transition">Features</a></li>
                                <li><a href="#analytics" className="hover:text-orange-400 transition">Analytics</a></li>
                                <li><a href="#testimonials" className="hover:text-orange-400 transition">Testimonials</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Company</h4>
                            <ul className="space-y-2 text-gray-700 text-sm" style={{ fontFamily: 'Manrope' }}>
                                <li><a href="#about" className="hover:text-orange-400 transition">About</a></li>
                                <li><a href="#contact" className="hover:text-orange-400 transition">Contact</a></li>
                                <li><a href="#privacy" className="hover:text-orange-400 transition">Privacy</a></li>
                                <li><a href="#terms" className="hover:text-orange-400 transition">Terms</a></li>
                            </ul>
                        </div>

                        {/* Socials */}
                        <div>
                            <h4 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#instagram" className="text-gray-700 hover:text-orange-600 transition text-2xl" aria-label="Instagram"><FaInstagramSquare /></a>
                                <a href="#linkedin"  className="text-gray-700 hover:text-orange-600 transition text-2xl" aria-label="LinkedIn"><FaLinkedin /></a>
                                <a href="#twitter"   className="text-gray-700 hover:text-orange-600 transition text-2xl" aria-label="Twitter/X"><FaSquareXTwitter /></a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 pt-8">
                        <p className="text-center text-gray-700 text-sm" style={{ fontFamily: 'Manrope' }}>
                            © 2026 Novella. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
