import React, { useEffect, useState } from 'react';
import { getContactMessages } from '../api/api';
import { FaFilePdf, FaImage, FaVideo } from 'react-icons/fa';

export default function ContactTable({ token }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const FILE_BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        getContactMessages(token)
            .then(setMessages)
            .catch(() => setMessages([]))
            .finally(() => setLoading(false));
    }, [token]);

    const getFileIcon = (url) => {
        if (url.endsWith('.pdf')) return <FaFilePdf className="text-red-600 mr-1" />;
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/)) return <FaImage className="text-blue-600 mr-1" />;
        if (url.match(/\.(mp4|mov|webm)$/)) return <FaVideo className="text-purple-600 mr-1" />;
        return null;
    };

    const getFileType = (url) => {
        if (!url) return '';
        const ext = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image';
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
        if (ext === 'pdf') return 'pdf';
        return 'other';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) return <div className="p-4 text-gray-600">Loading contact messages...</div>;

    return (
        <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">📨 Contact Form Submissions</h3>
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Phone</th>
                        <th className="border px-4 py-2">Message</th>
                        <th className="border px-4 py-2">File</th>
                        <th className="border px-4 py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-gray-50">
                            <td className="border px-3 py-2">{msg.name}</td>
                            <td className="border px-3 py-2">{msg.email}</td>
                            <td className="border px-3 py-2">{msg.phone}</td>
                            <td className="border px-3 py-2 max-w-xs">
                                <button
                                    onClick={() => setSelectedMessage(msg)}
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    View Message
                                </button>
                            </td>
                            <td className="border px-3 py-2">
                                {msg.fileUrl ? (
                                    <button
                                        onClick={() => setPreviewUrl(FILE_BASE_URL + msg.fileUrl)}
                                        className="flex items-center text-blue-600 hover:underline"
                                    >
                                        {getFileIcon(msg.fileUrl)} View
                                    </button>
                                ) : (
                                    <span className="text-gray-400 italic">No file</span>
                                )}
                            </td>
                            <td className="border px-3 py-2">{formatDate(msg.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Message Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative">
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
                        >
                            ×
                        </button>
                        <h4 className="text-lg font-semibold mb-2 text-gray-800">📨 Message from {selectedMessage.name}</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{selectedMessage.message}</p>
                    </div>
                </div>
            )}

            {/* File Preview Modal */}
            {previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-4 shadow-lg relative">
                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                        >
                            ×
                        </button>
                        <div className="h-96 flex justify-center items-center">
                            {(() => {
                                const type = getFileType(previewUrl);
                                if (type === 'image') {
                                    return <img src={previewUrl} alt="Preview" className="max-h-full max-w-full rounded shadow" />;
                                } else if (type === 'video') {
                                    return (
                                        <video controls className="max-h-full max-w-full rounded shadow">
                                            <source src={previewUrl} />
                                            Your browser does not support the video tag.
                                        </video>
                                    );
                                } else if (type === 'pdf') {
                                    return <iframe src={previewUrl} className="w-full h-full rounded" />;
                                } else {
                                    return <p className="text-gray-600">Preview not supported for this file type.</p>;
                                }
                            })()}
                        </div>
                        <div className="mt-4 text-right">
                            <a
                                href={previewUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
