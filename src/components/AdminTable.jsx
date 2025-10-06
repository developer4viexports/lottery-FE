// src/components/AdminTable.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { FILE_BASE_URL } from '../api/api';

export default function AdminTable({ token }) {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchTickets = useCallback(async (page = 1, limit = 50) => {
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch(`${FILE_BASE_URL}/api/admin/tickets?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Unauthorized');

            setTickets(data.data);
            setFilteredTickets(data.data);
            setPagination(data.pagination);
            setCurrentPage(page);
        } catch (error) {
            alert('Failed to load tickets: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTickets(1);
    }, [fetchTickets]);

    // Memoized parseNumbers function to avoid repeated parsing
    const parseNumbers = useMemo(() => {
        const cache = new Map();
        return (nums) => {
            const key = JSON.stringify(nums);
            if (cache.has(key)) return cache.get(key);

            try {
                let result;
                if (Array.isArray(nums)) {
                    result = nums;
                } else if (typeof nums === 'string') {
                    const parsed = JSON.parse(nums);
                    result = Array.isArray(parsed) ? parsed : [parsed];
                } else {
                    result = [];
                }
                cache.set(key, result);
                return result;
            } catch {
                const fallback = [];
                cache.set(key, fallback);
                return fallback;
            }
        };
    }, []);

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

    const getFileType = (url) => {
        if (!url) return '';

        try {
            const decodedUrl = decodeURIComponent(url);  // decode things like %2F
            const match = decodedUrl.match(/\.([a-zA-Z0-9]+)(\?|$)/);
            const ext = match?.[1]?.toLowerCase();

            if (!ext) return '';

            if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image';
            if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
            if (ext === 'pdf') return 'pdf';
            return 'other';
        } catch {
            return '';
        }
    };



    // Optimized filtering with memoization
    const filteredTicketsData = useMemo(() => {
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        const searchLower = searchTerm.toLowerCase();

        return tickets.filter(ticket => {
            // Date filtering
            const created = new Date(ticket.createdAt);
            if (from && created < from) return false;
            if (to && created > to) return false;

            // Search filtering - only if there's a search term
            if (searchTerm) {
                const combined = (
                    ticket.name +
                    ticket.email +
                    ticket.phone +
                    ticket.ticketID +
                    parseNumbers(ticket.numbers).join('')
                ).toLowerCase();

                return combined.includes(searchLower);
            }

            return true;
        });
    }, [tickets, fromDate, toDate, searchTerm, parseNumbers]);

    // Update filtered tickets when data changes
    useEffect(() => {
        setFilteredTickets(filteredTicketsData);
    }, [filteredTicketsData]);

    const downloadExcel = () => {
        const formatted = filteredTickets.map((t, i) => ({
            "S. No": i + 1,
            Name: t.name,
            Email: t.email,
            Phone: t.phone,
            TicketID: t.ticketID,
            Numbers: parseNumbers(t.numbers).join(' '),
            SuperTicket: t.isSuperTicket ? 'Yes' : 'No',
            Prize: t.prizeType || '-',
            Issued: t.issueDate || '-',
            Expiry: t.expiryDate || '-',
            CreatedAt: formatDateTime(t.createdAt),
            FollowImageURL: t.followProof || '',
            PurchaseProofURL: t.purchaseProof || '',
            TicketImageURL: t.ticketImage || ''

        }));

        const ws = XLSX.utils.json_to_sheet(formatted);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Tickets');
        XLSX.writeFile(wb, 'tickets.xlsx');
    };

    return (
        <div className="p-6">
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
                                const type = getFileType(previewUrl);
                                if (type === 'image') {
                                    return (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-h-full max-w-full rounded shadow"
                                            onError={() => console.error("❌ Failed to load image:", previewUrl)}
                                        />
                                    );
                                } else if (type === 'video') {
                                    return (
                                        <video controls className="max-h-full max-w-full rounded shadow">
                                            <source src={previewUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    );
                                } else if (type === 'pdf') {
                                    return (
                                        <iframe
                                            src={previewUrl}
                                            className="w-full h-full rounded"
                                            onError={() => console.error("❌ Failed to load PDF:", previewUrl)}
                                        />
                                    );
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

            {/* Filters */}
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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            {[
                                "S. No", "Name", "Email", "Phone", "Ticket ID", "Numbers",
                                "Super", "Prize", "Issued", "Expiry", "Follow Proof",
                                "Purchase Proof", "Ticket Image", "Created At"
                            ].map((header, idx) => (
                                <th key={idx} className="p-2 border">{header}</th>
                            ))}
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
                                <td className="p-2 border">{t.isSuperTicket ? 'Yes' : 'No'}</td>
                                <td className="p-2 border">{t.prizeType || '-'}</td>
                                <td className="p-2 border">{t.issueDate}</td>
                                <td className="p-2 border">{t.expiryDate}</td>

                                {/* Proof files */}
                                {['followProof', 'purchaseProof'].map((key, j) => (
                                    <td key={j} className="p-2 border">
                                        {t[key] ? (
                                            <button
                                                onClick={() => setPreviewUrl(t[key])}

                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                View
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 italic">No file</span>
                                        )}
                                    </td>
                                ))}

                                {/* Ticket Image */}
                                <td className="p-2 border">
                                    {t.ticketImage ? (
                                        <button
                                            onClick={() => setPreviewUrl(t.ticketImage)}

                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            View
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 italic">No image</span>
                                    )}
                                </td>

                                <td className="p-2 border">{formatDateTime(t.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center p-8">
                        <div className="text-lg text-gray-600">Loading tickets...</div>
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600">
                            Showing page {pagination.currentPage} of {pagination.totalPages}
                            ({pagination.totalTickets} total tickets)
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchTickets(currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const pageNum = Math.max(1, currentPage - 2) + i;
                                if (pageNum > pagination.totalPages) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => fetchTickets(pageNum)}
                                        className={`px-3 py-2 text-sm border rounded-lg ${pageNum === currentPage
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => fetchTickets(currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
