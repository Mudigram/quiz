'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { DeckCard } from '@/components/learn/DeckCard';
import { FlashcardDeck } from '@/lib/types';

export default function LearnPage() {
    const { data: decks = [], isLoading } = useQuery({
        queryKey: ['flashcardDecks'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('flashcard_decks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as FlashcardDeck[];
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian pb-20 lg:pb-0">
            <Header />

            <main className="container py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                            Learning Library
                        </h1>
                        <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                            Master the concepts with our flashcard decks
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {decks.map(deck => (
                            <DeckCard key={deck.id} deck={deck} />
                        ))}

                        {decks.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <p className="text-zinc-500">No flashcard decks available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
