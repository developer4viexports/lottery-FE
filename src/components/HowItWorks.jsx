import { FaTicketAlt, FaClock, FaTrophy } from 'react-icons/fa';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

function FeatureCard({ icon, title, iconBgColor }) {
    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition min-h-[80px]">
            {/* Icon circle */}
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: iconBgColor }}
            >
                <div className="text-white text-xl">
                    {icon}
                </div>
            </div>

            {/* Title text */}
            <div className="text-center sm:text-left">
                <p className="text-black font-semibold text-sm leading-tight">
                    {title}
                </p>
            </div>
        </div>
    );
}

export default function HowItWorks() {
    const features = [
        {
            icon: <FaTicketAlt />,
            title: 'Your ticket has 7 random numbers',
            iconBgColor: '#ef4444',
        },
        {
            icon: <FaClock />,
            title: "We'll reveal 1 number every 24 hours",
            iconBgColor: '#3b82f6',
        },
        {
            icon: <HiOutlineSwitchHorizontal />,
            title: 'At the end of the cycle, compare your numbers',
            iconBgColor: '#22c55e',
        },
        {
            icon: <FaTrophy />,
            title: (
                <>
                    Matched enough? <br /> You win!
                </>
            ),

            iconBgColor: '#eab308',
        },
    ];

    return (
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-black">
                        How It Works
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            iconBgColor={feature.iconBgColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
