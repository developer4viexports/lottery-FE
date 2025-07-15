// src/pages/Winners.jsx
import React, { useEffect, useState } from 'react';
import WinnerHero from '../components/WinnerHero';
import TicketDisplay from '../components/TicketDisplay';
import ClaimFormSection from '../components/ClaimFormSection';
import Footer from '../components/Footer';
import { getWinningTickets } from '../api/api';
import Header from '../components/Header';

export default function Winners() {
    const [winners, setWinners] = useState([]);

    useEffect(() => {
        getWinningTickets()
            .then(setWinners)
            .catch(() => setWinners([]));
    }, []);

    return (
        <div className="min-h-screen bg-[#1b0e0b] text-white">
            <Header />
            <WinnerHero />
            <TicketDisplay winners={winners} />
            <ClaimFormSection />
            <Footer />
        </div>
    );
}