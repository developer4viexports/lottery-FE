import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function CompetitionAllDetails() {
    const { id } = useParams(); // Get the competition ID from the URL
    const [competition, setCompetition] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [claims, setClaims] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' or 'claims'
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null); // Define previewUrl state here

    // Define formatDateTime function here
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    useEffect(() => {
        const fetchDetails = async () => {
            // Get token from localStorage
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError('Not authorized');
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/api/winning-combo/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch competition details');
                setCompetition(data.data.competition);
                setTickets(data.data.tickets);
                setClaims(data.data.claims);
                setFilteredTickets(data.data.tickets);
                setFilteredClaims(data.data.claims);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleFilter = () => {
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        // Filter Tickets
        const filteredTickets = tickets.filter(ticket => {
            const created = new Date(ticket.createdAt);
            if (from && created < from) return false;
            if (to && created > to) return false;

            const combined = (
                ticket.name +
                ticket.email +
                ticket.phone +
                ticket.ticketID +
                ticket.numbers?.join('')
            ).toLowerCase();

            return combined.includes(searchTerm.toLowerCase());
        });

        // Filter Claims
        const filteredClaims = claims.filter(claim => {
            const created = new Date(claim.createdAt);
            if (from && created < from) return false;
            if (to && created > to) return false;

            const text = (
                claim.ticketID +
                claim.name +
                claim.email +
                claim.phone +
                claim.instagram +
                claim.countryCode
            ).toLowerCase();

            return text.includes(searchTerm.toLowerCase());
        });

        setFilteredTickets(filteredTickets);
        setFilteredClaims(filteredClaims);
    };

    const downloadExcel = (type) => {
        const formatted = (type === 'tickets' ? filteredTickets : filteredClaims).map((item, i) => ({
            "S. No": i + 1,
            ...(type === 'tickets' ? {
                Name: item.name,
                Email: item.email,
                Phone: item.phone,
                TicketID: item.ticketID,
                Numbers: item.numbers?.join(' '),
                SuperTicket: item.isSuperTicket ? 'Yes' : 'No',
                Prize: item.prizeType || '-',
                Issued: item.issueDate || '-',
                Expiry: item.expiryDate || '-',
                FollowProof: item.followProof ? BASE_URL + item.followProof : '',
                PurchaseProof: item.purchaseProof ? BASE_URL + item.purchaseProof : '',
                TicketImageURL: item.ticketImage ? BASE_URL + item.ticketImage : '',

            } : {
                TicketID: item.ticketID,
                Name: item.name,
                Email: item.email,
                Phone: item.phone,
                CountryCode: item.countryCode,
                Instagram: item.instagram,
                TicketImageURL: item.ticketImage || '',
                ProofImageURL: item.proofImage || '',
                SubmittedAt: item.createdAt,
            })
        }));

        const ws = XLSX.utils.json_to_sheet(formatted);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, type.charAt(0).toUpperCase() + type.slice(1));
        XLSX.writeFile(wb, `${type}.xlsx`);
    };

    if (loading) return <p>Loading competition details...</p>;

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Competition #{competition.id} Details</h3>

            {/* Tabs for Tickets and Claims */}
            <div className="mb-6">
                <div className="flex mb-4">
                    <button
                        className={`px-4 py-2 mr-2 ${activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleTabChange('tickets')}
                    >
                        Tickets
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'claims' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleTabChange('claims')}
                    >
                        Claims
                    </button>
                </div>

                {/* Filters + Download */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div>
                            <label className="text-sm block mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search name, email, ticket ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border px-3 py-1 rounded shadow-sm w-64"
                            />
                        </div>
                        <div>
                            <label className="text-sm block mb-1">From Date</label>
                            <input
                                type="datetime-local"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border px-3 py-1 rounded shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm block mb-1">To Date</label>
                            <input
                                type="datetime-local"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border px-3 py-1 rounded shadow-sm"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => downloadExcel(activeTab)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 h-10"
                    >
                        Download Excel
                    </button>
                </div>

                {/* Table Rendering based on Active Tab */}
                {activeTab === 'tickets' ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-2 border">S. No</th>
                                    <th className="p-2 border">Name</th>
                                    <th className="p-2 border">Email</th>
                                    <th className="p-2 border">Phone</th>
                                    <th className="p-2 border">Ticket ID</th>
                                    <th className="p-2 border">Numbers</th>
                                    <th className="p-2 border">Super</th>
                                    <th className="p-2 border">Prize</th>
                                    <th className="p-2 border">Issued</th>
                                    <th className="p-2 border">Expiry</th>
                                    <th className="p-2 border">Proof</th>
                                    <th className="p-2 border">Follow Proof</th>
                                    <th className="p-2 border">Purchase Proof</th>
                                    <th className="p-2 border">Ticket Image</th> {/* ✅ New column */}
                                    <th className="p-2 border">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-2 border">{i + 1}</td>
                                        <td className="p-2 border">{ticket.name}</td>
                                        <td className="p-2 border">{ticket.email}</td>
                                        <td className="p-2 border">{ticket.phone}</td>
                                        <td className="p-2 border">{ticket.ticketID}</td>
                                        <td className="p-2 border">{ticket.numbers?.join(' ')}</td>
                                        <td className="p-2 border">{ticket.isSuperTicket ? 'Yes' : 'No'}</td>
                                        <td className="p-2 border">{ticket.prizeType || '-'}</td>
                                        <td className="p-2 border">{ticket.issueDate}</td>
                                        <td className="p-2 border">{ticket.expiryDate}</td>

                                        {['proofImage', 'followProof', 'purchaseProof'].map((key, j) => (
                                            <td key={j} className="p-2 border">
                                                {ticket[key] ? (
                                                    <button
                                                        onClick={() => setPreviewUrl(BASE_URL + ticket[key])}
                                                        className="text-blue-600 underline hover:text-blue-800"
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 italic">No file</span>
                                                )}
                                            </td>
                                        ))}

                                        {/* ✅ Ticket image column */}
                                        <td className="p-2 border">
                                            {ticket.ticketImage ? (
                                                <button
                                                    onClick={() => setPreviewUrl(BASE_URL + ticket.ticketImage)}
                                                    className="text-blue-600 underline hover:text-blue-800"
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 italic">No image</span>
                                            )}
                                        </td>

                                        <td className="p-2 border">{formatDateTime(ticket.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-2 border">S. No</th>
                                    <th className="p-2 border">Ticket ID</th>
                                    <th className="p-2 border">Name</th>
                                    <th className="p-2 border">Email</th>
                                    <th className="p-2 border">Phone</th>
                                    {/* <th className="p-2 border">Country</th> */}
                                    <th className="p-2 border">Instagram</th>
                                    <th className="p-2 border">Ticket File</th>
                                    <th className="p-2 border">Proof File</th>
                                    <th className="p-2 border">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClaims.map((claim, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-2 border">{i + 1}</td>
                                        <td className="p-2 border">{claim.ticketID}</td>
                                        <td className="p-2 border">{claim.name}</td>
                                        <td className="p-2 border">{claim.email}</td>
                                        <td className="p-2 border">{claim.phone}</td>
                                        {/* <td className="p-2 border">{claim.countryCode || '-'}</td> */}
                                        <td className="p-2 border">{claim.instagram}</td>
                                        <td className="p-2 border">
                                            {claim.ticketImage ? (
                                                <button
                                                    onClick={() => setPreviewUrl(BASE_URL + claim.ticketImage)}
                                                    className="text-blue-600 underline hover:text-blue-800"
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 italic">No file</span>
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            {claim.proofImage ? (
                                                <button
                                                    onClick={() => setPreviewUrl(BASE_URL + claim.proofImage)}
                                                    className="text-blue-600 underline hover:text-blue-800"
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 italic">No file</span>
                                            )}
                                        </td>
                                        <td className="p-2 border">{formatDateTime(claim.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* File Preview Modal */}
            {previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-4 shadow-lg relative">
                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                        >
                            ×
                        </button>
                        <div className="h-96 flex justify-center items-center">
                            {(() => {
                                const type = previewUrl.split('.').pop().toLowerCase();
                                if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(type)) {
                                    return <img src={previewUrl} alt="Preview" className="max-h-full max-w-full rounded shadow" />;
                                } else if (['mp4', 'webm', 'ogg'].includes(type)) {
                                    return (
                                        <video controls className="max-h-full max-w-full rounded shadow">
                                            <source src={previewUrl} />
                                            Your browser does not support the video tag.
                                        </video>
                                    );
                                } else if (type === 'pdf') {
                                    return <iframe src={previewUrl} className="w-full h-full rounded" />;
                                } else {
                                    return <p className="text-gray-600">Preview not supported for this file type.</p>;
                                }
                            })()}
                        </div>
                        <div className="mt-4 text-right">
                            <a
                                href={previewUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
