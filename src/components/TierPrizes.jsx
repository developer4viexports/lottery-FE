import React, { useEffect, useState } from 'react';
import { getPrizeTiers } from '../api/api';
import { Star, Trophy, Crown } from 'lucide-react';

const matchTypeLabels = {
    "7/7": { label: "Grand", bg: "bg-yellow-100", text: "text-yellow-700" },
    "6/7": { label: "Silver", bg: "bg-gray-100", text: "text-gray-700" },
    "5/7": { label: "Bronze", bg: "bg-orange-100", text: "text-orange-700" },
    "4/7": { label: "Consolation", bg: "bg-stone-200", text: "text-stone-700" },
};

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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[#FFF7ED]"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d4af37%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            <div className="container mx-auto px-4 py-10 md:py-20 relative z-10">
                <div className="max-w-6xl mx-auto text-center mb-16 animate-fade-in">
                    <p className="text-xs md:text-sm uppercase tracking-wider text-[#6B4F3F] mb-4 flex items-center justify-center">
                        <Star className="h-4 w-4 mr-2 text-[#D4AF37]" />
                        SHRI LAL MAHAL LUCKY TICKET
                        <Star className="h-4 w-4 ml-2 text-[#D4AF37]" />
                    </p>

                    <h1 className="text-3xl md:text-5xl font-bold text-[#2D1F1F] leading-snug md:leading-tight mb-4 md:mb-6">
                        Your Dreams Are Just{" "}
                        <span className="inline md:block bg-gradient-to-r from-[#A12828] to-[#F4C542] bg-clip-text text-transparent">
                            One Ticket Away!
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-[#5F4C42] max-w-3xl mx-auto leading-normal md:leading-relaxed">
                        Join thousands of winners who have transformed their lives with our premium lottery experience. Every ticket is a chance to make your dreams come true.
                    </p>
                </div>

                {/* Mobile View */}
                <div className="md:hidden animate-slide-up w-full max-w-md mx-auto">
                    <div className="sticky top-0 z-10 bg-[#811818] text-white px-4 py-3 flex items-center gap-2 rounded-t-lg">
                        <Trophy className="w-5 h-5" />
                        <h2 className="text-base font-medium">Tier prizes</h2>
                    </div>

                    <div>
                        {rows.map((row, idx) => {
                            const isBonus = row.match.toLowerCase().includes("bonus");
                            return (
                                <div
                                    key={idx}
                                    className={`p-4 border shadow 
                                        ${isBonus ? 'bg-[#FFFAE6] border-yellow-200' : 'bg-white border-gray-200'} 
                                        ${idx === rows.length - 1 ? 'rounded-b-lg' : ''}`}
                                >
                                    {/* Match Type */}
                                    <div className="flex items-center gap-2 mb-2">
                                        {isBonus ? (
                                            <>
                                                <Crown className="h-6 w-6 text-[#D4AF37]" />
                                                <span className="text-[#A87C00] font-bold">Bonus Entry</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-8 h-8 bg-[#A12828] text-white flex items-center justify-center text-sm rounded">
                                                    {row.match}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {/* <span className="font-semibold text-gray-800">{row.match}</span> */}
                                                    {matchTypeLabels[row.match] && (
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${matchTypeLabels[row.match].bg} ${matchTypeLabels[row.match].text}`}>
                                                            {matchTypeLabels[row.match].label}
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {!isBonus && (
                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500">Regular Ticket Prize</p>
                                            <p className="text-sm text-green-800 font-semibold">{row.regular}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Super Ticket Prize{!isBonus && ' (Better Rewards)'}
                                        </p>
                                        <p className={`text-sm font-medium ${isBonus ? 'text-yellow-700 italic' : 'text-green-800 italic'}`}>
                                            {row.super}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block animate-slide-up">
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-[#E7CFA2] rounded-xl overflow-hidden shadow-2xl">
                        <div className="bg-[#811818] text-white py-5 px-6">
                            <h2 className="text-2xl flex items-center justify-center">
                                <Trophy className="h-6 w-6 mr-3" />
                                Tier Prizes
                            </h2>
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#F0DFA9]">
                                        <th className="py-3 px-4 text-[#3A2B2B] font-semibold">Match Type</th>
                                        <th className="py-3 px-4 text-[#3A2B2B] font-semibold">Regular Ticket Prize</th>
                                        <th className="py-3 px-4 text-[#3A2B2B] font-semibold">Super Ticket Prize</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center text-[#7A6A5A] py-6">
                                                No prize tiers available
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((row, idx) => {
                                            const isBonus = row.match.toLowerCase().includes("bonus");
                                            return (
                                                <tr key={idx} className={`transition-colors ${isBonus ? 'bg-[#FFFAE6]' : 'hover:bg-[#FFF1E5]'}`}>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center">
                                                            {isBonus ? (
                                                                <>
                                                                    <Crown className="h-7 w-7 text-[#D4AF37] mr-3" />
                                                                    <span className="text-[#A87C00] font-bold">{row.match}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="w-8 h-8 bg-[#A12828] text-white flex items-center justify-center text-sm mr-3">
                                                                        {row.match}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        {/* <span className="font-medium">{row.match}</span> */}
                                                                        {matchTypeLabels[row.match] && (
                                                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${matchTypeLabels[row.match].bg} ${matchTypeLabels[row.match].text}`}>
                                                                                {matchTypeLabels[row.match].label}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-[#2E7D32] font-semibold">{row.regular}</td>
                                                    <td className="py-4 px-4 text-[#2E7D32] font-semibold">
                                                        {isBonus ? (
                                                            <span className="bg-[#FFEB99] text-[#B28900] px-3 py-1 rounded-full text-sm font-medium">
                                                                {row.super}
                                                            </span>
                                                        ) : (
                                                            row.super
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
