import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TicketPreview from './TicketPreview';
import TicketLoader from './TicketLoader';
import { submitTicket, getInstagramPostUrl } from '../api/api';
import { FaUser, FaPhone, FaEnvelope, FaInstagram, FaUpload, FaCheckCircle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LandingForm() {
    const [collectedAt, setCollectedAt] = useState('');
    useEffect(() => {
        async function fetchInstagramData() {
            try {
                const { endDate } = await getInstagramPostUrl();
                setCollectedAt(endDate); // optional: use this if needed
            } catch (error) {
                console.error('Failed to load Instagram URL:', error.message);
            }
        }

        fetchInstagramData();
    }, []);
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
    const [isLoading, setIsLoading] = useState(false); // for loader

    const validate = () => {
        const errs = {};
        const cleanedPhone = form.phone.replace(/\D/g, '');
        if (!form.name.trim()) errs.name = 'Name is required';
        if (cleanedPhone.length < 10 || cleanedPhone.length > 15) errs.phone = 'Phone must include country code and be valid';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!/^@[\w.]+$/.test(form.instagram)) errs.instagram = 'Instagram must start with @ and use only letters, numbers, dot or underscore';
        if (!form.followProof) errs.followProof = 'Follow proof is required';
        if (form.isSuperTicket && !form.purchaseProof) {
            errs.purchaseProof = 'Purchase proof is required for SuperTicket';
        }
        // if (form.file) {
        //     const type = form.file.type;
        //     if (!(type.startsWith('image/') || type.startsWith('video/'))) {
        //         errs.file = 'Only image or video files are allowed.';
        //     }
        // }
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
        const expiryDate = collectedAt;


        console.log('collectedAt, expiryDate  ', collectedAt, expiryDate);
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('phone', form.phone);
        formData.append('email', form.email);
        formData.append('instagram', form.instagram);
        formData.append('isSuperTicket', form.isSuperTicket ? '1' : '0');
        formData.append('issueDate', issueDate);
        formData.append('expiryDate', expiryDate);
        // if (form.file) formData.append('file', form.file);
        if (form.followProof) formData.append('followProof', form.followProof);
        if (form.isSuperTicket && form.purchaseProof) {
            formData.append('purchaseProof', form.purchaseProof);
        }

        setIsLoading(true); // Show loader

        try {
            const response = await submitTicket(formData);
            if (response?.data) {
                setTicket(response.data);
                setIsLoading(false); // Hide loader
                setShowModal(true);
            }
            setErrors({});
        } catch (err) {
            setIsLoading(false); // Hide loader on error
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

                <h2 className="text-2xl font-bold mb-6 text-black text-left hidden md:block">Lucky Ticket Form</h2>
                <h2 className="text-xl font-bold mb-6 text-black text-left text-center block md:hidden whitespace-nowrap">Step 1: Generate Your Ticket</h2>

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
                                className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300 placeholder:text-sm"
                            />
                        </div>
                        <p className="block md:hidden text-[12.8px] text-black font-semibold leading-[1.3]  mt-1.5">
                            Follow us on Instagram{' '}
                            <a
                                href="https://www.instagram.com/shrilalmahalgroup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#E1306C] font-bold hover:opacity-80"
                            >
                                @shrilalmahalgroup
                            </a>
                        </p>

                        {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
                    </div>


                    {/* <FileInputField
                        name="file"
                        placeholder="Task Proof"
                        icon={<FaUpload />}
                        onChange={handleChange}
                        error={errors.file}
                    /> */}

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
                        disabled={isLoading}
                        className={`w-full bg-[#84282D] hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Generating...' : `Generate ${form.isSuperTicket ? 'SuperTicket' : 'Ticket'}`}
                    </button>
                </form>
            </div>

            {/* Ticket Generation Loader */}
            <TicketLoader isVisible={isLoading} />

            {/* Modal Preview */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute -top-10 right-0 text-white hover:text-red-300 z-10 text-2xl"
                        >
                            <FaTimes />
                        </button>
                        <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                            <TicketPreview data={ticket} />
                        </div>
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
                    className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300 placeholder:text-sm"
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


