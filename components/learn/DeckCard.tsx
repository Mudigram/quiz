'use client';

import Link from 'next/link';
import { Book, Brain, Code, FileText, Layers, Lightbulb, Zap } from 'lucide-react';
import { FlashcardDeck } from '@/lib/types';
import { Card } from '@/components/ui/Card';

const iconMap: Record<string, any> = {
    Book,
    Brain,
    Code,
    FileText,
    Layers,
    Lightbulb,
    Zap,
};

interface DeckCardProps {
    deck: FlashcardDeck;
}

export function DeckCard({ deck }: DeckCardProps) {
    const Icon = iconMap[deck.icon_name] || Book;

    return (
        <Link href={`/learn/${deck.id}`} className="group block h-full">
            <Card className="h-full flex flex-col transition-all duration-300 hover:border-brand-mint hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-brand-mint/20 transition-colors">
                        <Icon className="w-6 h-6 text-zinc-600 dark:text-zinc-400 group-hover:text-brand-mint-dark transition-colors" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        {deck.category}
                    </div>
                </div>

                <h3 className="text-xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tight group-hover:text-brand-mint-dark transition-colors">
                    {deck.title}
                </h3>

                <p className="text-brand-black/60 dark:text-brand-white/60 text-sm mb-6 flex-1">
                    {deck.description}
                </p>

                <div className="flex items-center text-xs font-bold text-zinc-400 group-hover:text-brand-mint-dark transition-colors">
                    <span>{deck.card_count || 0} CARDS</span>
                </div>
            </Card>
        </Link>
    );
}
