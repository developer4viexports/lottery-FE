// src/api/api.js
const BASE_URL = 'https://lottery-be.onrender.com/api';


export const submitTicket = async (formData) => {
    const res = await fetch(`${BASE_URL}/tickets/tickets`, {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || 'Submission failed');
        error.field = data.field;
        error.response = { data };
        throw error;
    }

    return data;
};

export const submitClaim = async (data) => {
    const res = await fetch(`${BASE_URL}/tickets/claims`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Failed to submit claim');
    }

    return res.json();
};

export const getWinningTickets = async (token) => {
    const res = await fetch(`${BASE_URL}/winners`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch winners');
    return data.data;
};

export const loginAdmin = async (email, password) => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
    }

    return data; // includes token and admin info
};
