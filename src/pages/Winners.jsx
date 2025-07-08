import React, { useState, useEffect } from "react";
import bgImage from "../assets/image3.png";
import { submitClaim, getWinningTickets } from "../api/api";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

export default function Winners() {
    const [form, setForm] = useState({
        ticketID: "",
        name: "",
        email: "",
        phone: "",
        instagram: "",
        ticketImage: null,
        proofImage: null,
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [winners, setWinners] = useState([]);

    useEffect(() => {
        getWinningTickets()
            .then(setWinners)
            .catch((err) => {
                console.error("Failed to load winners:", err.message);
                setWinners([]);
            });
    }, []);

    const validate = () => {
        const errs = {};
        const cleanedPhone = form.phone.replace(/\D/g, '');

        if (!form.ticketID.trim()) errs.ticketID = "Ticket ID is required";
        if (!form.name.trim()) errs.name = "Name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
        if (cleanedPhone.length < 10 || cleanedPhone.length > 15) errs.phone = "Phone must include country code and be valid";
        if (!/^@[\w.]+$/.test(form.instagram)) errs.instagram = "Instagram must start with @ and use only letters, numbers, dot or underscore";
        if (!form.ticketImage) errs.ticketImage = "Ticket image is required";
        if (!form.proofImage) errs.proofImage = "Proof of task is required";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value); // Includes text + File inputs
        });

        try {
            await submitClaim(formData);
            setSubmitted(true);
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit claim. Please try again.");
        }
    };


    return (
        <section
            className="min-h-screen bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-xl shadow-2xl">
                <header className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-4">
                        🏆 Winners Announcement
                    </h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Congratulations! If your ticket number appears below, submit the
                        claim form so we can manually verify your entry.
                    </p>
                </header>

                <section className="bg-white shadow rounded-lg p-6 mb-10">
                    <h2 className="text-xl font-semibold mb-6 text-blue-700 flex items-center gap-2">
                        <span>🎫</span> Winning Ticket Numbers
                    </h2>

                    {winners.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {winners.map((ticket) => (
                                <div
                                    key={ticket._id || ticket.ticketID}
                                    className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-sm p-4 transition hover:shadow-md"
                                >
                                    <p className="text-blue-900 font-semibold text-lg tracking-wide">
                                        {ticket.ticketID}
                                    </p>
                                    <p className="text-gray-700 text-sm mt-1 capitalize">
                                        {ticket.name || "Anonymous"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No winning tickets announced yet.</p>
                    )}
                </section>

                {!submitted ? (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white shadow rounded-lg p-6 space-y-5"
                        encType="multipart/form-data"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-blue-700">
                            🎯 Claim Your Ticket
                        </h2>

                        <InputField
                            label="Winning Ticket ID"
                            name="ticketID"
                            placeholder="e.g. SLM-123456"
                            value={form.ticketID}
                            onChange={handleChange}
                            error={errors.ticketID}
                        />

                        <InputField
                            label="Full Name"
                            name="name"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <PhoneInput
                                country={'in'}
                                value={form.phone}
                                onChange={(phone) => setForm(prev => ({ ...prev, phone: `+${phone}` }))}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                }}
                                inputClass="!w-full !py-2 !pl-12 !pr-4 !border !rounded-md !shadow-sm focus:!ring focus:!ring-blue-300"
                                containerClass="!w-full"
                                buttonClass="!bg-gray-100 !border-r !border-gray-300"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <InputField
                            label="Instagram Handle"
                            name="instagram"
                            placeholder="@yourhandle"
                            value={form.instagram}
                            onChange={handleChange}
                            error={errors.instagram}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Ticket Screenshot (Required)
                            </label>
                            <input
                                type="file"
                                name="ticketImage"
                                accept="image/*"
                                onChange={handleChange}
                                className="mt-1 block w-full text-sm text-gray-700"
                            />
                            {errors.ticketImage && <p className="text-red-500 text-sm mt-1">{errors.ticketImage}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Proof of Task (Story/Post Screenshot)
                            </label>
                            <input
                                type="file"
                                name="proofImage"
                                accept="image/*"
                                onChange={handleChange}
                                className="mt-1 block w-full text-sm text-gray-700"
                            />
                            {errors.proofImage && <p className="text-red-500 text-sm mt-1">{errors.proofImage}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                        >
                            Submit Claim
                        </button>
                    </form>
                ) : (
                    <div className="bg-green-100 text-green-800 text-center p-6 rounded-md shadow">
                        <h3 className="text-xl font-semibold mb-2">🎉 Claim Submitted!</h3>
                        <p>Our team will verify your details and reach out to you shortly.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function InputField({ label, name, value, onChange, placeholder, error, type = "text" }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
