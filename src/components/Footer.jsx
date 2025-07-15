import React from 'react';
import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer
            className="bg-gradient-to-t from-black via-zinc-900 to-black text-white border-t-[0.5px] rounded-t-md"
            style={{ borderTopColor: '#84282D' }}
        >
            {/* Top Grid Section */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-sm">
                {/* Left Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-2">SHRILALMAHAL</h2>
                    <p>Lucky Draw Contest © 2025</p>
                    <p className="mt-1">All rights reserved</p>
                </div>

                {/* Center Navigation */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Navigation</h3>
                    <ul className="space-y-2">
                        <li><a href="/winners" className="hover:text-orange-300 transition">Winners</a></li>
                        <li><a href="/about" className="hover:text-orange-300 transition">About</a></li>
                        <li><a href="/contact" className="hover:text-orange-300 transition">Contact</a></li>
                        <li><a href="/help" className="hover:text-orange-300 transition">Help</a></li>
                    </ul>
                </div>

                {/* Right Connect Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Connect</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <FaPhone className="text-orange-300" /> +91-99999-99999
                        </li>
                        <li className="flex items-center gap-2">
                            <FaEnvelope className="text-orange-300" /> support@shrilalmahal.com
                        </li>
                        <li className="flex items-center gap-2">
                            <FaInstagram className="text-orange-300" /> @shrilalmahal
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gradient-to-r from-black via-red-900 to-black text-center py-3 text-sm font-medium text-white tracking-wide">
                &copy; {new Date().getFullYear()} SHRILALMAHAL
            </div>
        </footer>
    );
}
