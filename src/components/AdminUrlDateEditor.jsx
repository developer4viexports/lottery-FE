import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lottery.tenderbaba.com';

export default function AdminUrlDateEditor({ token }) {
    const [form, setForm] = useState({ url: '', date: '' });
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchUrlDate = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/api/url-date`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success && data.data) {
                setCurrent(data.data);
                setForm({ url: data.data.url || '', date: data.data.date || '' });
            }
        } catch (err) {
            console.error('Fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrlDate();
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

            // ✅ Normalize field names: convert `date` to `collectedAt`
            const payload = current
                ? { id: current.id, url: form.url, collectedAt: form.date }
                : { url: form.url, collectedAt: form.date };

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

            await fetchUrlDate();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className=" mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">🔗 Manage URL and Date</h2>
            {message && (
                <div className={`p-3 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">URL</label>
                    <input
                        type="url"
                        required
                        value={form.url}
                        onChange={e => handleChange('url', e.target.value)}
                        className="w-full border px-3 py-2 rounded focus:ring"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Date</label>
                    <input
                        type="date"
                        required
                        value={form.date}
                        onChange={e => handleChange('date', e.target.value)}
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
