import React from 'react';
import { LiquidGlassCard } from '../../ui/liquid-glass';

// Simple SVG Icons
const IconCheckCircle = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const IconAlertCircle = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>;

function InterviewSetup({
    title,
    description,
    requirements = [],
    tips = [],
    onStart
}) {
    return (
        <div className="interview-setup max-w-3xl mx-auto py-8 px-4 animation-fadeIn">
            <LiquidGlassCard
                glowIntensity="md"
                shadowIntensity="md"
                borderRadius="24px"
                className="p-8 md:p-12 relative overflow-hidden"
            >
                {/* Decorative background blur */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00FF66] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

                <div className="relative z-10 text-center mb-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FF66] to-[#00993D] flex items-center justify-center font-medium text-black mx-auto mb-6 shadow-[0_0_30px_rgba(0,255,102,0.4)]">
                        <IconAlertCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 uppercase leading-tight">{title}</h1>
                    <p className="text-xl text-white font-medium max-w-2xl mx-auto leading-relaxed">{description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    {/* Requirements */}
                    {requirements.length > 0 && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <IconAlertCircle className="text-[#00FF66]" />
                                Setup Requirements
                            </h3>
                            <ul className="space-y-3">
                                {requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-center gap-4 text-base text-white">
                                        <IconCheckCircle className="w-5 h-5 text-[#00FF66] flex-shrink-0" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Pro Tips */}
                    {tips.length > 0 && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <IconCheckCircle className="text-[#00FF66]" />
                                Pro Tips
                            </h3>
                            <ul className="space-y-3">
                                {tips.map((tip, idx) => (
                                    <li key={idx} className="flex items-center gap-4 text-base text-white">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] flex-shrink-0"></span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="text-center relative z-10">
                    <p className="text-base text-white/80 mb-8 font-medium uppercase tracking-widest">Ready when you are. Good luck!</p>
                    <button
                        onClick={onStart}
                        className="px-8 py-4 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black font-semibold rounded-full text-lg shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Begin Session Now
                    </button>
                </div>
            </LiquidGlassCard>
        </div>
    );
}

export default InterviewSetup;
