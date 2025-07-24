import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { uploadTicketImage, sendTicketEmail } from '../api/api.js';
import ticketBg from '../assets/ticketBg.png';

export default function TicketPreview({ data }) {
    const ref = useRef();
    const hasUploaded = useRef(false);

    const downloadTicket = async () => {
        const canvas = await html2canvas(ref.current, { scale: 2 });
        const link = document.createElement('a');
        link.download = `${data.ticketID}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    useEffect(() => {
        if (data?.id && ref.current && !hasUploaded.current) {
            html2canvas(ref.current, { scale: 2 }).then((canvas) => {
                uploadTicketImage(data.id, canvas)
                    .then(async () => {
                        hasUploaded.current = true;
                        const result = await sendTicketEmail(data.id);
                        console.log('📧 Email sent:', result.message);
                    })
                    .catch(err => console.error('❌ Upload failed:', err));
            });
        }
    }, [data]);

    return (
        <div className="mt-10 px-4 text-center">
            <div
                ref={ref}
                className="max-w-md mx-auto border-4 border-blue-500 rounded-lg shadow-lg relative overflow-hidden text-left"
                style={{
                    backgroundImage: `url(${ticketBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Decorative side circles */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-gray-600 rounded-full"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-gray-600 rounded-full"></div>

                {/* Header */}
                <div className="bg-pink-200 bg-opacity-80 text-center py-3 px-4">
                    <h1 className="text-red-800 font-medium text-lg">Shrilalmahal Lucky Ticket</h1>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 bg-opacity-90">
                    {data.isSuperTicket && (
                        <div className="text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-2 inline-block font-medium text-center w-full">
                            💎 Super Ticket – 2X Reward!
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Name</p>
                            <p className="text-black font-medium">{data.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Email</p>
                            <p className="text-black font-medium">{data.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Instagram</p>
                            <p className="text-black font-medium">{data.instagram}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Ticket ID</p>
                            <p className="text-black font-medium">{data.ticketID}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Issued</p>
                            <p className="text-black font-medium">{data.issueDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Expires</p>
                            <p className="text-black font-medium">{data.expiryDate}</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-red-800 font-medium text-lg mb-4">Your Lucky Numbers</h2>
                        <div className="flex justify-center gap-2 mb-4 flex-wrap">
                            {data.numbers.map((number, index) => (
                                <div
                                    key={index}
                                    className="w-10 h-10 border-2 border-red-800 flex items-center justify-center font-medium text-red-800 bg-white"
                                >
                                    {number}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center space-y-3 text-sm">
                        <p className="text-gray-700">Make sure you've completed all tasks to claim your prize!</p>

                        <div className="flex items-center justify-center gap-2 text-red-800">
                            <span className="text-red-600">📷</span>
                            <span>Follow @shrilalmahalgroup on Instagram</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-red-800">
                            <span className="text-red-600">💬</span>
                            <span>Comment your ticket number</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-red-800">
                            <span className="text-red-600">📤</span>
                            <span>Share ticket in story & tag 5 friends</span>
                        </div>
                    </div>
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
