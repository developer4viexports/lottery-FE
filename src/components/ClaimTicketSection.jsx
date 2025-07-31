import React from 'react';
import ClaimTicketForm from './ClaimTicketForm'; // adjust path as needed
import { FaMedal, FaHourglassHalf } from 'react-icons/fa';
import { RiMedalLine } from 'react-icons/ri';

const ClaimTicketSection = () => {
    return (
        <section className="relative w-full py-4 md:pb-4 md:pt-8 overflow-hidden">

            {/* Top Rectangle Background */}
            <div className="w-full h-[40px] md:h-[80px] bg-[#FFF7ED]" />
            {/* Diagonal Top Slice */}
            <div
                className="w-full h-20 bg-[#FFF7ED] hidden md:block"
                style={{
                    clipPath: 'polygon(0 100%, 100% 0, 100% 0, 0 0)',
                }}
            />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 items-start pt-10 ">

                {/* Left Text Section */}
                <div className="text-left py-5 px-4 sm:px-6 md:px-10 hidden md:block">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#402813] mb-8 leading-snug">
                        Step 3
                    </h2>
                    {/* Step 1 */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="shrink-0 bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaMedal />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">
                                Watch & Win Daily
                            </p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                We’ll be revealing 1 lucky number per day on our Instagram page.
                                Follow our story highlights and posts at @shrilalmahalgroup.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="shrink-0 bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaHourglassHalf />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">
                                How It Works
                            </p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                Your ticket has 7 random numbers. We’ll reveal 1 number every 24 hours.
                                At the end of the cycle, compare your numbers — matched enough? You win!
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="shrink-0 bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <RiMedalLine />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">
                                Act Fast — Limited Prizes!
                            </p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                There are only a few winners allowed per tier (7/7, 6/7, 5/7, 4/7).
                                First to claim = First to win.
                                If you match: go to the "Claim Your Prize" section, enter your Ticket ID,
                                matched count, and upload a screenshot. Submit quickly before your tier fills up!
                            </p>
                        </div>
                    </div>




                </div>


                {/* Right: Form */}
                <div className="px-4 pt-[40px]">
                    <ClaimTicketForm />
                </div>
            </div>
        </section>
    );
};

export default ClaimTicketSection;
