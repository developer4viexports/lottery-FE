import React from 'react';
import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import logo from '../assets/logo.png'; // adjust path based on file structure

export default function Footer() {
    return (
        <footer
            className="bg-[#4b1618] text-white border-t-[1px] border-[#84282D]"
        >
            {/* Top Grid Section */}
            <div className=" mx-auto px-6 py-10 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-sm">
                {/* Left Section with Logo and About */}
                <div className="flex gap-4 items-start ">
                    <img src={logo} alt="Logo" className="w-20 h-auto object-contain mt-1" />
                    <div>
                        <h2 className="text-lg font-semibold mb-1">Shri Lal Mahal Group</h2>
                        <p className="text-xs leading-snug">
                            Shri Lal Mahal Group is a world renowned Manufacturer & Exporter of Basmati and Non Basmati Rice in India. Shri Lal Mahal is an USFDA approved company having HACCP, GMP, HALAL, KOSHER & FSSAI certifications as well in production and supply.
                        </p>
                    </div>
                </div>

                {/* Center Navigation */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 ">Navigation</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/winners" className="hover:text-orange-300 transition">Winners</a></li>
                        <li><a href="/about" className="hover:text-orange-300 transition">About</a></li>
                        <li><a href="/contact" className="hover:text-orange-300 transition">Contact</a></li>
                        <li><a href="/help" className="hover:text-orange-300 transition">Help</a></li>
                    </ul>
                </div>

                {/* Right Connect Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Connect</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <FaPhone className="text-orange-300" /> +91-9999-999999
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
            <div className="bg-[#300c0d] text-center py-3 text-sm font-medium text-white">
                Copyright © {new Date().getFullYear()} Shrilalmahal | Powered by Shrilalmahal
            </div>
        </footer>
    );
}
