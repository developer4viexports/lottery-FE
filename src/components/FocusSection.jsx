import React from 'react';
import riceImg from '../assets/rice.png';       // Fitness Brown Basmati Rice
import rice2Img from '../assets/rice2.png';    // Empire Basmati Rice

export default function FocusSection() {
    return (
        <div className="bg-white py-12 px-4 sm:px-10 md:px-20" style={{ backgroundColor: '#FFF7ED' }}>
            <div className="flex flex-col md:flex-row items-center justify-around gap-12">
                {/* Empire Basmati Rice */}
                <div className="text-center">
                    <a href="https://shrilalmahal.org/product/empire-basmati-rice" target="_blank" rel="noopener noreferrer">
                        <img
                            src={rice2Img}
                            alt="Empire Basmati Rice"
                            className="w-full max-w-xs mx-auto cursor-pointer hover:scale-105 transition-transform"
                        />
                    </a>
                </div>

                {/* Fitness Brown Basmati Rice */}
                <div className="text-center">
                    <a href="https://shrilalmahal.org" target="_blank" rel="noopener noreferrer">
                        <img
                            src={riceImg}
                            alt="Fitness Brown Basmati Rice"
                            className="w-full max-w-xs mx-auto cursor-pointer hover:scale-105 transition-transform"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
