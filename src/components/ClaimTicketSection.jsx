import React from 'react';
import ClaimTicketForm from './ClaimTicketForm'; // adjust path as needed

const ClaimTicketSection = () => {
    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-12">
                {/* Left: Instructions */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#402813] mb-6">
                        How to Claim Your Ticket
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-[#333] text-sm sm:text-base leading-relaxed">
                        <li>Enter your winning Ticket ID</li>
                        <li>
                            Fill in your full name, phone number and email ID and your Instagram handle
                        </li>
                        <li>Click on Submit Claim.</li>
                    </ul>
                </div>

                {/* Right: Form */}
                <div className="w-full md:w-1/2">
                        <ClaimTicketForm />
                </div>
            </div>
        </div>
    );
};

export default ClaimTicketSection;
