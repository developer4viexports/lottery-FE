import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function ClaimAdminTable({ token }) {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const FILE_BASE_URL = 'https://api.lottery.tenderbaba.com';

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const res = await fetch(`${FILE_BASE_URL}/api/admin/claims`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message || 'Unauthorized');
                setClaims(data.data || []);
                setFilteredClaims(data.data || []);
            } catch (error) {
                alert('Failed to load claims: ' + error.message);
            }
        };
        if (token) fetchClaims();
    }, [token]);

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

        const filtered = claims.filter((claim) => {
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

        setFilteredClaims(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [fromDate, toDate, searchTerm]);

    const downloadExcel = () => {
        const formatted = filteredClaims.map((c, i) => ({
            'S. No': i + 1,
            TicketID: c.ticketID,
            Name: c.name,
            Email: c.email,
            Phone: c.phone,
            CountryCode: c.countryCode,
            Instagram: c.instagram,
            TicketImageURL: c.ticketImage ? FILE_BASE_URL + c.ticketImage : '',
            ProofImageURL: c.proofImage ? FILE_BASE_URL + c.proofImage : '',
            SubmittedAt: formatDateTime(c.createdAt),
        }));

        const ws = XLSX.utils.json_to_sheet(formatted);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Claims');
        XLSX.writeFile(wb, 'claims.xlsx');
    };

    const getPreviewContent = (url) => {
        const type = getFileType(url);
        if (type === 'image') {
            return <img src={url} alt="Preview" className="max-h-full max-w-full rounded shadow" />;
        } else if (type === 'video') {
            return (
                <video controls className="max-h-full max-w-full rounded shadow">
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        } else if (type === 'pdf') {
            return <iframe src={url} className="w-full h-full rounded" />;
        } else {
            return <p className="text-gray-600">Preview not supported for this file type.</p>;
        }
    };

    return (
        <div className="p-6">
            {/* File Preview Modal */}
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-lg w-full max-w-2xl p-4 shadow-lg relative">
                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                            aria-label="Close preview"
                        >
                            ×
                        </button>
                        <div className="h-96 flex justify-center items-center">{getPreviewContent(previewUrl)}</div>
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

            {/* Filters + Download */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">All Claim Submissions</h2>
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
                                'S. No', 'Ticket ID', 'Name', 'Email', 'Phone',
                                'Instagram', 'Ticket File', 'Proof File', 'Submitted At'
                            ].map((h, i) => (
                                <th key={i} className="p-2 border">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClaims.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-2 border">{i + 1}</td>
                                <td className="p-2 border">{c.ticketID}</td>
                                <td className="p-2 border">{c.name}</td>
                                <td className="p-2 border">{c.email}</td>
                                <td className="p-2 border">{c.phone}</td>
                                {/* <td className="p-2 border">{c.countryCode || '-'}</td> */}
                                <td className="p-2 border">{c.instagram}</td>
                                <td className="p-2 border">
                                    {c.ticketImage ? (
                                        <button
                                            onClick={() => setPreviewUrl(FILE_BASE_URL + c.ticketImage)}
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            View
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 italic">No file</span>
                                    )}
                                </td>
                                <td className="p-2 border">
                                    {c.proofImage ? (
                                        <button
                                            onClick={() => setPreviewUrl(FILE_BASE_URL + c.proofImage)}
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            View
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 italic">No file</span>
                                    )}
                                </td>
                                <td className="p-2 border">{formatDateTime(c.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
