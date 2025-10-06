const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:5000';

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

export const submitActivate = async (formData) => {
    const res = await fetch(`${BASE_URL}/tickets/activate`, {
        method: 'POST',
        body: formData, // no headers needed!
    });

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || 'Activation submission failed');
        error.response = data;
        throw error;
    }

    return data;
};

export const submitClaim = async (formData) => {
    const res = await fetch(`${BASE_URL}/tickets/claim`, {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
        const error = new Error(data.message || 'Failed to submit claim');
        error.response = data;
        throw error;
    }

    return data;
};


export const uploadTicketImage = async (ticketId, canvas) => {
    return new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('ticketId', ticketId);
            formData.append('image', blob, `${ticketId}.png`);

            try {
                const res = await fetch(`${BASE_URL}/tickets/upload-ticket-image`, {
                    method: 'POST',
                    body: formData,
                });
                const result = await res.json();
                if (!res.ok) {
                    return reject(new Error(result.message || 'Upload failed'));
                }
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, 'image/png');
    });
};

export const sendTicketEmail = async (ticketId) => {
    const res = await fetch(`${BASE_URL}/tickets/send-email/${ticketId}`, {
        method: 'POST',
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to send email');
    return result;
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

export const getPrizeTiers = async () => {
    const res = await fetch(`${BASE_URL}/prize-tiers`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch prize tiers');
    return data.data;
}

// ✅ NEW: Submit contact form with optional file
export const submitContactMessage = async (formData) => {
    const res = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
        const error = new Error(data.message || 'Failed to submit contact message');
        error.response = data;
        throw error;
    }

    return data;
};

// Instagram post URL and expiry date 
export const getInstagramPostUrl = async () => {
    const res = await fetch(`${BASE_URL}/url-date`);
    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch Instagram URL');
    }

    const { url, startDate, revealDate, endDate } = data.data;
    return { url, startDate, revealDate, endDate };
};


// ✅ Fetch ticket details by Ticket ID
export const getTicketDetails = async (ticketID) => {
    const res = await fetch(`${BASE_URL}/tickets/${ticketID}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch ticket details');
    }

    return data.data; // contains name, instagram, ticketID
};


// admin side api

export const getContactMessages = async (token) => {
    const res = await fetch(`${BASE_URL}/contact`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch messages');
    return data.data;
};


