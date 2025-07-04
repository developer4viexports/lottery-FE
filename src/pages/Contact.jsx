import React, { useState } from "react";
import bgImage from "../assets/image3.png"; // adjust path as needed

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
        // TODO: send form data to backend or email handler
        setSubmitted(true);
    };

    return (
        <section
            className="min-h-screen bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-xl shadow-2xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 text-center mb-6">
                    📬 Contact Us
                </h1>
                <p className="text-center text-gray-700 mb-8">
                    We'd love to hear from you. Whether you have a question about your ticket, need assistance, or just want to say hello — our team is ready to help!
                </p>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <ContactInput
                            label="Full Name"
                            name="name"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        <ContactInput
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <ContactInput
                            label="Phone Number"
                            name="phone"
                            placeholder="+91-XXXXXXXXXX"
                            value={form.phone}
                            onChange={handleChange}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                rows="4"
                                required
                                placeholder="Type your message here..."
                                value={form.message}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                        >
                            Send Message
                        </button>
                    </form>
                ) : (
                    <div className="bg-green-100 text-green-800 text-center p-6 rounded-md shadow">
                        <h3 className="text-xl font-semibold mb-2">✅ Message Sent!</h3>
                        <p>Thank you for reaching out. Our team will respond to you shortly.</p>
                    </div>
                )}

                <div className="mt-10 text-center text-gray-600 text-sm">
                    <p>📍 Shri Lal Mahal Group Headquarters</p>
                    <p>B-16, Bhagwan Dass Nagar, Punjabi Bagh, New Delhi 110026, India</p>
                    <p className="mt-1">📞 +91-99999-99999 &nbsp; | &nbsp; ✉️ support@shrilalmahal.com</p>
                </div>
            </div>
        </section>
    );
}

function ContactInput({ label, name, placeholder, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                required
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
            />
        </div>
    );
}
