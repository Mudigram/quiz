'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { DeckViewer } from '@/components/learn/DeckViewer';
import { Flashcard, FlashcardDeck } from '@/lib/types';

export default function DeckPage() {
    const { deckId } = useParams();

    const { data: deck, isLoading: isDeckLoading } = useQuery({
        queryKey: ['deck', deckId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('flashcard_decks')
                .select('*')
                .eq('id', deckId)
                .single();

            if (error) throw error;
            return data as FlashcardDeck;
        },
        enabled: !!deckId,
    });

    const { data: cards = [], isLoading: isCardsLoading } = useQuery({
        queryKey: ['deckCards', deckId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('flashcards')
                .select('*')
                .eq('deck_id', deckId)
                .order('order_index');

            if (error) throw error;
            return data as Flashcard[];
        },
        enabled: !!deckId,
    });

    const isLoading = isDeckLoading || isCardsLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-brand-obsidian">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
            </div>
        );
    }

    if (!deck) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian">
                <Header />
                <div className="container py-8 text-center">
                    <h1 className="text-2xl font-bold text-red-500">Deck not found</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian pb-20 lg:pb-0">
            <Header />

            <main className="container py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-2 uppercase italic tracking-tighter">
                            {deck.title}
                        </h1>
                        <p className="text-brand-black/60 dark:text-brand-white/60 font-medium">
                            {deck.description}
                        </p>
                    </div>

                    <DeckViewer deck={deck} cards={cards} />
                </div>
            </main>
        </div>
    );
}
