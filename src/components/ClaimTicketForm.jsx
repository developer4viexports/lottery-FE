import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaUser, FaPhone, FaEnvelope, FaInstagram, FaTag, FaHome } from 'react-icons/fa';
import { submitClaim, getTicketDetails } from '../api/api';
import toast from 'react-hot-toast';

export default function ClaimTicketForm() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        instagram: '',
        ticketID: '',
        numbers: '',
        address: '',
    });

    useEffect(() => {
        const fetchTicketDetails = async () => {
            if (!form.ticketID || form.ticketID.length < 6) return; // wait until there's a likely full ticket ID

            try {
                const res = await getTicketDetails(form.ticketID.trim());
                if (res?.name) {
                    setForm(prev => ({
                        ...prev,
                        name: res.name || '',
                    }));
                    console.log('first Name set from ticket details:', res);
                }
            } catch (err) {
                console.warn('Ticket not found or error fetching:', err.message);
            }
        };

        fetchTicketDetails();
    }, [form.ticketID]);

    const [contactValue, setContactValue] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.ticketID.trim()) errs.ticketID = 'Ticket ID is required';
        // if (!form.numbers.trim()) errs.numbers = 'Ticket numbers are required';
        // if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.address.trim()) errs.address = 'Address is required';

        if (!contactValue.trim()) {
            errs.contact = 'Email or phone is required';
        } else if (contactValue.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactValue)) {
                errs.contact = 'Invalid email format';
            }
        } else {
            const cleanedPhone = contactValue.replace(/\D/g, '');
            if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
                errs.contact = 'Phone number must be valid and include country code';
            }
        }

        // if (!/^@?[\w.]+$/.test(form.instagram)) errs.instagram = 'Instagram must start with @ and use only letters, numbers, dot or underscore';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If ticketID is being changed, reset fetched name/instagram
        if (name === 'ticketID') {
            setForm(prev => ({
                ...prev,
                ticketID: value,
                name: '',         // clear fetched name
                // instagram: '',    // clear fetched instagram
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }

        setErrors(prev => ({ ...prev, [name]: '' }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const formData = new FormData();

            // Exclude direct phone/email from form, since they're parsed from contactValue
            const { phone, email, ...rest } = form;
            for (const key in rest) {
                formData.append(key, rest[key]);
            }

            // ✅ Properly append email or phone
            if (contactValue.includes('@')) {
                formData.append('email', contactValue);
            } else {
                const cleaned = contactValue.replace(/\D/g, '');
                const countryCode = cleaned.length > 10 ? cleaned.slice(0, cleaned.length - 10) : '';
                const phoneNumber = `+${cleaned}`;
                formData.append('phone', phoneNumber);
                formData.append('countryCode', countryCode);
            }

            const res = await submitClaim(formData);
            toast.success('🎉 Claim submitted successfully!');
            setForm({
                name: '',
                phone: '',
                email: '',
                instagram: '',
                ticketID: '',
                numbers: '',
                address: '',
            });
            setContactValue('');
            setErrors({});
        } catch (err) {
            const resData = err?.response;
            if (resData?.field && resData?.message) {
                setErrors(prev => ({ ...prev, [resData.field]: resData.message }));
                toast.error(resData.message);
            } else {
                toast.error(resData?.message || 'Submission failed');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-xl w-full bg-gradient-to-br from-[#ffffffaa] to-[#84282D66] border border-gray-200 shadow-md rounded-xl p-6 sm:p-8 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-black text-left hidden md:block">Claim your Prize</h2>
            <h2 className="text-xl font-bold text-black text-center text-left block md:hidden">Step 3: Claim your Prize</h2>
            <p className="block md:hidden text-[14px] text-gray-600 font-medium leading-[18px] tracking-normal text-center mt-1 mb-2">   
                We’ll be revealing 1 lucky number per day on our Instagram page. Follow our story highlights and posts at @shrilalmahalgroup
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

                <InputField name="ticketID" value={form.ticketID} error={errors.ticketID} onChange={handleChange} placeholder="Ticket ID ( SLH-2025-XXXXXX )" icon={<FaTag />} />
                {form.name ? (
                    // <div className="text-sm text-gray-800  border border-gray-800 rounded-md px-3 py-2 mt-2 flex flex-row justify-around items-center ">
                        // {form.name && (
                            <p className="text-black font-bold text-sm mt-1">Name: {form.name}</p>
                        // )}
                    // </div>
                ) : null}

                {/* <InputField name="numbers" value={form.numbers} error={errors.numbers} onChange={handleChange} placeholder="Ticket Numbers (e.g., 01,02,03,04,05,06,07)" icon={<FaTag />} />

                <InputField name="name" value={form.name} error={errors.name} onChange={handleChange} placeholder="Full Name" icon={<FaUser />} /> */}


                <SmartContactInput
                    value={contactValue}
                    setValue={(val) => {
                        setContactValue(val);
                        setErrors(prev => ({ ...prev, contact: '' }));
                    }}
                    error={errors.contact}
                />

                <InputField name="address" value={form.address} error={errors.address} onChange={handleChange} placeholder="Shipping Address" icon={<FaHome />} />

                {/* <InputField name="instagram" value={form.instagram} error={errors.instagram} onChange={(e) => {
                    const val = e.target.value;
                    setForm(prev => ({
                        ...prev,
                        instagram: val.startsWith('@') ? val : `@${val.replace(/@/g, '')}`
                    }));
                    setErrors(prev => ({ ...prev, instagram: '' }));
                }} placeholder="@yourhandle" icon={<FaInstagram />} /> */}

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
                    className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300 placeholder:text-sm"
                />
            </div>
            {name == 'ticketID' && (
                <p className="block md:hidden text-[13px] text-black font-semibold leading-none  decoration-solid decoration-0 mt-1 leading-[1.4]">
                    There are only a few winners allowed per tier
                    (7/7, 6/7, 5/7, 4/7).
                </p>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function SmartContactInput({ value, setValue, error }) {
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
                            inputClass="!w-full !pl-12 !py-2 !pr-4 !border !rounded-md !shadow-sm focus:!ring focus:!ring-blue-300"
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
                            className="pl-10 pr-4 py-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300 transition-all duration-150 placeholder:text-sm"
                        />
                    </>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}