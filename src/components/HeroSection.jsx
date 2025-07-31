import React from "react";
import LandingForm from "./LandingForm";
import { FaRegAddressCard } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';
import { GiTicket } from 'react-icons/gi';
import { MdOutlineSendToMobile } from "react-icons/md";

export default function HeroSection() {

    return (
        <section className="relative w-full  overflow-hidden">

            {/* Top Rectangle Background */}
            {/* Diagonal Top Slice */}
            <div className=" w-full h-[40px] md:h-[80px] bg-[#FFF7ED]" />
            {/* Diagonal Top Slice */}
            <div
                className=" w-full h-20 bg-[#FFF7ED] hidden md:block"
                style={{
                    clipPath: 'polygon(0 100%, 100% 0, 100% 0, 0 0)',
                }}
            />

            {/* Content */}
            <div className="relative  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 items-start pt-10 py-4 md:pb-4 md:pt-8">

                {/* Left Text Section */}
                <div className="text-left py-5 px-4 sm:px-6 md:px-10 pt-[100px] hidden md:block">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#402813] mb-8 leading-snug">
                        Step 1
                    </h2>

                    {/* Step 1 */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-lg sm:text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaInstagram />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">
                                Follow us on{' '}
                                <a
                                    href="https://www.instagram.com/shrilalmahalgroup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#E1306C] font-bold hover:opacity-80"
                                >
                                    Instagram
                                </a>
                            </p>


                            <p className="text-[#808080] text-xs sm:text-sm">
                                Head over to SLM and click Follow to stay updated
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-lg sm:text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaRegAddressCard />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">Fill the form</p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                Fill in your full name, Phone Number and Email ID
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
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">Submit and get your ticket instantly!</p>
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
                            <MdOutlineSendToMobile className="mt-[1px]" /> {/* slight nudge for better alignment */}
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">follow, comment, and tag 5 friends.</p>
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
