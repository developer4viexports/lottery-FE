import React, { useState } from 'react';
import { FaBell, FaSignOutAlt, FaUserCircle, FaBars } from 'react-icons/fa';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export default function AdminHeader({ handleLogout, sidebarOpen, setSidebarOpen }) {
    const [isDark, setIsDark] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleTheme = () => setIsDark(!isDark);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <header className="bg-white shadow px-6 py-3 flex justify-between items-center relative z-10">
            {/* Sidebar Toggle */}
            <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded"
            >
                <FaBars />
            </button>

            {/* Right-side Controls */}
            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200">
                    {isDark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
                </button>

                <button className="p-2 rounded-full hover:bg-gray-200">
                    <FaBell className="text-xl" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-yellow-500 text-white flex items-center justify-center"
                    >
                        <FaUserCircle className="text-xl" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded">
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">Profile</button>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
