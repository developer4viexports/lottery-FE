import React from 'react';
import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function Footer() {
    return (
        <footer className="bg-[#4b1618] text-white border-t-[1px] border-[#84282D]">
            {/* Top Grid Section */}
            <div className="mx-auto px-6 py-10 text-sm flex flex-col sm:flex-row sm:justify-around gap-8 sm:gap-0 items-center sm:items-start text-center sm:text-left">
                {/* Left Section with Logo and About */}
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start sm:w-[30%]">
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
                    <h3 className="text-lg font-semibold mb-3">Navigation</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/activate" className="hover:text-orange-300 transition">Winners</a></li>
                        <li>
                            <a
                                href="https://shrilalmahal.org/about-us"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-orange-300 transition"
                            >
                                About
                            </a>
                        </li>

                        <li><a href="/contact" className="hover:text-orange-300 transition">Contact</a></li>
                        <li><a href="/help" className="hover:text-orange-300 transition">Help</a></li>
                    </ul>
                </div>

                {/* Right Connect Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Connect</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-center sm:justify-start items-center gap-2">
                            <FaPhone className="text-orange-300" /> +91-9999-999999
                        </li>
                        <li className="flex justify-center sm:justify-start items-center gap-2">
                            <FaEnvelope className="text-orange-300" /> support@shrilalmahal.com
                        </li>
                        <li className="flex justify-center sm:justify-start items-center gap-2">
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
