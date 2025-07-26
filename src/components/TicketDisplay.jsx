import React from 'react';

export default function TicketDisplay({ winners }) {
    return (
        <section className=" py-14 px-4 sm:px-6 bg-[#FFF7ED]">
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
                {winners.map((ticket, idx) => (
                    <div
                        key={ticket._id || idx}
                        className="relative bg-[#EDEDED] rounded-md shadow-lg w-full mx-auto max-w-md text-center"
                    >
                        {/* Left and right half-circle cuts */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a0b0c] rounded-full z-10" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a0b0c] rounded-full z-10" />

                        {/* Dashed cut in center */}
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full border-l-[6px] border-dotted border-[#1a0b0c] z-0 opacity-70" />

                        {/* Ticket content */}
                        <div className="relative z-10 px-8 py-6">
                            <p className="text-xl font-bold tracking-wide text-[#2b2b2b]">{ticket.ticketID}</p>
                            {/* <p className="text-sm text-gray-600 mt-1 capitalize">{ticket.name || 'Anonymous'}</p> */}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
