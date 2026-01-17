'use client';

import { Header } from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Video, FileText, ExternalLink, Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Dummy data for resources
const resources = [
    {
        id: 1,
        title: 'Introduction to Ritual',
        description: 'Learn the basics of the Ritual ecosystem and how it integrates AI with Web3.',
        type: 'article',
        duration: '5 min read',
        url: 'https://ritual.net', // Placeholder
        featured: true,
    },
    {
        id: 2,
        title: 'Consensus Mechanisms 101',
        description: 'A deep dive into how blockchain consensus works and why it matters.',
        type: 'video',
        duration: '10 min watch',
        url: '#',
    },
    {
        id: 3,
        title: 'Building on Ritual Chain',
        description: 'Developer guide for deploying your first smart contract on Ritual.',
        type: 'guide',
        duration: '15 min read',
        url: '#',
    },
    {
        id: 4,
        title: 'Tokenomics Overview',
        description: 'Understanding the utility and economics of the native token.',
        type: 'article',
        duration: '7 min read',
        url: '#',
    },
];

const typeIcons = {
    article: FileText,
    video: Video,
    guide: BookOpen,
};

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian pb-20 lg:pb-0">
            <Header />

            <main className="container py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                            Learning Resources
                        </h1>
                        <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                            Expand your knowledge to ace the quizzes
                        </p>
                    </div>

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

                    <div className="grid gap-4 md:grid-cols-2">
                        {resources.map((resource) => {
                            const Icon = typeIcons[resource.type as keyof typeof typeIcons] || FileText;

                            return (

                                <div>

                                    <Link href={resource.url} key={resource.id} className="block group">
                                        <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${resource.featured ? 'border-brand-mint/50 dark:border-brand-mint/30' : ''}`}>
                                            <div className="flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <Badge variant={resource.featured ? 'mint' : 'outline'} className="uppercase text-xs">
                                                        {resource.type}
                                                    </Badge>
                                                    {resource.featured && (
                                                        <Badge variant="gold" className="uppercase text-xs">
                                                            Featured
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2 group-hover:text-brand-purple transition-colors">
                                                    {resource.title}
                                                </h3>

                                                <p className="text-brand-black/60 dark:text-brand-white/60 text-sm mb-6 flex-1">
                                                    {resource.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-brand-black/5 dark:border-brand-white/5 mt-auto">
                                                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-brand-black/40 dark:text-brand-white/40">
                                                        <Icon className="w-4 h-4" />
                                                        <span>{resource.duration}</span>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-brand-black/40 dark:text-brand-white/40 group-hover:text-brand-purple transition-colors" />
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
