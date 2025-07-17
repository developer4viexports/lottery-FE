import React, { useState } from "react";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";
import bgImage from "../assets/contactBg.png";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            {/* Hero */}
            <section
                className="relative bg-cover bg-center bg-no-repeat py-16 px-6"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-red-900/80 to-black z-0" />
                <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Contacts Us</h2>
                        <p className="text-gray-300 mb-8 max-w-md">
                            We'd love to hear from you. Whether you have a question about your ticket,
                            need assistance, or just want to say hello — our team is ready to help!
                        </p>
                        <div className="space-y-5 text-lg">
                            <p className="flex items-center gap-3">
                                <FaEnvelope className="text-red-500" />
                                <a href="mailto:support@shrilalmahal.com" className="hover:underline">
                                    support@shrilalmahal.com
                                </a>
                            </p>
                            <p className="flex items-center gap-3">
                                <FaPhoneAlt className="text-red-500" />
                                +91-9999-999999
                            </p>
                            <p className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-red-500 mt-1" />
                                <span>
                                    Headquarters: B-16, Bhagwan Dass Nagar, Punjabi Bagh, <br />
                                    New Delhi 110026 India
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gradient-to-br from-gray-100 to-orange-100 text-black rounded-xl shadow-xl p-6 sm:p-8">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
                            Feel free to ask your question.
                        </h3>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <ContactInput
                                    name="name"
                                    placeholder="Full Name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                                <ContactInput
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                                <ContactInput
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                <div>
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Your Message"
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md font-semibold"
                                >
                                    Send Message
                                </button>
                            </form>
                        ) : (
                            <div className="text-center p-6 text-green-700 font-medium">
                                ✅ Message Sent! We'll get back to you soon.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

function ContactInput({ name, placeholder, value, onChange, type = "text" }) {
    return (
        <input
            type={type}
            name={name}
            required
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
    );
}
