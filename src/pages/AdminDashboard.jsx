import React, { useEffect, useState } from 'react';
import {
    FaTicketAlt, FaRegClipboard, FaTrophy, FaRandom, FaClipboardList,
    FaEnvelopeOpenText
} from 'react-icons/fa';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import ActivateTable from '../components/ActivateTable';
import DeclareTable from '../components/DeclareTable';
import WinningCombination from '../components/WinningCombination';
import AllCompetitions from '../components/AllCompetitions';
import ContactTable from '../components/ContactTable';
import ClaimTable from '../components/ClaimTable'; // ⬅️ Import at the top

import { loginAdmin } from '../api/api';

export default function AdminDashboard() {
    const [access, setAccess] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [tab, setTab] = useState('tickets');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (token) setAccess(true);
    }, [token]);

    const handleLogin = async () => {
        if (!email || !password) return setError('Please enter both email and password');
        setLoading(true);
        setError('');
        try {
            const result = await loginAdmin(email, password);
            setToken(result.token);
            localStorage.setItem('adminToken', result.token);
            setAccess(true);
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken('');
        setAccess(false);
        setEmail('');
        setPassword('');
    };

    if (!access) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Admin Login</h2>
                    {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
                    <input
                        type="email"
                        placeholder="Admin Email"
                        className="w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 mb-5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-60"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex">
            {/* Fixed Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'
                    } overflow-hidden z-20`}
            >
                <div className="h-full flex flex-col justify-between p-4">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-600 mb-6">Admin Panel</h2>
                        <nav className="flex flex-col gap-2 text-sm">
                            <SidebarButton icon={<FaTicketAlt />} label="All Tickets" tab="tickets" currentTab={tab} setTab={setTab} />
                            <SidebarButton icon={<FaRegClipboard />} label="All Activate Tickets" tab="Activate" currentTab={tab} setTab={setTab} />
                            <SidebarButton icon={<FaRegClipboard />} label="All Claim Tickets" tab="claims" currentTab={tab} setTab={setTab} />
                            <SidebarButton icon={<FaTrophy />} label="Declare" tab="winning" currentTab={tab} setTab={setTab} />
                            <SidebarButton icon={<FaRandom />} label="Winning Combo" tab="combination" currentTab={tab} setTab={setTab} />
                            <SidebarButton icon={<FaClipboardList />} label="Competitions" tab="all" currentTab={tab} setTab={setTab} />
                            <SidebarButton icon={<FaEnvelopeOpenText />} label="Contacts" tab="contacts" currentTab={tab} setTab={setTab} />
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content Area (adjusted for fixed sidebar) */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Top Header */}
                <AdminHeader handleLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Page Content */}
                <div className="p-6">
                    <div className="bg-white shadow rounded p-6">
                        {tab === 'tickets' && <AdminTable token={token} />}
                        {tab === 'Activate' && <ActivateTable token={token} />}
                        {tab === 'claims' && <ClaimTable token={token} />}
                        {tab === 'winning' && <DeclareTable token={token} />}
                        {tab === 'combination' && <WinningCombination token={token} />}
                        {tab === 'all' && <AllCompetitions token={token} />}
                        {tab === 'contacts' && <ContactTable token={token} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarButton({ icon, label, tab, currentTab, setTab }) {
    const isActive = currentTab === tab;
    return (
        <button
            onClick={() => setTab(tab)}
            className={`flex items-center gap-3 px-4 py-2 rounded transition-colors duration-150 ${isActive ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-200 text-gray-800'
                }`}
        >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
        </button>
    );
}
