import React, { useState } from "react";
import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaUser,
    FaUpload,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { submitContactMessage } from "../api/api.js";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        file: null,
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const allowedTypes = ["image/", "video/", "application/pdf"];
        const isValidType = allowedTypes.some((type) =>
            selectedFile.type.startsWith(type)
        );

        if (!isValidType) {
            alert("Only images, videos, or PDF files are allowed.");
            return;
        }

        setForm((prev) => ({ ...prev, file: selectedFile }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("message", form.message);
        if (form.file) {
            formData.append("file", form.file);
        }

        try {
            await submitContactMessage(formData);
            setSubmitted(true);
        } catch (err) {
            alert(err.message || "Failed to send message");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />

            {/* Main Content Section */}
            <section className="flex-1 max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div>
                    <h2 className="text-4xl font-bold mb-6 text-[#402813]">Contact Us</h2>
                    <p className="text-[#4B4642] mb-8 max-w-md">
                        We'd love to hear from you. Whether you have a question about your ticket,
                        need assistance, or just want to say hello — our team is ready to help!
                    </p>
                    <div className="space-y-5 text-lg text-[#4B4642]">
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
                <div className="bg-gradient-to-br from-[#ffffffaa] to-[#fbe6d6] border border-gray-200 shadow-md rounded-xl p-6 sm:p-8">
                    <h3 className="text-2xl font-semibold mb-6 text-[#402813] text-center">
                        Feel free to ask your question
                    </h3>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <InputField
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                icon={<FaUser />}
                            />

                            <InputField
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                icon={<FaPhoneAlt />}
                            />

                            <InputField
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                icon={<FaEnvelope />}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    required
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Type your message..."
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <FileInputField
                                name="file"
                                placeholder="Upload File (Image, Video, or PDF)"
                                icon={<FaUpload />}
                                onChange={handleFileChange}
                                file={form.file}
                            />

                            <button
                                type="submit"
                                className="w-full bg-[#84282D] hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
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
            </section>

            <Footer />
        </div>
    );
}

// Input Field Component
function InputField({ name, type = "text", value, onChange, placeholder, icon }) {
    return (
        <div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                    {icon}
                </span>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    placeholder={placeholder}
                    className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                />
            </div>
        </div>
    );
}

// File Input Component
function FileInputField({ name, placeholder, icon, onChange, file }) {
    return (
        <div>
            <label className="relative w-full bg-white rounded-full border px-4 py-2 flex items-center justify-between cursor-pointer overflow-hidden">
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">{icon}</span>
                    <span className="text-gray-700 text-sm">{placeholder}</span>
                </div>
                <div className="flex items-center gap-2 z-10">
                    {file ? (
                        <span className="text-sm text-green-600 truncate max-w-[140px]">
                            {file.name}
                        </span>
                    ) : (
                        <span className="text-sm text-gray-600 font-medium">Choose File</span>
                    )}
                </div>
                <input
                    type="file"
                    name={name}
                    accept="image/*,video/*,application/pdf"
                    onChange={onChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </label>
        </div>
    );
}
