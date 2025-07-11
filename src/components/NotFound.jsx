// src/components/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold text-red-600">404</h1>
                <p className="text-lg text-gray-700 mb-4">Oops! The page you're looking for doesn't exist.</p>
                <p className="text-sm text-gray-500 mb-6">It might have been moved or deleted.</p>
                <Link to="/" className="text-blue-600 hover:underline">Go back to Home</Link>
            </div>
        </div>
    );
}
