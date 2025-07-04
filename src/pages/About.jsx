import React from "react";
import {
    FaGlobeAsia,
    FaUsers,
    FaMapMarkerAlt,
    FaCalendarAlt,
} from "react-icons/fa";
import bgImage from "../assets/image3.png"; // adjust path if needed

export default function About() {
    return (
        <section
            className="min-h-screen bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-10"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* translucent card */}
            <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-10">
                {/* Hero */}
                <header className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-4">
                        About Shri Lal Mahal Group
                    </h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Since&nbsp;1907 we’ve set the benchmark for food standards worldwide,
                        pioneering premium&nbsp;
                        <span className="font-semibold">Basmati Rice</span> and exporting
                        quality to every continent.
                    </p>
                </header>

                {/* Stats */}
                <div className="grid gap-8 grid-cols-2 sm:grid-cols-4 text-center mb-14">
                    <Stat icon={<FaCalendarAlt />} label="Founded" value="1907" />
                    <Stat icon={<FaUsers />} label="Employees" value="500 – 1 000" />
                    <Stat icon={<FaGlobeAsia />} label="Operations" value="5 Continents" />
                    <Stat icon={<FaMapMarkerAlt />} label="HQ" value="New Delhi (IN)" />
                </div>

                {/* History + Mission */}
                <article className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-blue-700 mb-2">
                            Our Journey
                        </h2>
                        <p>
                            What began as a small business house in&nbsp;1907 has grown into a
                            multi-national conglomerate — a trusted name in
                            <strong> Food &amp; Beverage Services</strong>. Our unwavering
                            commitment to quality and innovation has propelled Shri Lal Mahal
                            Group into markets across the globe, earning us the title
                            <em className="whitespace-nowrap">
                                “The World Leader in Basmati”
                            </em>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-700 mb-2">
                            Why We Stand Out
                        </h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                Over <strong>100&nbsp;years</strong> of heritage &amp; expertise
                            </li>
                            <li>
                                <strong>Benchmark</strong> food-safety and quality standards
                            </li>
                            <li>
                                State-of-the-art milling, packaging &amp; supply chain
                            </li>
                            <li>
                                Consistently growing <strong>global turnover</strong>
                            </li>
                        </ul>
                    </section>

                    <a
                        href="https://shrilalmahal.org/about-us"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition"
                    >
                        Learn more at&nbsp;shrilalmahal.org →
                    </a>
                </article>

                {/* Location */}
                <footer className="mt-10 text-center text-gray-600 text-sm">
                    Headquarters: B-16, Bhagwan Dass Nagar, Punjabi Bagh, New Delhi 110026 India
                </footer>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────── */
function Stat({ icon, label, value }) {
    return (
        <div className="flex flex-col items-center">
            <div className="text-blue-600 text-3xl mb-2">{icon}</div>
            <dt className="text-gray-600 text-xs sm:text-sm uppercase tracking-wider">
                {label}
            </dt>
            <dd className="text-lg sm:text-xl font-semibold text-gray-900">
                {value}
            </dd>
        </div>
    );
}
