import { FileText, Book, BookOpen, Users, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { ritualConfig } from '@/config/ritual';

const iconMap = {
    FileText,
    Book,
    BookOpen,
    Users,
};

export function LearningResources() {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                    Learning Resources
                </h2>
                <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                    Dive deeper into Ritual's technology and vision
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ritualConfig.resources.map(({ title, description, icon, url }) => {
                    const Icon = iconMap[icon as keyof typeof iconMap];

                    return (
                        <a
                            key={title}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <Card className="h-full transition-all hover:border-brand-purple hover:shadow-lg slide-up">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-brand-purple/10 flex items-center justify-center group-hover:bg-brand-purple/20 transition-colors">
                                        <Icon className="w-6 h-6 text-brand-purple" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-brand-black/40 dark:text-brand-white/40 ml-auto group-hover:text-brand-purple transition-colors" />
                                </div>

                                <h3 className="text-lg font-black text-brand-black dark:text-brand-white mb-2 uppercase tracking-tight group-hover:text-brand-purple transition-colors">
                                    {title}
                                </h3>

                                <p className="text-sm text-brand-black/60 dark:text-brand-white/60 font-medium">
                                    {description}
                                </p>
                            </Card>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
