import React from "react";
import {
    FaGlobeAsia,
    FaUsers,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaCheckCircle,
} from "react-icons/fa";
// import bgImage from "../assets/homeBg.png";
import riceImage from "../assets/riceProducts.png"; // make sure to have this image
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
    return (
        <div className="min-h-screen text-white">
            {/* Hero Section */}
            <section
                // className="relative bg-cover bg-center text-white   text-center"
                // style={{ backgroundImage: `url(${bgImage})` }}
            >
                <Header />
                <div className="absolute inset-0  z-0 " />
                <div className="relative z-10 max-w-4xl mx-auto py-20">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-[#402813]">About Shri Lal Mahal Group</h1>
                    <p className="text-sm sm:text-base text-[#4B4642] mb-6">
                        Congratulations! If your ticket number appears below, submit the claim form<br />
                        so we can manually verify your entry
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-6">
                        <StatCard icon={<FaCalendarAlt />} label="Founded" value="1907" />
                        <StatCard icon={<FaUsers />} label="Employees" value="500-1000" />
                        <StatCard icon={<FaGlobeAsia />} label="Operations" value="5 Continents" />
                        <StatCard icon={<FaMapMarkerAlt />} label="HQ" value="New Delhi (IN)" />
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className=" text-[black] py-16 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#4B4642]">Our Journey</h2>
                        <p className="text-[#4B4642] leading-relaxed">
                            What began as a small business house in 1907 has grown into a multi-national conglomerate —
                            a trusted name in Food & Beverage Services. Our unwavering commitment to quality and innovation
                            has propelled Shri Lal Mahal Group into markets across the globe, earning us the title
                            <strong> “The World Leader in Basmati”.</strong>
                        </p>
                    </div>
                    <img src={riceImage} alt="Shri Lal Mahal Products" className="w-full rounded-lg shadow-lg" />
                </div>

                {/* Standout Section */}
                <div className="max-w-5xl mx-auto mt-12">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#4B4642]">Why We Stand Out</h2>
                    <ul className="grid sm:grid-cols-2 gap-6 text-[#4B4642]">
                        <li className="flex items-start gap-3">
                            <FaCheckCircle className="mt-1 text-green-500" />
                            Over <strong>100 years</strong> of heritage & expertise
                        </li>
                        <li className="flex items-start gap-3">
                            <FaCheckCircle className="mt-1 text-green-500" />
                            Benchmark food-safety and quality standards
                        </li>
                        <li className="flex items-start gap-3">
                            <FaCheckCircle className="mt-1 text-green-500" />
                            State-of-the-art milling, packaging & supply chain
                        </li>
                        <li className="flex items-start gap-3">
                            <FaCheckCircle className="mt-1 text-green-500" />
                            Consistently growing global turnover
                        </li>
                    </ul>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-[#4A181B] rounded-lg shadow-md p-4 text-center flex flex-col justify-center items-center ">
            <div className="text-2xl text-red-500 mb-2">{icon}</div>
            <div className="text-sm uppercase text-gray-400">{label}</div>
            <div className="text-lg font-semibold text-white">{value}</div>
        </div>
    );
}
