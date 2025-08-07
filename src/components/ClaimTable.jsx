import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const FILE_BASE_URL = 'https://api.lottery.tenderbaba.com';

export default function ClaimTable({ token }) {
    const [claims, setClaims] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        if (!token) return;

        const fetchClaims = async () => {
            try {
                const res = await fetch(`${FILE_BASE_URL}/api/tickets/claims`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.message || 'Unauthorized');
                setClaims(data.data);
                setFiltered(data.data);
            } catch (err) {
                alert('Failed to load claims: ' + err.message);
            }
        };

        fetchClaims();
    }, [token]);

    const formatDateTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const handleFilter = () => {
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const filteredList = claims.filter(claim => {
            const created = new Date(claim.createdAt);
            if (from && created < from) return false;
            if (to && created > to) return false;

            const combined = (
                claim.name + claim.email + claim.phone + claim.ticketID + (claim.instagram || '')
            ).toLowerCase();

            return combined.includes(searchTerm.toLowerCase());
        });

        setFiltered(filteredList);
    };

    useEffect(() => {
        handleFilter();
    }, [searchTerm, fromDate, toDate]);

    const downloadExcel = () => {
        const data = filtered.map((c, i) => ({
            "S. No": i + 1,
            Name: c.name,
            Email: c.email,
            Phone: c.phone,
            Instagram: c.instagram,
            TicketID: c.ticketID,
            Address: c.address,
            Numbers: Array.isArray(c.numbers) ? c.numbers.join(', ') : '',
            CreatedAt: formatDateTime(c.createdAt),
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Claims');
        XLSX.writeFile(wb, 'claims.xlsx');
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Submitted Claims</h2>

            <div className="flex flex-wrap gap-4 mb-4">
                <input type="text" placeholder="Search..." className="border px-3 py-1 rounded" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <input type="datetime-local" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border px-3 py-1 rounded" />
                <input type="datetime-local" value={toDate} onChange={e => setToDate(e.target.value)} className="border px-3 py-1 rounded" />
                <button onClick={downloadExcel} className="bg-green-600 text-white px-4 py-2 rounded">Download Excel</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {["S. No", "Name", "Email", "Phone", "Instagram", "Ticket ID", "Numbers", "Address", "Created At"].map((h, i) => (
                                <th key={i} className="p-2 border">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-2 border">{i + 1}</td>
                                <td className="p-2 border">{c.name}</td>
                                <td className="p-2 border">{c.email}</td>
                                <td className="p-2 border">{c.phone}</td>
                                <td className="p-2 border">{c.instagram}</td>
                                <td className="p-2 border">{c.ticketID}</td>
                                <td className="p-2 border">{Array.isArray(c.numbers) ? c.numbers.join(' ') : ''}</td>
                                <td className="p-2 border">{c.address}</td>
                                <td className="p-2 border">{formatDateTime(c.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
