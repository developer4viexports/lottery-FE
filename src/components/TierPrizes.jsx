import React from 'react';
import img2 from '../assets/img2.png'; // Ensure this path is correct

const tierData = [
    { match: '7/7', regular: '1-Year Free Rice Supply', super: '1-Year Free Rice + Premium Kitchen Set' },
    { match: '6/7', regular: '5kg Rice + Merchandise', super: '10kg Premium Rice + Gift Hamper' },
    { match: '5/7', regular: '2kg Rice + Discount Coupon', super: '5kg Rice + Branded Apron' },
    { match: '4/7', regular: '₹100 Discount Coupon', super: '₹250 Discount Coupon or Cooking Utensil' },
    { match: 'Bonus Entry', regular: 'N/A', super: 'Entry into exclusive buyer-only lucky draw' },
];

export default function TierPrizes() {
    return (
        <section
            className="w-full py-20 px-4 text-white"
            style={{ backgroundImage: `url(${img2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10">Tier prizes</h2>

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
                            {tierData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white hover:bg-opacity-10 transition">
                                    <td className="px-4 py-3 border-b border-gray-500">{row.match}</td>
                                    <td className="px-4 py-3 border-b border-gray-500">{row.regular}</td>
                                    <td className="px-4 py-3 border-b border-gray-500">{row.super}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
