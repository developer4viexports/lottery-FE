import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TicketPreview from './TicketPreview';
import { submitTicket } from '../api/api';
import { FaUser, FaPhone, FaEnvelope, FaInstagram, FaUpload, FaCheckCircle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LandingForm() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        instagram: '',
        isSuperTicket: false,
        file: null,
        purchaseProof: null,
        followProof: null,
    });

    const [errors, setErrors] = useState({});
    const [ticket, setTicket] = useState(null);
    const [showModal, setShowModal] = useState(false); // for popup

    const validate = () => {
        const errs = {};
        const cleanedPhone = form.phone.replace(/\D/g, '');
        if (!form.name.trim()) errs.name = 'Name is required';
        if (cleanedPhone.length < 10 || cleanedPhone.length > 15) errs.phone = 'Phone must include country code and be valid';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!/^@[\w.]+$/.test(form.instagram)) errs.instagram = 'Instagram must start with @ and use only letters, numbers, dot or underscore';
        if (!form.followProof) errs.followProof = 'Follow proof is required';
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
        const { name, value, files, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (files ? files[0] : value)
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const issueDate = new Date().toLocaleDateString('en-GB');
        const expiryDate = '30-06-2026';

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('phone', form.phone);
        formData.append('email', form.email);
        formData.append('instagram', form.instagram);
        formData.append('isSuperTicket', form.isSuperTicket ? '1' : '0');
        formData.append('issueDate', issueDate);
        formData.append('expiryDate', expiryDate);
        if (form.file) formData.append('file', form.file);
        if (form.followProof) formData.append('followProof', form.followProof);
        if (form.isSuperTicket && form.purchaseProof) {
            formData.append('purchaseProof', form.purchaseProof);
        }

        try {
            const response = await submitTicket(formData);
            if (response?.data) {
                setTicket(response.data);
                setShowModal(true);
            }
            setErrors({});
        } catch (err) {
            const resData = err?.response?.data;

            if (resData?.field && resData?.message) {
                setErrors(prev => ({ ...prev, [resData.field]: resData.message }));
            } else {
                toast.error(resData?.message || 'Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="   ">
            <div className="max-w-xl w-full bg-gradient-to-br from-[#ffffffaa] to-[#84282D66] border border-gray-200 shadow-md rounded-xl p-6 sm:p-8">

                <h2 className="text-2xl font-bold mb-6 text-black text-left">Lucky Ticket Form</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <InputField
                        name="name"
                        value={form.name}
                        error={errors.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        icon={<FaUser />}
                    />

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

                    <InputField
                        name="email"
                        type="email"
                        value={form.email}
                        error={errors.email}
                        onChange={handleChange}
                        placeholder="Email"
                        icon={<FaEnvelope />}
                    />
                    <div>
                        <div className="relative">
                            <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                            <input
                                type="text"
                                name="instagram"
                                value={form.instagram}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Ensure it always starts with '@'
                                    if (!value.startsWith('@')) {
                                        setForm(prev => ({ ...prev, instagram: '@' + value.replace(/@/g, '') }));
                                    } else {
                                        setForm(prev => ({ ...prev, instagram: value }));
                                    }
                                    setErrors(prev => ({ ...prev, instagram: '' }));
                                }}
                                placeholder="@yourhandle"
                                className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                        {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
                    </div>


                    <FileInputField
                        name="file"
                        placeholder="Task Proof"
                        icon={<FaUpload />}
                        onChange={handleChange}
                        error={errors.file}
                    />

                    <FileInputField
                        name="followProof"
                        placeholder="Follow Proof"
                        icon={<FaUpload />}
                        onChange={handleChange}
                        error={errors.followProof}
                    />

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isSuperTicket"
                            name="isSuperTicket"
                            checked={form.isSuperTicket}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isSuperTicket" className="ml-2 text-sm text-gray-700">
                            Have you bought from Shrialamahal Empire? (Get SuperTicket with better prizes)
                        </label>
                    </div>

                    {form.isSuperTicket && (
                        <FileInputField
                            name="purchaseProof"
                            placeholder="Purchase Proof"
                            icon={<FaUpload />}
                            onChange={handleChange}
                            error={errors.purchaseProof}
                        />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#84282D] hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        Generate {form.isSuperTicket ? 'SuperTicket' : 'Ticket'}
                    </button>
                </form>
            </div>

            {/* Modal Preview */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
                    <div className="relative bg-white rounded-xl max-w-lg w-full shadow-lg overflow-hidden p-4">
                        <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                            <FaTimes />
                        </button>
                        <TicketPreview data={ticket} />
                    </div>
                </div>
            )}
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

// import { FaCheckCircle } from 'react-icons/fa';

function FileInputField({ name, placeholder, icon, onChange, error }) {
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
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}


