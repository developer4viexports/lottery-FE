import React from 'react';
// import bgImage from '../assets/homeBg.png';

export default function WinnerHero() {
    return (
        <section
            className="relative bg-cover bg-center text-[#402813] py-20 px-4 text-center"
            // style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Winners Announcement</h1>
                <p className="text-sm sm:text-base text-[#4B4642] mb-6">
                    Congratulations! If your ticket number appears below, submit the claim form<br />
                    so we can manually verify your entry
                </p>
                <div className="inline-block bg-[#84282D] text-white font-medium px-6 py-2 rounded-full shadow-sm text-sm tracking-wide">
                    Winning Ticket Numbers
                </div>
            </div>
        </section>
    );
}
