import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function AllCompetitions({ token }) {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [claims, setClaims] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

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
        // This will be removed because we are now using navigation
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

    const handleViewCompetition = (id) => {
        navigate(`/competition/${id}`); // Navigate to the competition details page
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
                                            onClick={() => handleViewCompetition(comp.id)} // Handle the view button click
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
        </div>
    );
}
