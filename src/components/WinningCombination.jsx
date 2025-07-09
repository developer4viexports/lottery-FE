import React, { useState, useEffect } from 'react';

function generateTicketNumbers() {
    const nums = new Set();
    while (nums.size < 7) {
        const n = Math.floor(Math.random() * 100);
        nums.add(n.toString().padStart(2, '0'));
    }
    return [...nums];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lottery.tenderbaba.com';

export default function WinningCombination({ token }) {
    const [formData, setFormData] = useState({
        grandQuota: 1,
        silverQuota: 3,
        bronzeQuota: 5,
        consolationQuota: 10,
        startDate: '',
        endDate: ''
    });
    const [currentCombination, setCurrentCombination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [winners, setWinners] = useState({
        Grand: [],
        Silver: [],
        Bronze: [],
        Consolation: []
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        if (!token) return setError("Token missing or expired");
        try {
            setLoading(true);
            const [comboRes, winnersRes] = await Promise.all([
                fetch(`${BASE_URL}/api/winning-combo/latest`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/api/winning-combo/winners`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const [comboData, winnersData] = await Promise.all([
                comboRes.json(),
                winnersRes.json()
            ]);

            if (comboRes.ok && comboData.success) {
                const combo = comboData.data;
                setCurrentCombination(combo);
                setFormData({
                    grandQuota: combo.grandQuota,
                    silverQuota: combo.silverQuota,
                    bronzeQuota: combo.bronzeQuota,
                    consolationQuota: combo.consolationQuota,
                    startDate: combo.startDate || '',
                    endDate: combo.endDate || ''
                });
            }

            if (winnersRes.ok && winnersData.success) {
                setWinners(winnersData.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuotaChange = (field, value) => {
        const numValue = parseInt(value);
        setFormData(prev => ({
            ...prev,
            [field]: isNaN(numValue) ? 0 : Math.max(0, numValue)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (currentCombination?.status === 'active' && !isEditing) {
                throw new Error('An active competition already exists. End it first before creating a new one.');
            }

            const numbers = isEditing && currentCombination
                ? currentCombination.numbers
                : generateTicketNumbers();

            const res = await fetch(`${BASE_URL}/api/winning-combo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, numbers })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Operation failed');

            setSuccess(`Winning combination ${isEditing ? 'updated' : 'created'} successfully!`);
            setIsEditing(false);
            await fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete the current winning combination?')) return;

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/winning-combo`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Deletion failed');

            setSuccess('Winning combination deleted successfully!');
            setCurrentCombination(null);
            await fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEndManually = async () => {
        if (!window.confirm('End this competition manually?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/winning-combo/end`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to end competition');
            setSuccess('Competition manually ended successfully!');
            await fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        if (currentCombination) setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (currentCombination) {
            setFormData({
                grandQuota: currentCombination.grandQuota,
                silverQuota: currentCombination.silverQuota,
                bronzeQuota: currentCombination.bronzeQuota,
                consolationQuota: currentCombination.consolationQuota,
                startDate: currentCombination.startDate,
                endDate: currentCombination.endDate
            });
        }
    };

    const renderNumberBubbles = () => currentCombination?.numbers.map((num, i) => (
        <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg font-bold">
            {num}
        </span>
    ));

    const renderQuotaField = (label, field) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="number"
                min="1"
                value={formData[field]}
                onChange={(e) => handleQuotaChange(field, e.target.value)}
                className="border rounded p-2 w-full"
                required
            />
        </div>
    );

    const renderWinnersTable = (prizeType, winnersList) => (
        <div key={prizeType} className="mb-6">
            <h4 className="font-medium text-lg mb-2">
                {prizeType} Prize Winners ({winnersList.length})
            </h4>
            {winnersList.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Ticket ID</th>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Phone</th>
                                <th className="p-2 border">Numbers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {winnersList.map((winner, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-2 border">{winner.ticketID}</td>
                                    <td className="p-2 border">{winner.name}</td>
                                    <td className="p-2 border">{winner.email}</td>
                                    <td className="p-2 border">{winner.phone}</td>
                                    <td className="p-2 border">{winner.numbers.join(' ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">No {prizeType.toLowerCase()} prize winners yet</p>
            )}
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">🎯 Manage Winning Combination</h2>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
            {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Current Combination</h3>
                        {currentCombination && !isEditing && (
                            <div className="flex gap-2">
                                <button onClick={handleEdit} className="text-blue-600 text-sm" disabled={loading}>Edit</button>
                                <button onClick={handleEndManually} className="text-orange-600 text-sm" disabled={loading || currentCombination.status === 'ended'}>End</button>
                                <button onClick={handleDelete} className="text-red-600 text-sm" disabled={loading}>Delete</button>
                            </div>
                        )}
                    </div>
                    {currentCombination ? (
                        <div>
                            <div className="flex flex-wrap gap-2 mb-4">{renderNumberBubbles()}</div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-gray-500">Grand</p><p className="font-bold">{currentCombination.grandQuota}</p></div>
                                <div><p className="text-gray-500">Silver</p><p className="font-bold">{currentCombination.silverQuota}</p></div>
                                <div><p className="text-gray-500">Bronze</p><p className="font-bold">{currentCombination.bronzeQuota}</p></div>
                                <div><p className="text-gray-500">Consolation</p><p className="font-bold">{currentCombination.consolationQuota}</p></div>
                                <div><p className="text-gray-500">Start</p><p className="font-bold">{currentCombination.startDate}</p></div>
                                <div><p className="text-gray-500">End</p><p className="font-bold">{currentCombination.endDate}</p></div>
                                <div className="col-span-2"><p className="text-gray-500">Status</p><p className={`font-bold ${currentCombination.status === 'ended' ? 'text-red-600' : 'text-green-600'}`}>{currentCombination.status.toUpperCase()}</p></div>
                            </div>
                        </div>
                    ) : <p className="text-gray-500">No combination set yet</p>}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {isEditing ? 'Edit Quotas' : currentCombination ? 'Replace Combination' : 'Create New Combination'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <p className="text-sm text-gray-700 mb-4">
                            {isEditing
                                ? 'Edit the prize quotas and duration'
                                : currentCombination
                                    ? 'This will generate new numbers and replace the current combination'
                                    : 'Winning numbers will be generated randomly'}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {renderQuotaField('Grand Prize Quota', 'grandQuota')}
                            {renderQuotaField('Silver Prize Quota', 'silverQuota')}
                            {renderQuotaField('Bronze Prize Quota', 'bronzeQuota')}
                            {renderQuotaField('Consolation Quota', 'consolationQuota')}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">
                                {loading ? (isEditing ? 'Updating...' : 'Processing...') : isEditing ? 'Update' : currentCombination ? 'Update' : 'Create'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={handleCancelEdit} className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300" disabled={loading}>Cancel</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Current Winners</h3>
                {Object.entries(winners).map(([prizeType, winnersList]) => renderWinnersTable(prizeType, winnersList))}
                {Object.values(winners).flat().length === 0 && (
                    <p className="text-gray-500 mt-2">No winners yet.</p>
                )}
            </div>
        </div>
    );
}
