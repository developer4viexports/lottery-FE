// src/pages/Winners.jsx
import React, { useEffect, useState } from 'react';
import WinnerHero from '../components/WinnerHero';
import TicketDisplay from '../components/TicketDisplay';
import ClaimFormSection from '../components/ClaimFormSection';
import Footer from '../components/Footer';
import { getWinningTickets } from '../api/api';
import Header from '../components/Header';
import background from '../assets/homeBg.png'; // Make sure this path is correct


export default function Winners() {
    const [winners, setWinners] = useState([]);

    useEffect(() => {
        getWinningTickets()
            .then(setWinners)
            .catch(() => setWinners([]));
    }, []);

    return (
        <>
            <div className="w-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${background})` }}
            >
                <Header />
                <WinnerHero />
                <TicketDisplay winners={winners} />
            </div>
            <ClaimFormSection />
            <Footer />
        </>
    );
}