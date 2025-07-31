import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { uploadTicketImage, sendTicketEmail } from '../api/api.js';
import ticketBg from '../assets/ticketBg.png';
import logo from '../assets/logo.png'; // Adjust the path as needed 
import { FaInstagram, FaCommentDots, FaShareAlt } from "react-icons/fa";

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
                className="w-[90vw] sm:w-[380px] md:w-[400px]  rounded-lg shadow-lg relative overflow-hidden text-left bg-white"
                style={{
                    backgroundImage: `url(${ticketBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    aspectRatio: '0.7', // only applies visually
                    minHeight: 'auto' // allow full content height
                }}
            >
                {/* Decorative side circles */}
                {/* <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 sm:w-8 h-6 sm:h-8 bg-gray-600 rounded-full"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-6 sm:w-8 h-6 sm:h-8 bg-gray-600 rounded-full"></div> */}

                {/* Header */}
                <div className="  text-center py-3 sm:py-4 px-3 sm:px-4 flex items-center justify-center space-x-3">
                    <img src={logo} alt="Shrilalmahal Logo" className="h-10 sm:h-12" />
                    <h1 className="text-red-800 font-bold text-lg sm:text-xl">Lucky Ticket</h1>
                </div>


                {/* Content */}
                <div className="p-4 sm:p-5 space-y-4 sm:space-y-5  text-xs sm:text-sm">
                    {data.isSuperTicket && (
                        <div className="text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-3 inline-block font-medium text-center w-full text-sm">
                            💎 Super Ticket – 2X Reward!
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-6 ">
                        {/* <div>
                            <p className="text-gray-600 mb-1">Name</p>
                            <p className="text-black font-semibold">{data.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Email</p>
                            <p className="text-black font-semibold break-words">{data.email}</p>
                        </div> */}
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

                    <div className=" py-2 pt-6">
                        <hr className="border-t border-dotted border-gray-400 mx-auto w-full" />
                    </div>


                    <div className="text-center pt-2">
                        <h2 className="text-[#665B5C] font-bold text-base sm:text-lg mb-4">Your Lucky Numbers</h2>
                        <div className="flex justify-center gap-2 sm:gap-3 mb-4 flex-wrap">
                            {data.numbers.map((number, index) => (
                                <div
                                    key={index}
                                    className="relative flex items-center justify-center bg-white"
                                    style={{
                                        width: '35px',     // Matches your design intent
                                        height: '35px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {/* Top and Bottom Borders */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            borderTop: '2px solid #7A1F24',
                                            borderBottom: '2px solid #7A1F24',
                                        }}
                                    />

                                    {/* Top-left corner */}
                                    <div
                                        className="absolute"
                                        style={{
                                            top: 0,
                                            left: 0,
                                            height: '6px',
                                            borderLeft: '2px solid #7A1F24',
                                        }}
                                    />

                                    {/* Top-right corner */}
                                    <div
                                        className="absolute"
                                        style={{
                                            top: 0,
                                            right: 0,
                                            height: '6px',
                                            borderRight: '2px solid #7A1F24',
                                        }}
                                    />

                                    {/* Bottom-left corner */}
                                    <div
                                        className="absolute"
                                        style={{
                                            bottom: 0,
                                            left: 0,
                                            height: '6px',
                                            borderLeft: '2px solid #7A1F24',
                                        }}
                                    />

                                    {/* Bottom-right corner */}
                                    <div
                                        className="absolute"
                                        style={{
                                            bottom: 0,
                                            right: 0,
                                            height: '6px',
                                            borderRight: '2px solid #7A1F24',
                                        }}
                                    />

                                    {/* Number Text */}
                                    <span
                                        className="relative z-10 font-bold select-none flex items-center justify-center"
                                        style={{
                                            color: '#7A1F24',
                                            fontSize: '16px',
                                            lineHeight: '16px',
                                            height: '100%',
                                            whiteSpace: 'nowrap',
                                            fontFamily: 'Inter, sans-serif',
                                        }}
                                    >
                                        {number}
                                    </span>
                                </div>
                            ))}
                        </div>


                    </div>

                    <div className="text-center space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <p className="text-gray-700 font-medium">Make sure you've completed all tasks to claim your prize!</p>

                        <div className="flex items-center justify-center gap-2 text-red-800 font-medium">
                            <FaInstagram />
                            <span className="text-[#484646]">Follow @shrilalmahalgroup on Instagram</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-red-800 font-medium">
                            <FaCommentDots />
                            <span className="text-[#484646]">Comment your ticket number</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-red-800 font-medium">
                            <FaShareAlt />
                            <span className="text-[#484646]">Share ticket in story & tag 5 friends</span>
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
