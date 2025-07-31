import React, { useState } from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="w-full shadow-sm border-b border-white/20 border-t-[20px] border-t-[#84282D] bg-white z-50 relative">
            <div className="mx-auto px-4 sm:px-6 lg:px-20 py-2 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <a href="/home">
                        <img
                            src={logo}
                            alt="Shrilalmahal Logo"
                            className="h-12 w-auto object-contain"
                        />
                    </a>
                </div>


                {/* Hamburger Button (mobile only) */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-black focus:outline-none"
                    aria-label="Toggle navigation"
                >
                    <div className="space-y-1">
                        <span className="block w-6 h-0.5 bg-black"></span>
                        <span className="block w-6 h-0.5 bg-black"></span>
                        <span className="block w-6 h-0.5 bg-black"></span>
                    </div>
                </button>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 lg:gap-16 text-sm font-semibold text-[#84282D] text-[16px]">
                    <a href="/home#generate-ticket" className="hover:text-red-400 transition-colors duration-200">
                        Generate Your Ticket
                    </a>
                    <a href="/home#activate-ticket" className="hover:text-red-400 transition-colors duration-200">
                        Activate Your Ticket
                    </a>
                    <a href="/home#claim-ticket" className="hover:text-red-400 transition-colors duration-200">
                        Claim Your Ticket
                    </a>

                    <Link to="/winners" className="hover:text-red-400 transition-colors duration-200">Winners</Link>
                    <a
                        href="https://shrilalmahal.org/about-us"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-red-400 transition-colors duration-200"
                    >
                        About Us
                    </a>
                    <Link to="/contact" className="hover:text-red-400 transition-colors duration-200">Contact Us</Link>
                </nav>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4">
                    <nav className="flex flex-col gap-3 text-sm font-semibold text-[#84282D] text-[16px]">
                        <a
                            href="#generate-ticket"
                            onClick={() => setMenuOpen(false)}
                            className="hover:text-red-400 transition-colors duration-200"
                        >
                            Generate Your Ticket
                        </a>
                        <a
                            href="#activate-ticket"
                            onClick={() => setMenuOpen(false)}
                            className="hover:text-red-400 transition-colors duration-200"
                        >
                            Activate Your Ticket
                        </a>
                        <a
                            href="#claim-ticket"
                            onClick={() => setMenuOpen(false)}
                            className="hover:text-red-400 transition-colors duration-200"
                        >
                            Claim Your Ticket
                        </a>

                        <Link to="/winners" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>Winners</Link>
                        <a
                            href="https://shrilalmahal.org/about-us"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-400 transition-colors duration-200"
                            onClick={() => setMenuOpen(false)}
                        >
                            About Us
                        </a>
                        <Link to="/contact" className="hover:text-red-400" onClick={() => setMenuOpen(false)}>Contact Us</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
