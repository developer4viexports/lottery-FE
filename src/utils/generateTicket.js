export function generateTicketNumbers() {
    const nums = new Set();
    while (nums.size < 7) {
        const n = Math.floor(Math.random() * 100);
        nums.add(n.toString().padStart(2, '0'));
    }
    return [...nums];
}

export function generateTicketID(index = null) {
    const padded = (index || Math.floor(100000 + Math.random() * 899999)).toString().padStart(6, '0');
    return `SLH-2025-${padded}`;
}
