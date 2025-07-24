import React from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Make sure logo.png is in the correct path

export default function Header() {
    return (
        <header className="w-full shadow-sm border-b border-white/20 border-t-[20px] border-t-[#84282D]">
            <div className="mx-auto px-4 sm:px-6 lg:px-20 py-2 flex flex-col md:flex-row items-center justify-between gap-3">
                
                {/* Logo */}
                <div className="flex justify-center md:justify-start">
                    <img
                        src={logo}
                        alt="Shrilalmahal Logo"
                        className="h-12 w-auto object-contain"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap gap-6 lg:gap-16 justify-center text-sm font-semibold text-[#84282D] text-[16px]">
                    <Link to="/home" className="hover:text-red-400 transition-colors duration-200">Home</Link>
                    <Link to="/activate" className="hover:text-red-400 transition-colors duration-200">Activate Your Ticket</Link>
                    <Link to="/about" className="hover:text-red-400 transition-colors duration-200">About Us</Link>
                    <Link to="/contact" className="hover:text-red-400 transition-colors duration-200">Contact Us</Link>
                </nav>
            </div>
        </header>
    );
}
