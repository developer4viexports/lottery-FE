import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AdminUrlDateEditor({ token }) {
    const [form, setForm] = useState({
        url: '',
        startDate: '',
        revealDate: '',
        endDate: ''
    });
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchUrlData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/api/url-date`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success && data.data) {
                setCurrent(data.data);
                setForm({
                    url: data.data.url || '',
                    startDate: data.data.startDate || '',
                    revealDate: data.data.revealDate || '',
                    endDate: data.data.endDate || '',
                });
            }
        } catch (err) {
            console.error('Fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrlData();
    }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const method = current ? 'PUT' : 'POST';

            const payload = {
                url: form.url,
                startDate: form.startDate,
                revealDate: form.revealDate,
                endDate: form.endDate,
            };

            const res = await fetch(`${BASE_URL}/api/url-date`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save');

            setMessage({
                type: 'success',
                text: current ? 'Updated successfully' : 'Created successfully',
            });

            await fetchUrlData();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded shadow max-w-xl">
            <h2 className="text-2xl font-bold mb-4">🔗 Manage URL and Dates</h2>

            {message && (
                <div className={`p-3 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Instagram Post URL</label>
                    <input
                        type="url"
                        required
                        value={form.url}
                        onChange={e => handleChange('url', e.target.value)}
                        className="w-full border px-3 py-2 rounded focus:ring"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        required
                        value={form.startDate}
                        onChange={e => handleChange('startDate', e.target.value)}
                        className="w-full border px-3 py-2 rounded focus:ring"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Reveal Date</label>
                    <input
                        type="date"
                        required
                        value={form.revealDate}
                        onChange={e => handleChange('revealDate', e.target.value)}
                        className="w-full border px-3 py-2 rounded focus:ring"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        required
                        value={form.endDate}
                        onChange={e => handleChange('endDate', e.target.value)}
                        className="w-full border px-3 py-2 rounded focus:ring"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                    {loading ? 'Saving...' : current ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
}
