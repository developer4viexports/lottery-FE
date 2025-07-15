import React from 'react';
import ClaimForm from './ClaimForm';

export default function ClaimFormSection() {
    return (
        <section className="bg-black py-16 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">

                {/* Left Side Content */}
                <div className="text-white">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Claim Your Ticket</h2>
                    <p className="text-gray-300 text-sm leading-relaxed">
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
