import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { submitActivate } from '../api/api';
import {
    FaTicketAlt, FaUser, FaEnvelope, FaPhone,
    FaInstagram, FaCheckCircle, FaUpload
} from 'react-icons/fa';

export default function ActivateForm({ onSubmitted, instaUrl }) {
    const [form, setForm] = useState({
        ticketID: '',
        name: '',
        instagram: '',
        ticketImage: null, // <-- updated from ticketImage
        proofImage: null,
    });


    const [contactValue, setContactValue] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const errs = {};

        if (!form.ticketID.trim()) errs.ticketID = "Ticket ID is required";
        // if (!form.name.trim()) errs.name = "Name is required";

        if (!contactValue.trim()) {
            errs.contact = "Email or phone is required";
        } else if (contactValue.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactValue)) {
                errs.contact = "Invalid email format";
            }
        } else {
            const cleanedPhone = contactValue.replace(/\D/g, '');
            if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
                errs.contact = "Phone number must be valid and include country code";
            }
        }

        // if (!/^@[\w.]+$/.test(form.instagram)) {
        //     errs.instagram = "Instagram must start with @ and use only letters, numbers, dot or underscore";
        // }

        if (!form.proofImage) errs.proofImage = "Comment proof is required";
        if (!form.ticketImage) errs.ticketImage = "Story proof is required"; // ✅ match input name


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

        // Add either email or phone, plus optional countryCode
        if (contactValue.includes('@')) {
            formData.append('email', contactValue);
        } else {
            const cleaned = contactValue.replace(/\D/g, '');
            const countryCode = cleaned.length > 10 ? cleaned.slice(0, cleaned.length - 10) : '';
            const phoneNumber = `+${cleaned}`;
            formData.append('phone', phoneNumber);
            formData.append('countryCode', countryCode);
        }

        // Add optional name & instagram if they exist
        if (form.name) formData.append('name', form.name);
        if (form.instagram) formData.append('instagram', form.instagram);

        try {
            await submitActivate(formData);
            setSubmitted(true);
            onSubmitted?.();
        } catch (error) {
            const resData = error?.response;
            if (resData?.field && resData?.message) {
                setErrors(prev => ({ ...prev, [resData.field]: resData.message }));
            } else if (resData?.message?.includes("Duplicate")) {
                const msg = resData.message;
                const newErrors = {};

                if (msg.includes("phone") || msg.includes("email")) {
                    newErrors.contact = "This contact is already used in this competition.";
                }
                if (msg.includes("ticket")) newErrors.ticketID = "Ticket already claimed.";

                setErrors(prev => ({ ...prev, ...newErrors }));
            } else {
                alert(resData?.message || "Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="w-full">
            <div className="max-w-xl w-full bg-gradient-to-br from-[#ffffffaa] to-[#84282D66] border border-gray-200 shadow-md rounded-xl p-6 sm:p-8 mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-black text-left hidden md:block">Activate Your Ticket</h2>
                <h2 className="text-xl font-bold mb-6 text-black text-left text-center block md:hidden">Step 2: Activate Your Ticket </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField
                        name="ticketID"
                        value={form.ticketID}
                        error={errors.ticketID}
                        onChange={handleChange}
                        placeholder="Ticket ID"
                        icon={<FaTicketAlt />}
                    />
                    {/* 
                    <InputField
                        name="name"
                        value={form.name}
                        error={errors.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        icon={<FaUser />}
                    /> */}

                    <SmartContactInput
                        value={contactValue}
                        setValue={(val) => {
                            setContactValue(val);
                            setErrors(prev => ({ ...prev, contact: '' }));
                        }}
                        error={errors.contact}
                    />

                    {/* <div>
                        <div className="relative">
                            <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                            <input
                                type="text"
                                name="instagram"
                                value={form.instagram}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!value.startsWith('@')) {
                                        setForm(prev => ({ ...prev, instagram: '@' + value.replace(/@/g, '') }));
                                    } else {
                                        setForm(prev => ({ ...prev, instagram: value }));
                                    }
                                    setErrors(prev => ({ ...prev, instagram: '' }));
                                }}
                                placeholder="@yourhandle"
                                className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300 text-black"
                            />
                        </div>
                        {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
                    </div> */}

                    <FileInputField
                        name="proofImage"
                        placeholder="Comment Proof"
                        icon={<FaUpload />}
                        onChange={handleChange}
                        error={errors.proofImage}
                        instaUrl={instaUrl} // Pass the Instagram URL prop
                    />

                    <FileInputField
                        name="ticketImage"
                        placeholder="Story Proof"
                        icon={<FaUpload />}
                        onChange={handleChange}
                        error={errors.ticketImage}
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#84282D] hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        Submit
                    </button>
                </form>

                {submitted && (
                    <p className="text-green-600 text-sm mt-4">Your claim has been submitted successfully!</p>
                )}
            </div>
        </div>
    );
}

// Input with icon
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

// Smart input for phone/email with live type detection
function SmartContactInput({ value, setValue, error }) {
    // Detecting phone only if no @ or letters and 8+ digits
    const cleaned = value.replace(/\D/g, '');
    const containsAtOrLetters = /[@a-zA-Z]/.test(value);
    const isDigitsOnly = /^\+?[0-9\s\-().]*$/.test(value);
    const isLikelyPhone = !containsAtOrLetters && isDigitsOnly && cleaned.length >= 8;

    const handlePhoneChange = (val) => {
        setValue(val ? `+${val}` : '');
    };

    const handleTextChange = (e) => {
        const input = e.target.value;
        setValue(input);
    };

    return (
        <div>
            <div className="relative transition-all duration-150 ease-in-out">
                {isLikelyPhone ? (
                    <>
                        <PhoneInput
                            country={'in'}
                            value={value.replace('+', '')}
                            onChange={handlePhoneChange}
                            inputProps={{
                                name: 'contact',
                                required: true,
                                // autoFocus: true,
                            }}
                            inputClass="!w-full !pl-12 !py-2 !pr-4 !border !rounded-md !shadow-sm !text-black focus:!ring focus:!ring-blue-300"
                            containerClass="!w-full"
                            buttonClass="!bg-gray-100 !border-r !border-gray-300"
                        />
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </>
                ) : (
                    <>
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                        <input
                            type="text"
                            name="contact"
                            value={value}
                            onChange={handleTextChange}
                            placeholder="Enter email or phone number"
                            autoComplete="off"
                            // autoFocus
                            className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300 text-black transition-all duration-150"
                        />
                    </>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}


// File input with icon and file name
function FileInputField({ name, placeholder, icon, onChange, error, instaUrl }) {
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : null);
        onChange(e);
    };

    return (
        <div>
            <label className="relative w-full bg-white rounded-full border px-4 py-2 flex items-center justify-between cursor-pointer overflow-hidden">
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
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </label>
            {name == 'proofImage' && (
                <p className="block md:hidden text-[13px] text-black font-semibold leading-[1.4] mt-1">
                    Comment your ticket number on the{' '}
                    <a
                        href={instaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E1306C] font-bold hover:opacity-80"
                    >
                        Instagram post
                    </a>{' '}
                    & Tag 5 friends in the same comment
                </p>

            )}
            {name == 'ticketImage' && (
                <p className="block md:hidden text-[13px] text-black font-semibold leading-none  decoration-solid decoration-0 mt-1 leading-[1.4]">
                    Share your ticket in an Instagram Story Tag
                    @shrilalmahalgroup
                </p>
            )}

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
