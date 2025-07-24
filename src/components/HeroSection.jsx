import React from "react";
import LandingForm from "./LandingForm";

export default function HeroSection() {
    return (
        <section className="relative w-full py-12 md:py-20 overflow-hidden">
            {/* Diagonal Top Slice */}
            <div
                className="absolute top-0 left-0 w-full h-20 bg-white z-0"
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start pt-12">

                {/* Left Text Section */}
                <div className="text-left py-5 px-4">
                    <h2 className="text-3xl font-bold text-[#3A1F1F] mb-6">What You Get</h2>
                    <ul className="list-disc list-inside text-gray-800 leading-loose text-base space-y-2">
                        <li>Official lottery with unique number</li>
                        <li>Chance to win premium rice supplies</li>
                        <li>Exclusive discount coupons</li>
                        <li>Kitchen essentials and accessories</li>
                        <li>Entry into monthly grand prize draw</li>
                    </ul>
                </div>

                {/* Right: Form */}
                <div className="px-4">
                    <LandingForm />
                </div>
            </div>
        </section>
    );
}
