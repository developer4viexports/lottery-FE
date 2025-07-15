import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { submitClaim } from '../api/api';
import {
    FaTicketAlt, FaUser, FaEnvelope, FaPhone,
    FaInstagram, FaCheckCircle, FaUpload
} from 'react-icons/fa';

export default function ClaimForm({ onSubmitted }) {
    const [form, setForm] = useState({
        ticketID: '',
        name: '',
        email: '',
        phone: '',
        instagram: '',
        ticketImage: null,
        proofImage: null,
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

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
            formData.append(key, value);
        });

        try {
            await submitClaim(formData);
            setSubmitted(true);
            onSubmitted?.();
        } catch (error) {
            const resData = error?.response;
            if (resData?.field && resData?.message) {
                setErrors(prev => ({ ...prev, [resData.field]: resData.message }));
            } else if (resData?.message?.includes("Duplicate")) {
                const msg = resData.message;
                const newErrors = {};

                if (msg.includes("phone")) newErrors.phone = "Phone already used in this competition.";
                if (msg.includes("instagram")) newErrors.instagram = "Instagram already used in this competition.";
                if (msg.includes("ticket")) newErrors.ticketID = "Ticket already claimed.";

                setErrors(prev => ({ ...prev, ...newErrors }));
            } else {
                alert(resData?.message || "Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="py-10 px-4">
            <div className="bg-gradient-to-br from-[#e8e1dc] to-[#c5bdb8] border border-gray-200 shadow-md rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-black text-left">Claim Your Ticket</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField
                        name="ticketID"
                        value={form.ticketID}
                        error={errors.ticketID}
                        onChange={handleChange}
                        placeholder="Winning Ticket ID"
                        icon={<FaTicketAlt />}
                    />
                    <InputField
                        name="name"
                        value={form.name}
                        error={errors.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        icon={<FaUser />}
                    />
                    <PhoneField
                        value={form.phone}
                        error={errors.phone}
                        onChange={(val) => setForm((prev) => ({ ...prev, phone: `+${val}` }))}
                    />
                    <InputField
                        name="email"
                        type="email"
                        value={form.email}
                        error={errors.email}
                        onChange={handleChange}
                        placeholder="Email"
                        icon={<FaEnvelope />}
                    />
                    <InputField
                        name="instagram"
                        value={form.instagram}
                        error={errors.instagram}
                        onChange={handleChange}
                        placeholder="Instagram Handle"
                        icon={<FaInstagram />}
                    />
                    <FileInputField
                        name="ticketImage"
                        placeholder="Upload Ticket Screenshot"
                        icon={<FaUpload />}
                        onChange={handleChange}
                        error={errors.ticketImage}
                    />
                    <FileInputField
                        name="proofImage"
                        placeholder="Upload Proof of Task"
                        icon={<FaUpload />}
                        onChange={handleChange}
                        error={errors.proofImage}
                    />

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        Submit Claim
                    </button>
                </form>

                {submitted && (
                    <p className="text-green-600 text-sm mt-4">Your claim has been submitted successfully!</p>
                )}
            </div>
        </div>
    );
}

// Input field with icon
function InputField({ name, type = 'text', value, error, onChange, placeholder, icon }) {
    return (
        <div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">{icon}</span>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required
                    className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300 text-black"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

// Phone input field
function PhoneField({ value, onChange, error }) {
    return (
        <div>
            <div className="relative">
                <PhoneInput
                    country={'in'}
                    value={value}
                    onChange={onChange}
                    inputProps={{ name: 'phone', required: true }}
                    inputClass="!w-full !pl-12 !py-2 !pr-4 !border !rounded-md !shadow-sm !text-black focus:!ring focus:!ring-blue-300"
                    containerClass="!w-full"
                    buttonClass="!bg-gray-100 !border-r !border-gray-300"
                />
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

// File input field with icon and file name
function FileInputField({ name, placeholder, icon, onChange, error }) {
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : null);
        onChange(e);
    };

    return (
        <div>
            <div className="relative w-full bg-white rounded-full border px-4 py-2 flex items-center justify-between cursor-pointer overflow-hidden">
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">{icon}</span>
                    <span className="text-gray-700 text-sm">{placeholder}</span>
                </div>
                <div className="flex items-center gap-2 z-10">
                    {fileName ? (
                        <>
                            <span className="text-sm text-green-600 truncate max-w-[120px]">{fileName}</span>
                            <FaCheckCircle className="text-green-500" />
                        </>
                    ) : (
                        <span className="text-sm text-gray-600 font-medium">Choose File</span>
                    )}
                </div>
                <input
                    type="file"
                    name={name}
                    accept="image/*,video/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
