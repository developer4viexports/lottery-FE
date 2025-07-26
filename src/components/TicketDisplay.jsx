import React from 'react';

export default function TicketDisplay({ winners }) {
    return (
        <section className="py-14 px-4 sm:px-6 bg-[#FFF7ED]">
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
                {winners.map((ticket, idx) => (
                    <div key={ticket._id || idx} className="relative w-full max-w-[400px] h-[90px]">
                        {/* Main ticket body */}
                        <div
                            className="relative flex items-center justify-between overflow-hidden w-full h-full rounded-lg"
                            style={{
                                backgroundColor: '#84282D',
                            }}
                        >
                            {/* Left notch */}
                            <div
                                className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-[#FFF7ED] rounded-full"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                }}
                            />

                            {/* Right notch */}
                            <div
                                className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-[#FFF7ED] rounded-full"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                }}
                            />

                            {/* Dashed perforation line */}
                            <div
                                className="absolute top-0 bottom-0 border-l-[2.5px] border-dashed border-white"
                                style={{
                                    left: '40px',
                                }}
                            />

                            {/* Ticket content */}
                            <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
                                <div className="text-center w-full">
                                    <div
                                        className="text-white font-bold break-words"
                                        style={{
                                            fontSize: '16px',
                                            fontFamily: 'Inter, sans-serif',
                                        }}
                                    >
                                        {ticket.ticketID}
                                    </div>
                                    <div
                                        className="text-white capitalize"
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Inter, sans-serif',
                                            opacity: 0.8,
                                            marginTop: '2px',
                                        }}
                                    >
                                        {/* {ticket.name || 'Anonymous'} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
