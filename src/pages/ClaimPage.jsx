import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClaimTicketForm from '../components/ClaimTicketForm';

export default function ClaimPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#84282D]">
            🎟️ Claim Your Ticket
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Please enter your valid ticket information to claim your prize.
          </p>
          <ClaimTicketForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
