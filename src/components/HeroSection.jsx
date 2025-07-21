import React from "react";
import LandingForm from "./LandingForm";

export default function HeroSection() {
    return (
        <section className="relative w-full bg-[#FFF7E8] py-12 md:py-20 overflow-hidden">

            {/* Diagonal Top Slice - Made more subtle */}
            <div
                className="absolute top-0 left-0 w-full h-20 bg-white z-0"
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start pt-12">

                {/* Left Text */}
                <div className="text-left py-5 px-4">
                    <h2 className="text-3xl font-bold text-[#3A1F1F] mb-4">Lucky Ticket Form</h2>
                    <p className="text-gray-800 leading-relaxed text-base">
                        an exclusive opportunity to enter a realm where fortune favors the bold. This Lucky Ticket Form
                        is your portal to potential rewards, unforeseen surprises, and life-enhancing prizes. By completing
                        this form, you embark on a serendipitous journey defined by chance, destiny, and unprecedented
                        opportunity. Engage with curiosity, complete with intention, and prepare to transform your ordinary
                        day into an extraordinary one. Your moment of serendipity is just a few keystrokes away.<br /><br />
                        Don't just believe in luck—activate it. Your lucky break begins now
                    </p>
                </div>

                {/* Right: Form */}
                <div className="px-4">
                    <LandingForm />
                </div>
            </div>
        </section>
    );
}