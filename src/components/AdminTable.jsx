import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function AdminTable({ token }) {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const FILE_BASE_URL = 'https://lottery-be.onrender.com';

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch(`${FILE_BASE_URL}/api/admin/tickets`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.message || 'Unauthorized');
                setTickets(data.data);
                setFilteredTickets(data.data);
            } catch (error) {
                alert('Failed to load tickets: ' + error.message);
            }
        };

        if (token) fetchTickets();
    }, [token]);

    const parseNumbers = (nums) => {
        try {
            if (Array.isArray(nums)) return nums;
            if (typeof nums === 'string') {
                const parsed = JSON.parse(nums);
                return Array.isArray(parsed) ? parsed : [parsed];
            }
            return [];
        } catch {
            return [];
        }
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getFileType = (url) => {
        if (!url) return '';
        const ext = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image';
        if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
        if (ext === 'pdf') return 'pdf';
        return 'other';
    };

    const handleFilter = () => {
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const filtered = tickets.filter(ticket => {
            const created = new Date(ticket.createdAt);
            if (from && created < from) return false;
            if (to && created > to) return false;

            const combined = (
                ticket.name +
                ticket.email +
                ticket.phone +
                ticket.ticketID +
                parseNumbers(ticket.numbers).join('')
            ).toLowerCase();

            return combined.includes(searchTerm.toLowerCase());
        });

        setFilteredTickets(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [searchTerm, fromDate, toDate]);

    const downloadExcel = () => {
        const formattedTickets = filteredTickets.map((ticket, i) => ({
            "S. No": i + 1,
            Name: ticket.name,
            Email: ticket.email,
            Phone: ticket.phone,
            TicketID: ticket.ticketID,
            Numbers: parseNumbers(ticket.numbers).join(' '),
            CreatedAt: formatDateTime(ticket.createdAt),
            FileURL: ticket.proofImage ? FILE_BASE_URL + ticket.proofImage : ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedTickets);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');
        XLSX.writeFile(workbook, 'tickets.xlsx');
    };

    return (
        <div className="p-6">
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
                                const type = getFileType(previewUrl);
                                if (type === 'image') {
                                    return <img src={previewUrl} alt="Preview" className="max-h-full max-w-full rounded shadow" />;
                                } else if (type === 'video') {
                                    return (
                                        <video controls className="max-h-full max-w-full rounded shadow">
                                            <source src={previewUrl} type="video/mp4" />
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

            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
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
                    onClick={downloadExcel}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 h-10"
                >
                    Download Excel
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2 border">S. No</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Ticket ID</th>
                            <th className="p-2 border">Numbers</th>
                            <th className="p-2 border">Generated At</th>
                            <th className="p-2 border">File</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map((t, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-2 border">{i + 1}</td>
                                <td className="p-2 border">{t.name}</td>
                                <td className="p-2 border">{t.email}</td>
                                <td className="p-2 border">{t.phone}</td>
                                <td className="p-2 border">{t.ticketID}</td>
                                <td className="p-2 border">{parseNumbers(t.numbers).join(' ')}</td>
                                <td className="p-2 border">{formatDateTime(t.createdAt)}</td>
                                <td className="p-2 border">
                                    {t.proofImage ? (
                                        <button
                                            onClick={() => setPreviewUrl(FILE_BASE_URL + t.proofImage)}
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            View File
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 italic">No file</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
                {filteredTickets.map((t, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-4 border">
                        <p><strong>S. No:</strong> {i + 1}</p>
                        <p><strong>Name:</strong> {t.name}</p>
                        <p><strong>Email:</strong> {t.email}</p>
                        <p><strong>Phone:</strong> {t.phone}</p>
                        <p><strong>Ticket ID:</strong> {t.ticketID}</p>
                        <p><strong>Numbers:</strong> {parseNumbers(t.numbers).join(' ')}</p>
                        <p><strong>Generated At:</strong> {formatDateTime(t.createdAt)}</p>
                        <p>
                            <strong>File:</strong>{' '}
                            {t.proofImage ? (
                                <button
                                    onClick={() => setPreviewUrl(FILE_BASE_URL + t.proofImage)}
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    View File
                                </button>
                            ) : (
                                <span className="text-gray-400 italic">No file</span>
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
