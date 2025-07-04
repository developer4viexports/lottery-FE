// src/components/LandingForm.jsx
import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TicketPreview from './TicketPreview';
import bgImage from '../assets/image3.png';
import { submitTicket } from '../api/api';

export default function LandingForm() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        instagram: '',
        file: null,
    });

    const [errors, setErrors] = useState({});
    const [ticket, setTicket] = useState(null);

    const validate = () => {
        const errs = {};
        const cleanedPhone = form.phone.replace(/\D/g, '');

        if (!form.name.trim()) errs.name = 'Name is required';
        if (cleanedPhone.length < 10 || cleanedPhone.length > 15)
            errs.phone = 'Phone must include country code and be valid';

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!/^@[\w.]+$/.test(form.instagram)) errs.instagram = 'Instagram must start with @ and use only letters, numbers, dot or underscore';

        if (form.file) {
            const type = form.file.type;
            if (!(type.startsWith('image/') || type.startsWith('video/'))) {
                errs.file = 'Only image or video files are allowed.';
            }
        }

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

        const issueDate = new Date().toLocaleDateString('en-GB');
        const expiryDate = '30-06-2025';

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));
        formData.append('issueDate', issueDate);
        formData.append('expiryDate', expiryDate);

        try {
            const response = await submitTicket(formData);
            if (response?.data) {
                setTicket(response.data);
            }
            setErrors({});
        } catch (err) {
            const resData = err?.response?.data;
            if (resData?.field && resData?.message) {
                setErrors(prev => ({
                    ...prev,
                    [resData.field]: resData.message
                }));
            } else if (resData?.message) {
                alert(resData.message);
            } else {
                alert("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div
            className="min-h-[80vh] bg-cover bg-center bg-no-repeat py-12 px-4"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-lg p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-blue-700">
                    🎟️ Shrilalmahal Lucky Ticket Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField
                        name="name"
                        label="Full Name"
                        value={form.name}
                        error={errors.name}
                        onChange={handleChange}
                        placeholder="e.g. Priya Sharma"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <PhoneInput
                            country={'in'}
                            value={form.phone}
                            onChange={(phone, data, event, formattedValue) =>
                                setForm(prev => ({ ...prev, phone: `+${phone}` }))
                            }
                            inputProps={{
                                name: 'phone',
                                required: true,
                                autoFocus: false,
                            }}
                            inputClass="!w-full !py-2 !pl-12 !pr-4 !border !rounded-md !shadow-sm focus:!ring focus:!ring-blue-300"
                            containerClass="!w-full"
                            buttonClass="!bg-gray-100 !border-r !border-gray-300"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <InputField
                        type="email"
                        name="email"
                        label="Email"
                        value={form.email}
                        error={errors.email}
                        onChange={handleChange}
                        placeholder="e.g. priya@example.com"
                    />
                    <InputField
                        name="instagram"
                        label="Instagram Handle"
                        value={form.instagram}
                        error={errors.instagram}
                        onChange={handleChange}
                        placeholder="e.g. @priya.s"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Proof</label>
                        <input
                            type="file"
                            name="file"
                            accept="image/*,video/*"
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm text-gray-700"
                        />
                        {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        Generate Ticket
                    </button>
                </form>
            </div>

            {ticket && (
                <div className="max-w-xl mx-auto mt-10">
                    <TicketPreview data={ticket} />
                </div>
            )}
        </div>
    );
}

function InputField({ name, label, type = "text", value, error, onChange, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required
                placeholder={placeholder}
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
