import React, { useState, useEffect } from 'react';
import AdminUrlDateEditor from './AdminUrlDateEditor';

function generateTicketNumbers() {
    const nums = new Set();
    while (nums.size < 7) {
        const n = Math.floor(Math.random() * 100);
        nums.add(n.toString().padStart(2, '0'));
    }
    return [...nums];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lottery.tenderbaba.com/api';

export default function WinningCombination({ token }) {
    const [formData, setFormData] = useState({
        grandQuota: '',
        silverQuota: '',
        bronzeQuota: '',
        consolationQuota: '',
        totalParticipants: '',
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
                fetch(`${BASE_URL}/winning-combo/latest`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/winning-combo/winners`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            const [comboData, winnersData] = await Promise.all([comboRes.json(), winnersRes.json()]);

            if (comboRes.ok && comboData.success) {
                const combo = comboData.data;
                setCurrentCombination(combo);
                setFormData({
                    grandQuota: combo.grandQuota,
                    silverQuota: combo.silverQuota,
                    bronzeQuota: combo.bronzeQuota,
                    consolationQuota: combo.consolationQuota,
                    totalParticipants: combo.totalParticipants,
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

    useEffect(() => { fetchData(); }, []);

    const handleQuotaChange = (field, value) => {
        if (currentCombination && currentCombination.status === 'active') return;
        setFormData(prev => ({
            ...prev,
            [field]: value === '' ? '' : Math.max(0, parseInt(value) || 0)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!formData.totalParticipants || parseInt(formData.totalParticipants) <= 0) {
                throw new Error('Total Participants must be a positive number.');
            }

            if (currentCombination?.status === 'active' && !isEditing) {
                throw new Error('An active competition already exists. End it before creating a new one.');
            }

            const numbers = isEditing && currentCombination
                ? currentCombination.numbers
                : generateTicketNumbers();

            const res = await fetch(`${BASE_URL}/winning-combo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, numbers })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to process');

            setSuccess(`Winning combination ${isEditing ? 'updated' : 'created'} successfully!`);
            setIsEditing(false);
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
            const res = await fetch(`${BASE_URL}/winning-combo/end`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to end competition');
            setSuccess('Competition ended manually.');
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
                totalParticipants: currentCombination.totalParticipants,
                startDate: currentCombination.startDate,
                endDate: currentCombination.endDate
            });
        }
    };

    const renderNumberBubbles = () =>
        currentCombination?.numbers.map((num, i) => (
            <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm">
                {num}
            </span>
        ));

    const renderQuotaField = (label, field) => (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="number"
                min="1"
                value={formData[field]}
                onChange={(e) => handleQuotaChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
                disabled={currentCombination?.status === 'active'}
            />
        </div>
    );

    const renderWinnersTable = (prizeType, winnersList) => (
        <div key={prizeType} className="mb-8">
            <h4 className="text-md font-semibold text-gray-700 mb-3">{prizeType} Prize Winners ({winnersList.length})</h4>
            {winnersList.length > 0 ? (
                <div className="overflow-auto border rounded shadow-sm">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 border-b">Ticket ID</th>
                                <th className="p-3 border-b">Name</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Phone</th>
                                <th className="p-3 border-b">Numbers</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {winnersList.map((w, i) => (
                                <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                                    <td className="p-3 border-b">{w.ticketID}</td>
                                    <td className="p-3 border-b">{w.name}</td>
                                    <td className="p-3 border-b">{w.email}</td>
                                    <td className="p-3 border-b">{w.phone}</td>
                                    <td className="p-3 border-b">{w.numbers?.join(' ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <p className="text-gray-500 italic">No {prizeType.toLowerCase()} winners yet.</p>}
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 text-gray-800">
            <div>
                <h1 className="text-3xl font-bold mb-2">🎯 Manage Winning Combination</h1>
                <p className="text-gray-600">Create or edit winning combinations and review winners.</p>
            </div>

            {error && <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">{error}</div>}
            {success && <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow-md space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Current Combination</h2>
                        {currentCombination && !isEditing && (
                            <div className="flex gap-3">
                                <button onClick={handleEdit} className="text-blue-600 hover:underline">Edit</button>
                                <button onClick={handleEndManually} className="text-red-600 hover:underline">End</button>
                            </div>
                        )}
                    </div>

                    {currentCombination ? (
                        <>
                            <div className="flex flex-wrap gap-2">{renderNumberBubbles()}</div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p>Grand</p><p className="font-bold">{currentCombination.grandQuota}</p></div>
                                <div><p>Silver</p><p className="font-bold">{currentCombination.silverQuota}</p></div>
                                <div><p>Bronze</p><p className="font-bold">{currentCombination.bronzeQuota}</p></div>
                                <div><p>Consolation</p><p className="font-bold">{currentCombination.consolationQuota}</p></div>
                                <div><p>Total Participants</p><p className="font-bold">{currentCombination.totalParticipants}</p></div>
                                <div><p>Start</p><p className="font-bold">{currentCombination.startDate}</p></div>
                                <div><p>End</p><p className="font-bold">{currentCombination.endDate}</p></div>
                                <div className="col-span-2">
                                    <p>Status</p>
                                    <p className={`font-bold ${currentCombination.status === 'ended' ? 'text-red-600' : 'text-green-600'}`}>
                                        {currentCombination.status}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : <p className="text-gray-500">No combination set.</p>}
                </div>

                <div className="bg-white p-6 rounded shadow-md space-y-4">
                    <h2 className="text-xl font-semibold">{isEditing ? 'Edit Combination' : currentCombination ? 'Replace Combination' : 'Create New Combination'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {renderQuotaField('Grand Quota', 'grandQuota')}
                            {renderQuotaField('Silver Quota', 'silverQuota')}
                            {renderQuotaField('Bronze Quota', 'bronzeQuota')}
                            {renderQuotaField('Consolation Quota', 'consolationQuota')}
                            {renderQuotaField('Total Participants', 'totalParticipants')}
                            <div>
                                <label className="text-sm font-medium block mb-1">Start Date</label>
                                <input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} required className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">End Date</label>
                                <input type="date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} required className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition">
                                {loading ? 'Processing...' : isEditing ? 'Update' : 'Create'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={handleCancelEdit} className="bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300 transition">Cancel</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <AdminUrlDateEditor token={token} />

            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">🎉 Current Winners</h2>
                {Object.entries(winners).map(([type, list]) => renderWinnersTable(type, list))}
                {Object.values(winners).flat().length === 0 && (
                    <p className="text-gray-500 italic">No winners yet.</p>
                )}
            </div>
        </div>
    );
}
