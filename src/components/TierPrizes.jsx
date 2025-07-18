import React, { useEffect, useState } from 'react';
import img2 from '../assets/img2.png';
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

                // ✅ Sort rows in required order
                const desiredOrder = ['7/7', '6/7', '5/7', '4/7', 'Bonus Entry'];
                formattedRows.sort((a, b) => {
                    return desiredOrder.indexOf(a.match) - desiredOrder.indexOf(b.match);
                });

                setRows(formattedRows);
            })
            .catch(() => setRows([]));
    }, []);



    return (
        <section
            className="w-full py-20 px-4 text-white"
            style={{ backgroundImage: `url(${img2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10">Tier Prizes</h2>

                <div className="overflow-x-auto bg-white bg-opacity-5 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg">
                    <table className="w-full text-left text-sm md:text-base border-collapse">
                        <thead>
                            <tr className="bg-white bg-opacity-10">
                                <th className="px-4 py-3 font-semibold text-white border-b border-gray-400">Match Type</th>
                                <th className="px-4 py-3 font-semibold text-white border-b border-gray-400">Regular Ticket Prize</th>
                                <th className="px-4 py-3 font-semibold text-white border-b border-gray-400">SuperTicket Prize (Better Rewards)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-4 text-center text-white">No prize tiers available</td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white hover:bg-opacity-10 transition">
                                        <td className="px-4 py-3 border-b border-gray-500">{row.match}</td>
                                        <td className="px-4 py-3 border-b border-gray-500">{row.regular}</td>
                                        <td className="px-4 py-3 border-b border-gray-500">{row.super}</td>
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
