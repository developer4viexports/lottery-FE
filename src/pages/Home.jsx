import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
// import background from '../assets/homeBg.png'; // Make sure this path is correct
import TierPrizes from '../components/TierPrizes';
import Footer from '../components/Footer';
import FocusSection from '../components/FocusSection';
import ActivateFormSection from '../components/ActivateFormSection';
import ClaimTicketSection from '../components/ClaimTicketSection';
import HowYourTicketWorks from '../components/HowYourTicketWorks';
import HowItWorks from '../components/HowItWorks';

export default function Home() {
    return (
        <>

            <Header />
            <HowItWorks />
            <TierPrizes />
            <HowYourTicketWorks />

            {/* Add ID to Hero Section */}
            <div id="generate-ticket">
                <HeroSection />
            </div>

            {/* Add ID to Activate Section */}
            <div id="activate-ticket">
                <ActivateFormSection />
            </div>

            {/* Add ID to Claim Section */}
            <div id="claim-ticket">
                <ClaimTicketSection />
            </div>
            <FocusSection />
            <Footer />
        </>
    );
}
