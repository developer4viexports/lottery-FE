import React from "react";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-blue-800 shadow-md w-full">
            <div className=" mx-auto px-4 sm:px-6 lg:px-20 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide text-center md:text-left">
                    🎟️ TicketsNow
                </h1>
                <nav className="flex flex-wrap gap-6 lg:gap-16 justify-center text-white text-sm font-medium">
                    <Link to="/home" className="hover:text-blue-300 transition-colors">Home</Link>
                    <Link to="/winners" className="hover:text-blue-300 transition-colors">Winners</Link>
                    <Link to="/about" className="hover:text-blue-300 transition-colors">About</Link>
                    <Link to="/contact" className="hover:text-blue-300 transition-colors">Contact</Link>

                </nav>
            </div>
        </header>
    );
}
