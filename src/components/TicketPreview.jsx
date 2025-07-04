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
                className="bg-white shadow-2xl border-4 border-yellow-400 rounded-xl px-6 py-6 max-w-md mx-auto font-mono relative"
            >
                <h2 className="text-center text-lg font-bold text-yellow-700 mb-2">
                    🎉 SHRILALMAHAL LUCKY TICKET 🎉
                </h2>

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
                                className="bg-blue-100 border border-blue-400 text-blue-800 px-3 py-1 rounded-md shadow-sm text-sm flex items-center justify-center"

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
