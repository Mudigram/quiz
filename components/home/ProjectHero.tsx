import { ExternalLink } from 'lucide-react';
import { ritualConfig } from '@/config/ritual';

export function ProjectHero() {
    return (
        <div className="relative overflow-hidden rounded-2xl slide-up">
            {/* Animated Gradient Background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-mint"
                style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 8s ease infinite',
                }}
            ></div>

            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/20 to-transparent"></div>

            <div className="relative z-10 p-8 md:p-12 max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">
                    {ritualConfig.project.name}
                </h1>

                <p className="text-xl md:text-2xl text-white/90 font-bold mb-4 uppercase tracking-wide">
                    {ritualConfig.project.tagline}
                </p>

                <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed font-medium">
                    {ritualConfig.project.description}
                </p>

                <div className="flex flex-wrap gap-4">
                    <a
                        href={ritualConfig.project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-purple rounded-lg font-black uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-lg"
                    >
                        Visit Official Website
                        <ExternalLink className="w-4 h-4" />
                    </a>

                    <a
                        href={ritualConfig.socials.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black/30 text-white border-2 border-white/30 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-brand-black/50 transition-all"
                    >
                        Join Discord
                    </a>
                </div>
            </div>
        </div>
    );
}
