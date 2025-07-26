import React from 'react';
import ticketImage from '../assets/hand.png'; // Update path if needed
import { FaCheckCircle } from 'react-icons/fa';

const TicketInstructions = () => {
    return (
        <div className="bg-[#FFF7F0] py-12 px-4 sm:px-6 lg:px-16">
            <div className="flex flex-col md:flex-row items-center gap-10 max-w-7xl mx-auto">
                {/* Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src={ticketImage}
                        alt="Lottery Ticket"
                        className="w-full max-w-xs sm:max-w-sm"
                    />
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2 text-[#402813]">
                    <h2 className="text-xl sm:text-2xl font-bold mb-8 leading-snug">
                        How to Get Your Regular<br className="block sm:hidden" />
                        & Super Prize Tickets
                    </h2>

                    {/* Regular Ticket */}
                    <div className="mb-8">
                        <h3 className="font-semibold text-base sm:text-lg mb-3">For a Regular Ticket</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-[#84282D] min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px]" />
                                <span className="text-sm sm:text-base leading-relaxed">
                                    Follow our official Instagram handle.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-[#84282D] min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px]" />
                                <span className="text-sm sm:text-base leading-relaxed">
                                    Comment your ticket number on the post.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-[#84282D] min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px]" />
                                <span className="text-sm sm:text-base leading-relaxed">
                                    Share your ticket in your Instagram story and tag 5 friends in your story.
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Super Prize Ticket */}
                    <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-3">For a Super Prize Ticket</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-[#84282D] min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px]" />
                                <span className="text-sm sm:text-base leading-relaxed">
                                    Purchase rice from our brand
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-[#84282D] min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px]" />
                                <span className="text-sm sm:text-base leading-relaxed">
                                    Follow the rest of the steps given for a regular ticket
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketInstructions;
