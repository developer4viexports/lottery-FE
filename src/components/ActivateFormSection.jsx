import React, { useEffect, useState } from 'react';
import ActivateForm from './ActivateForm';
import { FaInstagram } from 'react-icons/fa6';
import { GiTicket } from 'react-icons/gi';
import { getInstagramPostUrl } from '../api/api';

export default function ActivateFormSection() {
    const [instaUrl, setInstaUrl] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const { url } = await getInstagramPostUrl();
                setInstaUrl(url);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);

    return (
        <section className="relative w-full py-4 md:pb-4 md:pt-8 overflow-hidden">

            {/* Top Rectangle Background */}
            <div className=" w-full h-[40px] md:h-[80px] bg-[#FFF7ED] " />
            {/* Diagonal Top Slice */}
            <div
                className=" w-full h-20 bg-[#FFF7ED] hidden md:block"
                style={{
                    clipPath: 'polygon(0 0, 100% 100%, 100% 0, 0 0)',
                }}
            />


            {/* Content */}
            <div className="relative  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 items-start pt-10 ">
                {/* Right: Form */}
                <div className="px-4">
                    <ActivateForm instaUrl={instaUrl} />
                </div>

                {/* Left Text Section */}
                <div className="text-left py-5 px-4 sm:px-6 md:px-10 pt-[50px] hidden md:block">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#402813] mb-8 leading-snug">
                        Step 2
                    </h2>

                    {/* Step 1 */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="shrink-0 bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaInstagram />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">
                                Comment your ticket number on this{' '}
                                <a
                                    href={instaUrl}  // ← replace with the exact post URL
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#E1306C] font-bold hover:opacity-80"
                                >
                                    Instagram post
                                </a>
                            </p>

                            <p className="text-[#808080] text-xs sm:text-sm">
                                Tag 5 friends in the same comment (Example: “My ticket: SLH-2025-00123 — tagging @friend1 @friend2 @friend3 @friend4 @friend5”)
                            </p>
                        </div>
                    </div>


                    {/* Step 2 */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="shrink-0 bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <FaInstagram />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">
                                Share your ticket in an Instagram Story
                            </p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                Tag @shrilalmahalgroup in the story. Take a screenshot of your story and upload it in the “activate your ticket” form.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div
                            className="shrink-0 bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 text-xl text-gray-700"
                            style={{ boxShadow: '0px 4px 6px 0px #00000017' }}
                        >
                            <GiTicket />
                        </div>
                        <div>
                            <p className="font-semibold text-[#402813] text-sm sm:text-base">
                                To Activate your ticket
                            </p>
                            <p className="text-[#808080] text-xs sm:text-sm">
                                Fill the ticket ID and your phone number/email address used when generating the ticket and upload screenshots as proof of task completion.
                            </p>
                        </div>
                    </div>


                </div>



            </div>
        </section>
    );
}
