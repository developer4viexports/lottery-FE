import React, { useEffect, useState } from 'react';
import { getPrizeTiers } from '../api/api';

export default function TierPrizes() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        getPrizeTiers()
            .then(tiers => {
                if (!tiers || !Array.isArray(tiers)) return setRows([]);

                const matchTypes = [...new Set(tiers.map(t => t.matchType))];
                const formattedRows = matchTypes.map(match => {
                    const reg = tiers.find(t => t.matchType === match && t.ticketType === 'regular');
                    const sup = tiers.find(t => t.matchType === match && t.ticketType === 'super');
                    return {
                        match,
                        regular: reg?.prize || '—',
                        super: sup?.prize || '—',
                    };
                });

                const desiredOrder = ['7/7', '6/7', '5/7', '4/7', 'Bonus Entry'];
                formattedRows.sort((a, b) => desiredOrder.indexOf(a.match) - desiredOrder.indexOf(b.match));
                setRows(formattedRows);
            })
            .catch(() => setRows([]));
    }, []);

    return (
        <section className=" py-20 px-4 ">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 text-left mb-6">Tier prizes</h2>

                <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-md">
                    <table className="w-full text-left text-sm md:text-base border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="px-4 py-3 font-semibold border-b border-gray-200">Match Type</th>
                                <th className="px-4 py-3 font-semibold border-b border-gray-200">Regular Ticket Prize</th>
                                <th className="px-4 py-3 font-semibold border-b border-gray-200">SuperTicket Prize (Better Rewards)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-4 text-center text-gray-500">No prize tiers available</td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 border-b border-gray-100">
                                            <span className="inline-block px-3 py-1 text-sm font-semibold rounded bg-red-100 text-red-600">
                                                {row.match}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-gray-100 text-gray-800">{row.regular}</td>
                                        <td className="px-4 py-3 border-b border-gray-100 text-gray-800">{row.super}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
