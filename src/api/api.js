const BASE_URL = 'http://localhost:5000/api';

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

export const submitClaim = async (formData) => {
    const res = await fetch(`${BASE_URL}/tickets/claims`, {
        method: 'POST',
        body: formData, // no headers needed!
    });

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || 'Claim submission failed');
        error.response = data;
        throw error;
    }

    return data;
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
