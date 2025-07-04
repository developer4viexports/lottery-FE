import React, { useEffect, useState } from 'react';
import AdminTable from '../components/AdminTable';
import ClaimTable from '../components/ClaimTable';
import WinningTable from '../components/WinningTable';
import { loginAdmin } from '../api/api'; // 🔐 API call for login

export default function AdminDashboard() {
    const [access, setAccess] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [tab, setTab] = useState('tickets');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            setAccess(true);
        }
    }, [token]);

    const handleLogin = async () => {
        if (!email || !password) {
            return setError('Please enter both email and password');
        }

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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-all duration-200 disabled:opacity-60"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => setTab('tickets')}
                        className={`px-4 py-2 rounded font-medium ${tab === 'tickets' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        🎫 All Tickets
                    </button>
                    <button
                        onClick={() => setTab('claims')}
                        className={`px-4 py-2 rounded font-medium ${tab === 'claims' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        🧾 All Claims
                    </button>
                    <button
                        onClick={() => setTab('winning')}
                        className={`px-4 py-2 rounded font-medium ${tab === 'winning' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        🏆 Winning Tickets
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            <div className="bg-white shadow rounded p-4">
                {tab === 'tickets' && <AdminTable token={token} />}
                {tab === 'claims' && <ClaimTable token={token} />}
                {tab === 'winning' && <WinningTable token={token} />}
            </div>
        </div>
    );
}
