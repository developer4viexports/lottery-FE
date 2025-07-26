import React from "react";
import LandingForm from "./LandingForm";
import { FaRegAddressCard } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';
import { GiTicket } from 'react-icons/gi';
import { FaBullhorn } from 'react-icons/fa';

export default function HeroSection() {
    return (
        <section className="relative w-full py-10 md:py-20 overflow-hidden">
            {/* Diagonal Top Slice */}
            {/* <div
                className="absolute top-0 left-0 w-full h-20 bg-white z-0"
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)',
                }}
            /> */}

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 items-start ">

                {/* Left Text Section */}
                <div className="text-left py-5 px-4 sm:px-6 md:px-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#402813] mb-8 leading-snug">
                        Follow these simple steps <br className="block sm:hidden" />
                        for your chance to win
                    </h2>

                    {/* Step 1 */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-lg sm:text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaRegAddressCard />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">Enter your details</p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                Fill in your full name, Phone Number and Email ID.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-lg sm:text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaInstagram />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">Follow us on Instagram</p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                Head over to SLM and click Follow to stay updated
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-lg sm:text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <GiTicket />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">Collect your lucky draw tickets</p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                Regular Prize Ticket, Super Prize Ticket
                            </p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-lg sm:text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaBullhorn className="mt-[1px]" /> {/* slight nudge for better alignment */}
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">Spread the word</p>
                            <p className="text-[#808080] text-xs sm:text-sm leading-snug max-w-[280px] sm:max-w-none">
                                Share your ticket with your friends and family for more happiness
                            </p>
                        </div>
                    </div>

                </div>


                {/* Right: Form */}
                <div className="px-4">
                    <LandingForm />
                </div>
            </div>
        </section>
    );
}
