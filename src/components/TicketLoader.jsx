export default function TicketLoader({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-4 shadow-2xl">
                {/* Animated Ticket Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {/* Outer glow ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#84282D] to-[#F4C542] animate-ping opacity-20"></div>

                        {/* Main ticket container */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#84282D] to-[#a83232] rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                            {/* Ticket icon */}
                            <svg
                                className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"/>
                            </svg>
                        </div>

                        {/* Sparkles */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#F4C542] rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#F4C542] rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute top-1/2 -right-3 w-2 h-2 bg-[#F4C542] rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-[#84282D] mb-2">
                        Generating Your Lucky Ticket
                    </h3>

                    {/* Single message */}
                    <p className="text-gray-600 text-sm sm:text-base">
                        Please wait while we create your ticket...
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#84282D] to-[#F4C542] rounded-full animate-loading-bar"
                    ></div>
                </div>
            </div>

            {/* Custom animation styles */}
            <style>{`
                @keyframes loading-bar {
                    0% {
                        width: 0%;
                        margin-left: 0%;
                    }
                    50% {
                        width: 60%;
                        margin-left: 20%;
                    }
                    100% {
                        width: 0%;
                        margin-left: 100%;
                    }
                }
                .animate-loading-bar {
                    animation: loading-bar 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
