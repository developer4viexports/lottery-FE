import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FILE_BASE_URL } from '../api/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lottery.tenderbaba.com/api';

export default function CompetitionAllDetails() {
    const { id } = useParams();
    const [competition, setCompetition] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [activates, setActivates] = useState([]);
    const [claims, setClaims] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [filteredActivates, setFilteredActivates] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('tickets');
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const getFileType = (url) => {
        if (!url) return '';
        try {
            const ext = decodeURIComponent(url).split('.').pop().split('?')[0].toLowerCase();
            if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image';
            if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
            if (ext === 'pdf') return 'pdf';
            return 'other';
        } catch {
            return '';
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) return setError('Not authorized');

            try {
                const res = await fetch(`${BASE_URL}/winning-combo/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch competition details');

                setCompetition(data.data.competition);
                setTickets(data.data.tickets || []);
                setFilteredTickets(data.data.tickets || []);
                setActivates(data.data.Activates || []);
                setFilteredActivates(data.data.Activates || []);
                setClaims(data.data.claims || []);
                setFilteredClaims(data.data.claims || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleTabChange = (tab) => setActiveTab(tab);

    const handleFilter = () => {
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const filteredTickets = tickets.filter(ticket => {
            const created = new Date(ticket.createdAt);
            if (from && created < from) return false;
            if (to && created > to) return false;
            const combined = (ticket.name + ticket.email + ticket.phone + ticket.ticketID + ticket.numbers?.join('')).toLowerCase();
            return combined.includes(searchTerm.toLowerCase());
        });

        const filteredActivates = activates.filter(act => {
            const created = new Date(act.createdAt);
            if (from && created < from) return false;
            if (to && created > to) return false;
            const combined = (act.ticketID + act.name + act.email + act.phone + act.instagram + act.countryCode).toLowerCase();
            return combined.includes(searchTerm.toLowerCase());
        });

        const filteredClaims = claims.filter(claim => {
            const created = new Date(claim.createdAt);
            if (from && created < from) return false;
            if (to && created > to) return false;
            const combined = (claim.ticketID + claim.name + claim.email + claim.phone + claim.instagram + claim.nready);
            return combined.includes(searchTerm.toLowerCase());
        });

        setFilteredTickets(filteredTickets);
        setFilteredActivates(filteredActivates);
        setFilteredClaims(filteredClaims);
    };

    const downloadExcel = (type) => {
        let formatted;
        if (type === 'tickets') {
            formatted = filteredTickets.map((item, i) => ({
                "S. No": i + 1,
                Name: item.name,
                Email: item.email,
                Phone: item.phone,
                TicketID: item.ticketID,
                Numbers: item.numbers?.join(' '),
                SuperTicket: item.isSuperTicket ? 'Yes' : 'No',
                Prize: item.prizeType || '-',
                Issued: item.issueDate || '-',
                Expiry: item.expiryDate || '-',
                FollowProof: item.followProof || '',
                PurchaseProof: item.purchaseProof || '',
                TicketImageURL: item.ticketImage || '',
            }));
        } else if (type === 'activates') {
            formatted = filteredActivates.map((item, i) => ({
                "S. No": i + 1,
                TicketID: item.ticketID,
                Name: item.name,
                Email: item.email,
                Phone: item.phone,
                // CountryCode: item.countryCode,
                Instagram: item.instagram,
                StoryImageURL: item.ticketImage || '',
                CommentImageURL: item.proofImage || '',
                SubmittedAt: item.createdAt
            }));
        } else {
            formatted = filteredClaims.map((item, i) => ({
                "S. No": i + 1,
                TicketID: item.ticketID,
                Name: item.name,
                Email: item.email,
                Phone: item.phone,
                Instagram: item.instagram,
                Address: item.address || '',
                Numbers: item.numbers?.join(' '),
                SubmittedAt: item.createdAt
            }));
        }

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

            <div className="mb-6">
                <div className="flex mb-4">
                    <button className={`px-4 py-2 mr-2 ${activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => handleTabChange('tickets')}>Tickets</button>
                    <button className={`px-4 py-2 mr-2 ${activeTab === 'activates' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => handleTabChange('activates')}>Activate Submissions</button>
                    <button className={`px-4 py-2 ${activeTab === 'claims' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => handleTabChange('claims')}>Claims</button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div>
                            <label className="text-sm block mb-1">Search</label>
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-1 rounded shadow-sm w-64" />
                        </div>
                        <div>
                            <label className="text-sm block mb-1">From Date</label>
                            <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border px-3 py-1 rounded shadow-sm" />
                        </div>
                        <div>
                            <label className="text-sm block mb-1">To Date</label>
                            <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border px-3 py-1 rounded shadow-sm" />
                        </div>
                    </div>

                    <button onClick={() => downloadExcel(activeTab)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 h-10">Download Excel</button>
                </div>

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
                                    <th className="p-2 border">Follow Proof</th>
                                    <th className="p-2 border">Purchase Proof</th>
                                    <th className="p-2 border">Ticket Image</th>
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
                                        {['followProof', 'purchaseProof'].map((key, j) => (
                                            <td key={j} className="p-2 border">
                                                {ticket[key] ? (
                                                    <button onClick={() => setPreviewUrl(FILE_BASE_URL + ticket[key])} className="text-blue-600 underline hover:text-blue-800">View</button>
                                                ) : (
                                                    <span className="text-gray-400 italic">No file</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="p-2 border">{ticket.ticketImage ? (
                                            <button onClick={() => setPreviewUrl(FILE_BASE_URL + ticket.ticketImage)} className="text-blue-600 underline hover:text-blue-800">View</button>
                                        ) : <span className="text-gray-400 italic">No image</span>}</td>
                                        <td className="p-2 border">{formatDateTime(ticket.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'activates' ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-2 border">S. No</th>
                                    <th className="p-2 border">Ticket ID</th>
                                    {/* <th className="p-2 border">Name</th> */}
                                    <th className="p-2 border">Email</th>
                                    <th className="p-2 border">Phone</th>
                                    {/* <th className="p-2 border">Instagram</th> */}
                                    <th className="p-2 border">Story Proof</th>
                                    <th className="p-2 border">Comment Proof</th>
                                    <th className="p-2 border">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActivates.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-2 border">{i + 1}</td>
                                        <td className="p-2 border">{item.ticketID}</td>
                                        {/* <td className="p-2 border">{item.name}</td> */}
                                        <td className="p-2 border">{item.email}</td>
                                        <td className="p-2 border">{item.phone}</td>
                                        {/* <td className="p-2 border">{item.instagram}</td> */}
                                        <td className="p-2 border">{item.ticketImage ? <button onClick={() => setPreviewUrl(FILE_BASE_URL + item.ticketImage)} className="text-blue-600 underline hover:text-blue-800">View</button> : <span className="text-gray-400 italic">No file</span>}</td>
                                        <td className="p-2 border">{item.proofImage ? <button onClick={() => setPreviewUrl(FILE_BASE_URL + item.proofImage)} className="text-blue-600 underline hover:text-blue-800">View</button> : <span className="text-gray-400 italic">No file</span>}</td>
                                        <td className="p-2 border">{formatDateTime(item.createdAt)}</td>
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
                                    <th className="p-2 border">Instagram</th>
                                    <th className="p-2 border">Numbers</th>
                                    <th className="p-2 border">Address</th>
                                    <th className="p-2 border">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClaims.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-2 border">{i + 1}</td>
                                        <td className="p-2 border">{item.ticketID}</td>
                                        <td className="p-2 border">{item.name}</td>
                                        <td className="p-2 border">{item.email}</td>
                                        <td className="p-2 border">{item.phone}</td>
                                        <td className="p-2 border">{item.instagram}</td>
                                        <td className="p-2 border">{item.numbers?.join(' ')}</td>
                                        <td className="p-2 border">{item.address}</td>
                                        <td className="p-2 border">{formatDateTime(item.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-4 shadow-lg relative">
                        <button onClick={() => setPreviewUrl(null)} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl">×</button>
                        <div className="h-96 flex justify-center items-center">
                            {(() => {
                                const type = getFileType(previewUrl);
                                if (type === 'image') {
                                    return <img src={previewUrl} alt="Preview" className="max-h-full max-w-full rounded shadow" />;
                                } else if (type === 'video') {
                                    return <video controls className="max-h-full max-w-full rounded shadow">
                                        <source src={previewUrl} />
                                        Your browser does not support the video tag.
                                    </video>;
                                } else if (type === 'pdf') {
                                    return <iframe src={previewUrl} className="w-full h-full rounded" />;
                                } else {
                                    return <p className="text-gray-600">Preview not supported for this file type.</p>;
                                }
                            })()}

                        </div>
                        <div className="mt-4 text-right">
                            <a href={previewUrl} download target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Download</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}