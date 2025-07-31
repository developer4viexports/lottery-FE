import React from "react";

const HowYourTicketWorks = () => {
    const steps = [
        {
            stepNumber: 1,
            title: "Generate Your Ticket",
            description:
                "Complete the form, upload proof, and submit to instantly receive your ticket and activate eligibility",
        },
        {
            stepNumber: 2,
            title: "Activate your Ticket",
            description:
                "Complete the tasks, upload proof, and fill your ticket ID with contact details to activate your entry for the draw.",
        },
        {
            stepNumber: 3,
            title: "Claim your Prize",
            description:
                "Comment ticket, tag 3 friends, share in story, tag us, upload screenshots to activate entry.",
        },
    ];

    const HeadingBlock = ({ title, subtitle }) => {
        return (
            <div className="text-center mb-12 md:mb-16">
                <h1 className="font-bold text-[24px] md:text-[32px] leading-[1.2] text-black mb-4 font-[Inter]">
                    {title}
                </h1>
                <div className="max-w-[320px] md:max-w-[700px] mx-auto px-4 md:px-0">
                    <p className="font-normal text-[14px] md:text-[16px] leading-[1.5] text-[#4F4F4F] font-[Inter]">
                        {subtitle}
                    </p>
                </div>
            </div>
        );
    };

    const StepCard = ({ stepNumber, title, description, targetId }) => {
        const handleClick = () => {
            const section = document.getElementById(targetId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        };

        return (
            <div
                onClick={handleClick}
                className="bg-white rounded-[8px] p-[24px] shadow-sm h-[120px] flex justify-center cursor-pointer hover:shadow-md transition-all duration-300"
            >
                <div className="flex flex-row gap-4 items-center w-full">
                    {/* Step Circle */}
                    <div className="shrink-0 w-[46px] h-[46px] bg-[#84282D] rounded-full flex items-center justify-center">
                        <span className="font-bold text-[14px] text-white font-[Inter]">
                            Step {stepNumber}
                        </span>
                    </div>

                    {/* Text Block */}
                    <div>
                        <h3 className="font-bold text-[16px] leading-[1.2] text-black mb-1 font-[Inter]">
                            {title}
                        </h3>
                        <p className="font-normal text-[14px] leading-[20px] text-[#666666] font-[Inter]">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        );
    };




    return (
        <section className="bg-[#FFF7ED] py-[40px] md:py-[80px] px-4 md:px-0">
            <div className="w-full max-w-[1440px] mx-auto md:px-[120px]">
                <HeadingBlock
                    title="How to Get Ticket"
                    subtitle="Each ticket has 7 random numbers from 00–99. We'll reveal one number daily on our Instagram stories. At the end of the draw, if your numbers match enough revealed numbers, you win!"
                />

                <div className="flex flex-col md:flex-row gap-[24px] items-stretch md:items-start justify-center">
                    {steps.map((step) => {
                        let targetId = '';
                        if (step.stepNumber === 1) targetId = 'generate-ticket';
                        if (step.stepNumber === 2) targetId = 'activate-ticket';
                        if (step.stepNumber === 3) targetId = 'claim-ticket';

                        return (
                            <StepCard
                                key={step.stepNumber}
                                stepNumber={step.stepNumber}
                                title={step.title}
                                description={step.description}
                                targetId={targetId}
                            />
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default HowYourTicketWorks;
