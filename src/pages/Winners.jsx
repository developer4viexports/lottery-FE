// src/pages/Winners.jsx
import React, { useEffect, useState } from 'react';
import WinnerHero from '../components/WinnerHero';
import TicketDisplay from '../components/TicketDisplay';
import Footer from '../components/Footer';
import { getWinningTickets } from '../api/api';
import Header from '../components/Header';
import FocusSection from '../components/FocusSection';

export default function Winners() {
    const [winners, setWinners] = useState([]);

    useEffect(() => {
        getWinningTickets()
            .then(setWinners)
            .catch(() => setWinners([]));
    }, []);

    return (
        <>

            <Header />
            <WinnerHero />
            <TicketDisplay winners={winners} />
            <FocusSection />
            <Footer />
        </>
    );
}