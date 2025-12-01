import { FaTicketAlt, FaClock, FaTrophy } from 'react-icons/fa';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

function FeatureCard({ icon, title, description, iconBgColor }) {
    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition min-h-[80px]">
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
                <p className="text-muted-foreground text-[13px] text-gray-800 leading-relaxed">
                    {description}
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
            description: "Every ticket gives you 7 random numbers between 00–99. Example: 12, 25, 37, 41, 58, 63, 90.",
            iconBgColor: '#ef4444',
        },
        {
            icon: <FaClock />,
            title: "We'll reveal 1 number every 24 hours",
            description: "We’ll reveal one lucky number per day on Instagram. Like 12 on Day 1, 25 on Day 2, etc.",
            iconBgColor: '#3b82f6',
        },
        {
            icon: <HiOutlineSwitchHorizontal />,
            title: 'At the end of the cycle, compare your numbers',
            description: "After 7 days, compare your numbers with ours. Example: You have 5 matches? You're eligible for Bronze Prize!",
            iconBgColor: '#22c55e',
        },
        {
            icon: <FaTrophy />,
            title: "Matched enough? You win!",
            description: "The more you match, the bigger the prize. First come, first win — don’t miss out!",
            iconBgColor: '#eab308',
        },
    ];

    return (
        <section className="w-full min-h-[50vh] md:min-h-screen bg-white pb-12">
            <div className=" mx-auto text-center mb-16 animate-fade-in pt-12">
                <div className="flex items-center justify-center mb-4 ">
                    <img
                        src="/image/grain brown.png"
                        alt="From Grains to Gains"
                        className="h-32 md:h-32 object-contain"
                    />
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-[#2D1F1F] leading-snug md:leading-tight mb-4 md:mb-6">
                    It's Your Lucky Chance To Win{" "}
                    <span className="inline md:block bg-gradient-to-r from-[#A12828] to-[#F4C542] bg-clip-text text-transparent">
                        Amazing Prizes!
                    </span>
                </h1>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl T  text-gray-600 tracking-tight text-black">
                        How It Works
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            iconBgColor={feature.iconBgColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
