import React from 'react';
import riceImg from '../assets/rice.png';               // Desktop - Fitness Brown Basmati Rice
import rice2Img from '../assets/rice2.png';             // Desktop - Empire Basmati Rice
import riceMobileImg from '../assets/riceMobile.png';   // Mobile - Fitness Brown
import riceMobileImg2 from '../assets/riceMobile2.png'; // Mobile - Empire

export default function FocusSection() {
    return (
        <div className="bg-white py-12 sm:py-[100px] md:py-[100px] px-4 sm:px-10 md:px-20" style={{ backgroundColor: '#FFF7ED' }}>
            <div className="flex flex-col md:flex-row items-center justify-around gap-12">

                {/* Empire Basmati Rice */}
                <div className="text-center">
                    <a href="https://basmati.club/" target="_blank" rel="noopener noreferrer">
                        {/* Desktop Image */}
                        <img
                            src={rice2Img}
                            alt="Empire Basmati Rice"
                            className="hidden md:block w-full max-w-xs mx-auto cursor-pointer hover:scale-105 transition-transform"
                        />
                        {/* Mobile Image */}
                        <img
                            src={riceMobileImg2}
                            alt="Empire Basmati Rice Mobile"
                            className="block md:hidden w-full max-w-xs mx-auto cursor-pointer hover:scale-105 transition-transform"
                        />
                    </a>
                </div>

                {/* Fitness Brown Basmati Rice */}
                <div className="text-center">
                    <a href="https://basmati.club/" target="_blank" rel="noopener noreferrer">
                        {/* Desktop Image */}
                        <img
                            src={riceImg}
                            alt="Fitness Brown Basmati Rice"
                            className="hidden md:block w-full max-w-xs mx-auto cursor-pointer hover:scale-105 transition-transform"
                        />
                        {/* Mobile Image */}
                        <img
                            src={riceMobileImg}
                            alt="Fitness Brown Basmati Rice Mobile"
                            className="block md:hidden w-full max-w-xs mx-auto cursor-pointer hover:scale-105 transition-transform"
                        />
                    </a>
                </div>

            </div>
        </div>
    );
}
