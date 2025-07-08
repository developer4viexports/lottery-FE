import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function ClaimAdminTable({ token }) {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const FILE_BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const res = await fetch(`${FILE_BASE_URL}/api/admin/claims`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
        const formattedClaims = filteredClaims.map((claim, i) => ({
            'S. No': i + 1,
            TicketID: claim.ticketID,
            Name: claim.name,
            Email: claim.email,
            Phone: claim.phone,
            CountryCode: claim.countryCode,
            Instagram: claim.instagram,
            TicketImageURL: claim.ticketImage ? FILE_BASE_URL + claim.ticketImage : '',
            ProofImageURL: claim.proofImage ? FILE_BASE_URL + claim.proofImage : '',
            SubmittedAt: formatDateTime(claim.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedClaims);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Claims');
        XLSX.writeFile(workbook, 'claims.xlsx');
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

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2 border">S. No</th>
                            <th className="p-2 border">Ticket ID</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Country</th>
                            <th className="p-2 border">Instagram</th>
                            <th className="p-2 border">Ticket File</th>
                            <th className="p-2 border">Proof File</th>
                            <th className="p-2 border">Submitted At</th>
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
                                <td className="p-2 border">{c.countryCode || '-'}</td>
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
