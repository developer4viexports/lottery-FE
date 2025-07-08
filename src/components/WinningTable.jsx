import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:5000/api';

export default function WinningTable({ token }) {
    const [winners, setWinners] = useState([]);
    const [form, setForm] = useState({ name: '', ticketID: '', id: null });

    const fetchWinners = async () => {
        try {
            const res = await fetch(`${BASE_URL}/winners`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

    useEffect(() => {
        fetchWinners();
    }, []);

    const handleSubmit = async (e) => {
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
                    name: form.name,
                    ticketID: form.ticketID,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Save failed');

            await fetchWinners();
            setForm({ name: '', ticketID: '', id: null });
        } catch (err) {
            alert('Error submitting winner: ' + err.message);
        }
    };

    const handleEdit = (winner) => {
        setForm({ name: winner.name, ticketID: winner.ticketID, id: winner.id });
    };

    const handleDelete = async (id) => {
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

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">🎫 Manage Winning Tickets</h2>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 items-end"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Winner Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Aman Kumar"
                        className="w-full border px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ticket ID</label>
                    <input
                        type="text"
                        value={form.ticketID}
                        onChange={e => setForm({ ...form, ticketID: e.target.value })}
                        placeholder="e.g. SLM-123456"
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

            {/* Winner List */}
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
                                <span className="block sm:inline">{w.name}</span>
                                <span className="block sm:inline text-blue-700 font-mono sm:ml-2">({w.ticketID})</span>
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
    );
}
