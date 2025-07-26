import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaUser, FaPhone, FaEnvelope, FaInstagram, FaTag } from 'react-icons/fa';
import { submitClaim } from '../api/api';
import toast from 'react-hot-toast';

export default function ClaimTicketForm() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        instagram: '',
        ticketID: '',
        numbers: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        const cleanedPhone = form.phone.replace(/\D/g, '');

        if (!form.ticketID.trim()) errs.ticketID = 'Ticket ID is required';
        if (!form.numbers.trim()) errs.numbers = 'Ticket numbers are required';
        if (!form.name.trim()) errs.name = 'Name is required';
        if (cleanedPhone.length < 10 || cleanedPhone.length > 15) errs.phone = 'Phone must include country code and be valid';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!/^@[\w.]+$/.test(form.instagram)) errs.instagram = 'Instagram must start with @ and use only letters, numbers, dot or underscore';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            for (const key in form) {
                formData.append(key, form[key]);
            }

            const res = await submitClaim(formData);
            toast.success('🎉 Claim submitted successfully!');
            setForm({
                name: '',
                phone: '',
                email: '',
                instagram: '',
                ticketID: '',
                numbers: ''
            });
            setErrors({});
        } catch (err) {
            const resData = err?.response;

            if (resData?.field && resData?.message) {
                setErrors(prev => ({ ...prev, [resData.field]: resData.message }));
                toast.error(resData.message);  // ✅ Show toast for specific field error
            } else {
                toast.error(resData?.message || 'Submission failed');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-xl w-full bg-gradient-to-br from-[#ffffffaa] to-[#84282D66] border border-gray-200 shadow-md rounded-xl p-6 sm:p-8 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-black text-left">Claim Your Winning Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-5">

                <InputField name="ticketID" value={form.ticketID} error={errors.ticketID} onChange={handleChange} placeholder="Ticket ID (e.g., SLH-2025-XXXXXX)" icon={<FaTag />} />

                <InputField name="numbers" value={form.numbers} error={errors.numbers} onChange={handleChange} placeholder="Ticket Numbers (e.g., 01,02,03,04,05,06,07)" icon={<FaTag />} />

                <InputField name="name" value={form.name} error={errors.name} onChange={handleChange} placeholder="Full Name" icon={<FaUser />} />

                <div>
                    <div className="relative">
                        <PhoneInput
                            country={'in'}
                            value={form.phone}
                            onChange={(phone) => setForm(prev => ({ ...prev, phone: `+${phone}` }))}
                            inputProps={{ name: 'phone', required: true }}
                            inputClass="!w-full !pl-12 !py-2 !pr-4 !border !rounded-md !shadow-sm focus:!ring focus:!ring-blue-300"
                            containerClass="!w-full"
                            buttonClass="!bg-gray-100 !border-r !border-gray-300"
                        />
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <InputField name="email" type="email" value={form.email} error={errors.email} onChange={handleChange} placeholder="Email" icon={<FaEnvelope />} />

                <InputField name="instagram" value={form.instagram} error={errors.instagram} onChange={(e) => {
                    const val = e.target.value;
                    setForm(prev => ({
                        ...prev,
                        instagram: val.startsWith('@') ? val : `@${val.replace(/@/g, '')}`
                    }));
                    setErrors(prev => ({ ...prev, instagram: '' }));
                }} placeholder="@yourhandle" icon={<FaInstagram />} />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#84282D] hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
                >
                    {loading ? 'Submitting...' : 'Submit Claim'}
                </button>
            </form>
        </div>
    );
}

function InputField({ name, type = "text", value, error, onChange, placeholder, icon }) {
    return (
        <div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">{icon}</span>
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
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
