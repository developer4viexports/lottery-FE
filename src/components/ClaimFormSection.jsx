import React from 'react';
import ClaimForm from './ClaimForm';

export default function ClaimFormSection() {
    return (
        <section className="relative w-full bg-[#FFF7E8] py-12 md:py-20 overflow-hidden">

            {/* Diagonal Top Slice - Made more subtle */}
            <div
                className="absolute top-0 left-0 w-full h-20 bg-white z-0"
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)',
                }}
            />
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start pt-12">

                {/* Left Side Content */}
                <div className="text-black">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#402813]">Claim Your Ticket</h2>
                    <p className="text-[#4B4642] text-sm leading-relaxed">
                        Congratulations! If your ticket number appears below, submit the form
                        so we can manually verify your entry.
                    </p>
                </div>

                {/* Right Side Form - no wrapper styling */}
                <div className="w-full max-w-md ml-auto">
                    <ClaimForm onSubmitted={() => { }} />
                </div>
            </div>
        </section>
    );
}
