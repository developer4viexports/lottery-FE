import React from "react";
import LandingForm from "./LandingForm";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="w-full h-[800px] flex items-center justify-center px-4 pt-0 pb-16 bg-[url('/confetti-bg.png')] bg-cover bg-center">



            <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-10">

                {/* Left: Animated Heading */}
                <div className="md:w-1/2 text-center md:text-left space-y-2 md:space-y-4 pt-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-lg sm:text-xl font-semibold tracking-wide text-white"
                    >
                        SHRILALMAHAL LUCKY TICKET
                    </motion.h2>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-yellow-300 via-white to-pink-400 text-transparent bg-clip-text pb-4"
                    >
                        Win Big Today!
                    </motion.h1>
                </div>

                {/* Right: Landing Form */}
                <div className="md:w-1/2">
                    <LandingForm />
                </div>
            </div>
        </section>
    );
}
