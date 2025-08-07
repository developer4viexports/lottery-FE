import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { uploadTicketImage, sendTicketEmail, getPrizeTiers } from '../api/api.js';
import ticketBg from '../assets/ticketBg.png';
import logo from '../assets/logo.png'; // Adjust the path as needed 
import { FaInstagram, FaCommentDots, FaShareAlt } from "react-icons/fa";
import { toPng } from 'html-to-image';

export default function TicketPreview({ data }) {
    const ref = useRef();
    const hasUploaded = useRef(false);
    const [jackpotPrize, setJackpotPrize] = useState(null);

    const downloadTicket = async () => {
        const element = ref.current;

        try {
            const dataUrl = await toPng(element, { cacheBust: true, quality: 1 });
            const link = document.createElement('a');
            link.download = `${data.ticketID}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('❌ Failed to generate image:', err);
        }
    };


    useEffect(() => {
        // Fetch prize
        getPrizeTiers().then(tiers => {
            const type = data.isSuperTicket ? 'super' : 'regular';
            const match7 = tiers.find(t => t.matchType === '7/7' && t.ticketType === type);
            if (match7?.prize) setJackpotPrize(match7.prize);
        });

        // Upload image + send email
        if (data?.id && ref.current && !hasUploaded.current) {
            toPng(ref.current, { cacheBust: true, quality: 1 })
                .then((dataUrl) => {
                    const img = new Image();
                    img.src = dataUrl;
                    img.onload = async () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        hasUploaded.current = true;

                        uploadTicketImage(data.id, canvas)
                            .then(async () => {
                                // const result = await sendTicketEmail(data.id);
                                // console.log('📧 Email sent:', result.message);
                            })
                            .catch(err => console.error('❌ Upload failed:', err));
                    };
                })
                .catch(err => console.error('❌ Failed to convert ticket to image:', err));
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
                    // aspectRatio: '0.7', // only applies visually
                    minHeight: 'auto' // allow full content height
                }}
            >

                {/* Header */}
                <div className="text-center py-3 sm:py-4 px-3 sm:px-3 flex items-center justify-center space-x-3 pb-1">
                    <img src={logo} alt="Shrilalmahal Logo" className="h-10 sm:h-12" />
                    <h1 className="text-[#84282D] font-bold text-lg sm:text-xl">
                        {data.isSuperTicket ? 'Lucky Super Ticket' : 'Lucky Ticket'}
                    </h1>
                </div>



                {/* Content */}
                <div className="p-4 sm:p-5 space-y-4 sm:space-y-5  text-xs sm:text-sm">
                    {/* {data.isSuperTicket && (
                        <div className="text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-3 inline-block font-medium text-center w-full text-sm">
                            💎 Super Ticket – 2X Reward!
                        </div>
                    )} */}

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
                            <p className="text-gray-600 mb-1 pl-6">Instagram</p>
                            <p className="text-black font-semibold pl-6">{data.instagram}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1 pl-6">Ticket ID</p>
                            <p className="text-black font-semibold pl-6">{data.ticketID}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1 pl-6">Issued</p>
                            <p className="text-black font-semibold pl-6">{data.issueDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1 pl-6">Expires</p>
                            <p className="text-black font-semibold pl-6">{data.expiryDate}</p>
                        </div>
                    </div>

                    {/* Prize Block */}
                    {jackpotPrize && (
                        <div className=" text-[#84282D] text-center font-semibold text-sm sm:text-base px-4 py-3 rounded-lg shadow">
                            🎁 You’ve unlocked a chance to win: <span className="font-bold">{jackpotPrize}</span>!
                        </div>
                    )}

                    <div className="  pt-2">
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
                        <p className="text-gray-700 font-medium">Make sure you've completed all tasks to Activate your Ticket!</p>

                        <div className="flex items-center justify-center gap-2 text-red-800 font-medium">
                            <FaInstagram />
                            <span className="text-[#484646]">Follow @shrilalmahalgroup on Instagram</span>
                        </div>

                        <div className=" flex justify-center gap-2 text-red-800 font-medium">
                            <div className="shrink-0 pt-1"><FaCommentDots /></div>

                            <span className="text-[#484646]">Comment your ticket number on the Instagram post and tag 5 friends</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-red-800 font-medium">
                            <FaShareAlt />
                            <span className="text-[#484646]">Share ticket in story & tag @shrilalmahalgroup</span>
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
