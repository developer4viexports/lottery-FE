import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function CompetitionDetails() {
    const { id } = useParams(); // Get the competition ID from the URL
    const navigate = useNavigate(); // Hook to navigate to the next page
    const [competition, setCompetition] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [winningTickets, setWinningTickets] = useState({ grand: [], silver: [], bronze: [], consolation: [] });
    const token = localStorage.getItem('adminToken');

    // Fetch competition details based on the competition ID
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (!token) {
                    setError('Not authorized');
                    return;
                }
                const res = await fetch(`${BASE_URL}/api/winning-combo/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch competition details');
                setCompetition(data.data.competition);
                setTickets(data.data.tickets);
                setClaims(data.data.claims);

                // Separate winning tickets by prize type
                const categorizedTickets = {
                    grand: data.data.tickets.filter(ticket => ticket.prizeType === 'Grand'),
                    silver: data.data.tickets.filter(ticket => ticket.prizeType === 'Silver'),
                    bronze: data.data.tickets.filter(ticket => ticket.prizeType === 'Bronze'),
                    consolation: data.data.tickets.filter(ticket => ticket.prizeType === 'Consolation')
                };
                setWinningTickets(categorizedTickets);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, token]);

    if (loading) return <p>Loading competition details...</p>;

    if (error) return <p className="text-red-600">{error}</p>;

    const handleViewAllTickets = () => {
        navigate(`/competition/${id}/all-tickets`); // Navigate to the new page with all tickets and claims
    };

    const renderWinningTicketsTable = (tickets, prizeType) => {
        return (
            <div className="mt-6 mb-6">
                <h4 className="text-lg font-semibold mb-2">{prizeType} Winners</h4>
                {tickets.length === 0 ? (
                    <p className="text-gray-500">No {prizeType} winners found.</p>
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
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td className="p-2 border">{ticket.ticketID}</td>
                                        <td className="p-2 border">{ticket.email}</td>
                                        <td className="p-2 border">{ticket.phone}</td>
                                        <td className="p-2 border">{ticket.numbers?.join(', ')}</td>
                                        <td className="p-2 border">{ticket.prizeType || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Competition #{competition.id} Details</h3>

            {/* Competition details */}
            <div className="mb-6">
                <p><strong>Status:</strong> {competition.status}</p>
                <p><strong>Start Date:</strong> {competition.startDate}</p>
                <p><strong>End Date:</strong> {competition.endDate}</p>
                <p><strong>Numbers:</strong> {competition.numbers?.join(', ')}</p>
                <p><strong>Grand Quota:</strong> {competition.grandQuota}</p>
                <p><strong>Silver Quota:</strong> {competition.silverQuota}</p>
                <p><strong>Bronze Quota:</strong> {competition.bronzeQuota}</p>
                <p><strong>Consolation Quota:</strong> {competition.consolationQuota}</p>
            </div>

            {/* Display tables for each prize category */}
            {renderWinningTicketsTable(winningTickets.grand, 'Grand')}
            {renderWinningTicketsTable(winningTickets.silver, 'Silver')}
            {renderWinningTicketsTable(winningTickets.bronze, 'Bronze')}
            {renderWinningTicketsTable(winningTickets.consolation, 'Consolation')}

            <button
                onClick={handleViewAllTickets}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                View All Tickets and Claims
            </button>
        </div>
    );
}
