import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function TicketPreview({ data }) {
    const ref = useRef();

    const downloadTicket = async () => {
        const canvas = await html2canvas(ref.current);
        const link = document.createElement('a');
        link.download = `${data.id}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="mt-10 text-center px-4">
            <div
                ref={ref}
                className={`bg-white shadow-2xl border-4 ${data.isSuperTicket ? 'border-purple-600' : 'border-yellow-400'} rounded-xl px-6 py-6 max-w-md mx-auto font-mono relative`}
            >
                <h2 className="text-center text-lg font-bold mb-2">
                    {data.isSuperTicket ? (
                        <span className="text-purple-700">✨ SHRILALMAHAL SUPER TICKET ✨</span>
                    ) : (
                        <span className="text-yellow-700">🎉 SHRILALMAHAL LUCKY TICKET 🎉</span>
                    )}
                </h2>

                {data.isSuperTicket && (
                    <div className="bg-purple-100 text-purple-800 text-sm p-2 rounded mb-3">
                        🚀 SuperTicket - 2X Prize Value on Wins!
                    </div>
                )}

                <div className="text-left space-y-1 text-sm sm:text-base">
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Instagram:</strong> {data.instagram}</p>
                    <p><strong>Ticket ID:</strong> <span className="text-blue-700 font-semibold">{data.id}</span></p>
                    <p><strong>Issued:</strong> {data.issueDate}</p>
                    <p><strong>Expires:</strong> {data.expiryDate}</p>
                </div>

                <div className="mt-4 text-center">
                    <p className="font-semibold text-sm mb-5">Your Lucky Numbers:</p>
                    <div className="flex justify-center gap-3 flex-wrap">
                        {data.numbers.map((num, idx) => (
                            <span
                                key={idx}
                                className={`border px-3 py-1 rounded-md shadow-sm text-sm flex items-center justify-center ${data.isSuperTicket
                                    ? 'bg-purple-100 border-purple-400 text-purple-800'
                                    : 'bg-blue-100 border-blue-400 text-blue-800'
                                    }`}
                            >
                                {num}
                            </span>
                        ))}
                    </div>
                </div>

                <hr className="my-4 border-dashed" />

                <div className="text-xs sm:text-sm leading-snug text-gray-700 text-left space-y-1">
                    <p>✅ Follow <strong>@shrilalmahalgroup</strong> on Instagram</p>
                    <p>✅ Comment your ticket number</p>
                    <p>✅ Share ticket in story & tag 5 friends</p>
                    <p className="mt-2 text-red-600 font-medium">🔔 Make sure you’ve completed all tasks to claim your prize!</p>
                </div>
            </div>

            <button
                onClick={downloadTicket}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md shadow transition"
            >
                📥 Download Ticket
            </button>
        </div>
    );
}
