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
                        // Optionally enable email sending:
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
                className="relative mx-auto max-w-sm shadow-xl font-sans text-gray-800 overflow-hidden"
                style={{
                    borderRadius: '2rem',
                    backgroundImage: `url(${ticketBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: '24px',
                }}
            >
                {/* Side notches */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md z-10"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md z-10"></div>

                <div className="relative z-20">
                    <h2 className="text-center text-lg font-bold text-rose-700 bg-rose-100 inline-block px-4 py-1 rounded-full mb-3">
                        Shrilalmahal Lucky Ticket
                    </h2>

                    {data.isSuperTicket && (
                        <div className="text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-4 inline-block font-medium">
                            💎 Super Ticket – 2X Reward!
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-y-3 text-left text-sm mb-5">
                        <div><strong>Name</strong><p>{data.name}</p></div>
                        <div><strong>Email</strong><p>{data.email}</p></div>
                        <div><strong>Instagram</strong><p>{data.instagram}</p></div>
                        <div><strong>Ticket ID</strong><p>{data.ticketID}</p></div>
                        <div><strong>Issued</strong><p>{data.issueDate}</p></div>
                        <div><strong>Expires</strong><p>{data.expiryDate}</p></div>
                    </div>

                    <hr className="border-dashed my-4 border-gray-300" />

                    <div className="text-center mb-5">
                        <p className="text-rose-700 font-semibold mb-2">Your Lucky Numbers:</p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            {data.numbers.map((num, idx) => (
                                <div
                                    key={idx}
                                    className="w-12 h-12 rounded-md border border-rose-500 bg-white text-rose-700 flex items-center justify-center text-lg font-bold shadow-sm"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-gray-800 mt-6 space-y-2 text-left">
                        <p>📌 Make sure you’ve completed all tasks to claim your prize!</p>
                        <p>📸 Follow <strong>@shrilalmahalgroup</strong> on Instagram</p>
                        <p>📝 Comment your ticket number</p>
                        <p>📤 Share ticket in story & tag 5 friends</p>
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
