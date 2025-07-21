import React from 'react';
import riceImg from '../assets/rice.png';

export default function FocusSection() {
    return (
        <div className="bg-white py-12 px-4 sm:px-10 md:px-20 flex flex-col md:flex-row items-center justify-center gap-12">
            {/* Left: Image */}
            <div className="flex-shrink-0 w-full md:w-1/2 text-center">
                <img
                    src={riceImg}
                    alt="Fitness Brown Basmati Rice"
                    className="w-full max-w-sm mx-auto"
                />
            </div>

            {/* Right: Text */}
            <div className="md:w-1/2 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4c2e1f] mb-4">
                    Our Focus
                </h2>
                <p className="text-gray-700 mb-2 leading-relaxed">
                    Over the years, our aged basmati rice has become a part of almost every Indian kitchen.
                    Each grain of rice takes you through a journey of delectable and savoury flavours.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    Owing to the host of health benefits it adds to the meal, health enthusiasts also favour our brand of Basmati rice.
                </p>

                <button className="bg-[#4c2e1f] text-white px-5 py-2 rounded shadow hover:bg-[#3b2418] transition">
                    Know More
                </button>
            </div>
        </div>
    );
}
