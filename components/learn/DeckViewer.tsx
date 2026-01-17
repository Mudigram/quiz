'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { Flashcard, FlashcardDeck } from '@/lib/types';
import { FlashCard } from './FlashCard';
import { Button } from '@/components/ui/Button';

interface DeckViewerProps {
    deck: FlashcardDeck;
    cards: Flashcard[];
}

export function DeckViewer({ deck, cards }: DeckViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    if (!currentCard) {
        return (
            <div className="text-center py-12">
                <p className="text-zinc-500">No cards in this deck yet.</p>
                <Link href="/learn" className="text-brand-purple hover:underline mt-4 inline-block">
                    Return to Library
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/learn">
                    <Button variant="ghost" className="gap-2">
                        <X className="w-4 h-4" />
                        Close Deck
                    </Button>
                </Link>
                <div className="text-sm font-bold text-zinc-500">
                    {currentIndex + 1} / {cards.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-brand-purple transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Card Area */}
            <div className="mb-8">
                <FlashCard
                    card={currentCard}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex-1"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="flex-1"
                >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
