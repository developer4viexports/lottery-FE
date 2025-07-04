import React from 'react';
import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-blue-800 text-white">
            <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-sm">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Shrilalmahal</h2>
                    <p>Lucky Draw Contest © 2025</p>
                    <p className="mt-1">All rights reserved.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Navigation</h3>
                    <ul className="space-y-2">
                        <li><a href="/winners" className="hover:underline">Winners</a></li>
                        <li><a href="/about" className="hover:underline">About</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                        <li><a href="/help" className="hover:underline">Help</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Connect</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2"><FaInstagram /> @shrilalmahal</li>
                        <li className="flex items-center gap-2"><FaEnvelope /> support@shrilalmahal.com</li>
                        <li className="flex items-center gap-2"><FaPhone /> +91-99999-99999</li>
                    </ul>
                </div>
            </div>
            <div className="bg-blue-900 text-center py-3 text-sm">
                &copy; {new Date().getFullYear()} Shrilalmahal. Designed with ❤️
            </div>
        </footer>
    );
}
