import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import background from '../assets/homeBg.png'; // Make sure this path is correct
import TierPrizes from '../components/TierPrizes';
import Footer from '../components/Footer';
import FocusSection from '../components/FocusSection';

export default function Home() {
    return (
        <>
            <div
            className=" w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background})` }}
        >
            <Header />
            <TierPrizes />
            </div>
            <HeroSection />
            <FocusSection />
            {/* <TicketPreview data={ticketData} /> */}
            {/* <LandingForm /> */}
            <Footer />
        </>
    );
}
