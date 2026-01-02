import { Network, Shield, Rocket } from 'lucide-react';
import { Card } from '../ui/Card';
import { ritualConfig } from '@/config/ritual';

const iconMap = {
    Network,
    Shield,
    Rocket,
};

export function AboutSection() {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                    About Ritual
                </h2>
                <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                    Building the future of decentralized AI infrastructure
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ritualConfig.about.map(({ title, description, icon }) => {
                    const Icon = iconMap[icon as keyof typeof iconMap];

                    return (
                        <Card key={title} className="text-center slide-up hover:border-brand-mint transition-all">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-brand-mint/10 flex items-center justify-center">
                                    <Icon className="w-8 h-8 text-brand-mint" />
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-brand-black dark:text-brand-white mb-3 uppercase tracking-tight">
                                {title}
                            </h3>

                            <p className="text-brand-black/70 dark:text-brand-white/70 leading-relaxed font-medium">
                                {description}
                            </p>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
