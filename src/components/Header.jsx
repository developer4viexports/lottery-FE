import React from "react";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="w-full shadow-sm border-b border-white/20">
            <div className="mx-auto px-4 sm:px-6 lg:px-20 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white text-center md:text-left">
                    SHRILALMAHAL
                </h1>
                <nav className="flex flex-wrap gap-6 lg:gap-16 justify-center text-sm font-medium text-white">
                    <Link to="/home" className="hover:text-gray-300 transition-colors duration-200">Home</Link>
                    <Link to="/winners" className="hover:text-gray-300 transition-colors duration-200">Winners</Link>
                    <Link to="/about" className="hover:text-gray-300 transition-colors duration-200">About</Link>
                    <Link to="/contact" className="hover:text-gray-300 transition-colors duration-200">Contact</Link>
                </nav>
            </div>
        </header>
    );
}
