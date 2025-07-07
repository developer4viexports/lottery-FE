import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function ClaimAdminTable({ token }) {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const res = await fetch('https://api.lottery.tenderbaba.com/api/admin/claims', {
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
                claim.instagram
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
            "S. No": i + 1,
            TicketID: claim.ticketID,
            Name: claim.name,
            Email: claim.email,
            Phone: claim.phone,
            Instagram: claim.instagram,
            SubmittedAt: formatDateTime(claim.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedClaims);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Claims');
        XLSX.writeFile(workbook, 'claims.xlsx');
    };

    return (
        <div className="p-6">
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

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2 border">S. No</th>
                            <th className="p-2 border">Ticket ID</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Instagram</th>
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
                                <td className="p-2 border">{c.instagram}</td>
                                <td className="p-2 border">{formatDateTime(c.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
                {filteredClaims.map((c, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-4 border">
                        <p><strong>S. No:</strong> {i + 1}</p>
                        <p><strong>Ticket ID:</strong> {c.ticketID}</p>
                        <p><strong>Name:</strong> {c.name}</p>
                        <p><strong>Email:</strong> {c.email}</p>
                        <p><strong>Phone:</strong> {c.phone}</p>
                        <p><strong>Instagram:</strong> {c.instagram}</p>
                        <p><strong>Submitted At:</strong> {formatDateTime(c.createdAt)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
