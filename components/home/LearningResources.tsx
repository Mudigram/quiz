import { FileText, Book, BookOpen, Users, ExternalLink, Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
                {/* Flashcards Feature Card */}
                <Link href="/learn" className="group md:col-span-2 lg:col-span-2">
                    <Card className="h-full relative overflow-hidden border-brand-mint hover:border-brand-mint hover:shadow-[0_0_30px_rgba(64,255,175,0.15)] transition-all slide-up">
                        <div className="absolute inset-0 bg-brand-mint/5 group-hover:bg-brand-mint/10 transition-colors" />
                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 h-full">
                            <div className="w-16 h-16 rounded-2xl bg-brand-mint/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Brain className="w-8 h-8 text-brand-green" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-black text-brand-black dark:text-brand-white uppercase italic tracking-tight">
                                        Interactive Learning
                                    </h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-mint text-brand-black">New</span>
                                </div>
                                <p className="text-brand-black/60 dark:text-brand-white/60 font-medium text-sm leading-relaxed">
                                    Master Ritual concepts with our interactive flashcards. Practice now to ace the next quiz!
                                </p>
                            </div>
                            <div className="hidden sm:block">
                                <ArrowRight className="w-6 h-6 text-brand-green group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Card>
                </Link>

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
