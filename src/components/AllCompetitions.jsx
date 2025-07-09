import React, { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AllCompetitions({ token }) {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [claims, setClaims] = useState([]);

    const fetchCompetitions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/winning-combo/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch');
            setCompetitions(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetails = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/winning-combo/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Details fetch failed');

            setSelectedCompetition(data.data.competition);
            setTickets(data.data.tickets);
            setClaims(data.data.claims);
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">📋 All Competitions</h3>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {loading ? (
                <p>Loading competitions...</p>
            ) : competitions.length === 0 ? (
                <p>No competitions yet.</p>
            ) : (
                <div className="overflow-x-auto mb-8">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Numbers</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Start</th>
                                <th className="p-2 border">End</th>
                                <th className="p-2 border">Grand</th>
                                <th className="p-2 border">Silver</th>
                                <th className="p-2 border">Bronze</th>
                                <th className="p-2 border">Consolation</th>
                                <th className="p-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {competitions.map((comp) => (
                                <tr key={comp.id}>
                                    <td className="p-2 border">{comp.id}</td>
                                    <td className="p-2 border">{comp.numbers?.join(', ')}</td>
                                    <td className="p-2 border capitalize">{comp.status}</td>
                                    <td className="p-2 border">{comp.startDate}</td>
                                    <td className="p-2 border">{comp.endDate}</td>
                                    <td className="p-2 border">{comp.grandQuota}</td>
                                    <td className="p-2 border">{comp.silverQuota}</td>
                                    <td className="p-2 border">{comp.bronzeQuota}</td>
                                    <td className="p-2 border">{comp.consolationQuota}</td>
                                    <td className="p-2 border">
                                        <button
                                            onClick={() => fetchDetails(comp.id)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedCompetition && (
                <div className="bg-white shadow-md p-6 rounded-md border">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-xl font-bold mb-2">
                                📄 Competition #{selectedCompetition.id} Details
                            </h4>
                            <p><strong>Status:</strong> {selectedCompetition.status}</p>
                            <p><strong>Start Date:</strong> {selectedCompetition.startDate}</p>
                            <p><strong>End Date:</strong> {selectedCompetition.endDate}</p>
                            <p><strong>Numbers:</strong> {selectedCompetition.numbers.join(', ')}</p>
                            <p><strong>Grand Quota:</strong> {selectedCompetition.grandQuota}</p>
                            <p><strong>Silver Quota:</strong> {selectedCompetition.silverQuota}</p>
                            <p><strong>Bronze Quota:</strong> {selectedCompetition.bronzeQuota}</p>
                            <p><strong>Consolation Quota:</strong> {selectedCompetition.consolationQuota}</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedCompetition(null);
                                setTickets([]);
                                setClaims([]);
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Close ✖️
                        </button>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-2">🎫 Tickets</h4>
                        {tickets.length === 0 ? (
                            <p className="text-gray-500">No tickets found.</p>
                        ) : (
                            <div className="overflow-x-auto mb-4">
                                <table className="min-w-full border">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 border">Ticket ID</th>
                                            <th className="p-2 border">Email</th>
                                            <th className="p-2 border">Phone</th>
                                            <th className="p-2 border">Numbers</th>
                                            <th className="p-2 border">Prize</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((t) => (
                                            <tr key={t.id}>
                                                <td className="p-2 border">{t.ticketID}</td>
                                                <td className="p-2 border">{t.email}</td>
                                                <td className="p-2 border">{t.phone}</td>
                                                <td className="p-2 border">{t.numbers?.join(', ')}</td>
                                                <td className="p-2 border">{t.prizeType || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <h4 className="text-lg font-semibold mb-2">📩 Claims</h4>
                        {claims.length === 0 ? (
                            <p className="text-gray-500">No claims found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 border">Claim ID</th>
                                            <th className="p-2 border">Ticket ID</th>
                                            <th className="p-2 border">Name</th>
                                            <th className="p-2 border">Email</th>
                                            <th className="p-2 border">Phone</th>
                                            <th className="p-2 border">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {claims.map((c) => (
                                            <tr key={c.id}>
                                                <td className="p-2 border">{c.id}</td>
                                                <td className="p-2 border">{c.ticketID}</td>
                                                <td className="p-2 border">{c.name}</td>
                                                <td className="p-2 border">{c.email}</td>
                                                <td className="p-2 border">{c.phone}</td>
                                                <td className="p-2 border capitalize">{c.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
