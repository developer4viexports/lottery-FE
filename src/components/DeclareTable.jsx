import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:5000/api';

export default function DeclareTable({ token }) {
    const [winners, setWinners] = useState([]);
    const [form, setForm] = useState({ ticketID: '', id: null });
    const [rows, setRows] = useState([
        { matchType: '7/7', regular: '', super: '' },
        { matchType: '6/7', regular: '', super: '' },
        { matchType: '5/7', regular: '', super: '' },
        { matchType: '4/7', regular: '', super: '' },
        { matchType: 'Bonus Entry', regular: '', super: '' },
    ]);
    const [loading, setLoading] = useState(false);

    // Fetch Winners
    const fetchWinners = async () => {
        try {
            const res = await fetch(`${BASE_URL}/winners`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setWinners(data.data.map(w => ({ ...w, id: w._id || w.id })));
            } else {
                throw new Error(data.message || 'Failed to fetch winners');
            }
        } catch (err) {
            alert('Error fetching winners: ' + err.message);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchWinners();

        // Fetch Prize Tiers
        fetch(`${BASE_URL}/prize-tiers`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const updated = rows.map(row => {
                        const reg = data.find(p => p.matchType === row.matchType && p.ticketType === 'regular');
                        const sup = data.find(p => p.matchType === row.matchType && p.ticketType === 'super');
                        return {
                            ...row,
                            regular: reg?.prize || '',
                            super: sup?.prize || '',
                        };
                    });
                    setRows(updated);
                }
            });
    }, [token]);

    // Handle Winner Submit
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const method = form.id ? 'PUT' : 'POST';
            const url = form.id ? `${BASE_URL}/winners/${form.id}` : `${BASE_URL}/winners`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: 'N/A',
                    ticketID: form.ticketID,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Save failed');

            await fetchWinners();
            setForm({ ticketID: '', id: null });
        } catch (err) {
            alert('Error submitting winner: ' + err.message);
        }
    };

    const handleEdit = winner => {
        setForm({ ticketID: winner.ticketID, id: winner.id });
    };

    const handleDelete = async id => {
        if (!window.confirm('Are you sure you want to delete this winner?')) return;
        try {
            const res = await fetch(`${BASE_URL}/winners/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Delete failed');
            setWinners(winners.filter(w => w.id !== id));
        } catch (err) {
            alert('Error deleting winner: ' + err.message);
        }
    };

    // Prize Tier Handlers
    const handleChange = (index, field, value) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            for (const row of rows) {
                await Promise.all([
                    fetch(`${BASE_URL}/prize-tiers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            matchType: row.matchType,
                            ticketType: 'regular',
                            prize: row.regular,
                        }),
                    }),
                    fetch(`${BASE_URL}/prize-tiers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            matchType: row.matchType,
                            ticketType: 'super',
                            prize: row.super,
                        }),
                    }),
                ]);
            }
            alert('Prizes saved successfully!');
        } catch (err) {
            alert('Error saving prize tiers: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24">
            {/* WINNING TICKETS SECTION */}
            <div className="p-6 sm:p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">🎫 Manage Winning Tickets</h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 items-end"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Number</label>
                        <input
                            type="text"
                            value={form.ticketID}
                            onChange={e => setForm({ ...form, ticketID: e.target.value })}
                            placeholder="e.g. 03 58 13 62 48 73 90"
                            className="w-full border px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="h-10 bg-blue-600 text-white rounded-md px-6 hover:bg-blue-700 transition"
                    >
                        {form.id ? 'Update' : 'Add'}
                    </button>
                </form>

                {winners.length === 0 ? (
                    <p className="text-center text-gray-500 italic">No winning tickets added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {winners.map(w => (
                            <div
                                key={w.id}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 bg-gray-50 p-4 rounded-md shadow-sm"
                            >
                                <div className="text-gray-900 font-medium text-base">
                                    <span className="block sm:inline text-blue-700 font-mono">{w.ticketID}</span>
                                </div>
                                <div className="flex mt-2 sm:mt-0 gap-3">
                                    <button
                                        onClick={() => handleEdit(w)}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(w.id)}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PRIZE DECLARATION SECTION */}
            <div className="p-6 max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-700">🏆 Set Prize Tiers</h2>
                <table className="w-full table-auto border border-gray-300 mb-4">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="border px-4 py-2">Match Type</th>
                            <th className="border px-4 py-2">Regular Ticket Prize</th>
                            <th className="border px-4 py-2">SuperTicket Prize</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={row.matchType}>
                                <td className="border px-4 py-2 font-semibold">{row.matchType}</td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="text"
                                        value={row.regular}
                                        onChange={e => handleChange(idx, 'regular', e.target.value)}
                                        className="w-full border px-2 py-1 rounded"
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="text"
                                        value={row.super}
                                        onChange={e => handleChange(idx, 'super', e.target.value)}
                                        className="w-full border px-2 py-1 rounded"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    {loading ? 'Saving...' : 'Save All Prizes'}
                </button>
            </div>
        </div>
    );
}
