import React from 'react';
import ActivateForm from './ActivateForm';

export default function ActivateFormSection() {
    return (
        <section className="relative w-full bg-white py-10 px-4 sm:px-6 md:py-20 overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

                {/* Left Side Content */}
                <div className="text-black">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#402813] sm:pt-20">
                        Activate Your Ticket
                    </h2>
                    <p className="text-[#4B4642] text-sm sm:text-base leading-relaxed">
                        Congratulations! If your ticket number appears below, submit the form
                        so we can manually verify your entry.
                    </p>
                </div>

                {/* Right Side Form */}
                <div className="w-full max-w-md md:ml-auto">
                    <ActivateForm onSubmitted={() => { }} />
                </div>
            </div>
        </section>
    );
}
