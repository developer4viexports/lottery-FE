import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { uploadTicketImage, sendTicketEmail } from '../api/api.js';
import ticketBg from '../assets/ticketBg.png';

export default function TicketPreview({ data }) {
    const ref = useRef();
    const hasUploaded = useRef(false);

    const downloadTicket = async () => {
        const element = ref.current;

        // Temporarily remove aspect-ratio for full height rendering
        const originalAspectRatio = element.style.aspectRatio;
        element.style.aspectRatio = 'auto';

        // Allow DOM to update before screenshot
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(element, { scale: 2 });

        // Restore aspect-ratio
        element.style.aspectRatio = originalAspectRatio;

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
        <div className="flex flex-col items-center justify-center p-4">
            <div
                ref={ref}
                className="w-[90vw] sm:w-[380px] md:w-[400px] border-4 border-blue-500 rounded-lg shadow-lg relative overflow-hidden text-left bg-white"
                style={{
                    backgroundImage: `url(${ticketBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    aspectRatio: '0.7', // only applies visually
                    minHeight: 'auto' // allow full content height
                }}
            >
                {/* Decorative side circles */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 sm:w-8 h-6 sm:h-8 bg-gray-600 rounded-full"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-6 sm:w-8 h-6 sm:h-8 bg-gray-600 rounded-full"></div>

                {/* Header */}
                <div className="bg-pink-200 bg-opacity-80 text-center py-3 sm:py-4 px-3 sm:px-4">
                    <h1 className="text-red-800 font-bold text-lg sm:text-xl">Shrilalmahal Lucky Ticket</h1>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 bg-white bg-opacity-90 text-xs sm:text-sm">
                    {data.isSuperTicket && (
                        <div className="text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-3 inline-block font-medium text-center w-full text-sm">
                            💎 Super Ticket – 2X Reward!
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-6">
                        <div>
                            <p className="text-gray-600 mb-1">Name</p>
                            <p className="text-black font-semibold">{data.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Email</p>
                            <p className="text-black font-semibold break-words">{data.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Instagram</p>
                            <p className="text-black font-semibold">{data.instagram}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Ticket ID</p>
                            <p className="text-black font-semibold">{data.ticketID}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Issued</p>
                            <p className="text-black font-semibold">{data.issueDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Expires</p>
                            <p className="text-black font-semibold">{data.expiryDate}</p>
                        </div>
                    </div>

                    <div className="text-center pt-2">
                        <h2 className="text-red-800 font-bold text-base sm:text-lg mb-4">Your Lucky Numbers</h2>
                        <div className="flex justify-center gap-2 sm:gap-3 mb-4 flex-wrap">
                            {data.numbers.map((number, index) => (
                                <div
                                    key={index}
                                    className="w-8 sm:w-10 h-8 sm:h-10 border-2 border-red-800 rounded flex items-center justify-center font-bold text-red-800 bg-white"
                                >
                                    {number}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <p className="text-gray-700 font-medium">Make sure you've completed all tasks to claim your prize!</p>

                        <div className="flex items-center justify-center gap-2 text-red-800 font-medium">
                            <span className="text-red-600">📷</span>
                            <span>Follow @shrilalmahalgroup on Instagram</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-red-800 font-medium">
                            <span className="text-red-600">💬</span>
                            <span>Comment your ticket number</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-red-800 font-medium">
                            <span className="text-red-600">📤</span>
                            <span>Share ticket in story & tag 5 friends</span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={downloadTicket}
                className="mt-6 sm:mt-8 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg transition transform hover:scale-105"
            >
                📥 Download Ticket
            </button>
        </div>
    );
}
