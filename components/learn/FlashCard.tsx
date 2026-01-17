'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Flashcard } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface FlashCardProps {
    card: Flashcard;
    isFlipped: boolean;
    onFlip: () => void;
}

export function FlashCard({ card, isFlipped, onFlip }: FlashCardProps) {
    return (
        <div className="relative w-full aspect-[4/3] perspective-1000 cursor-pointer group" onClick={onFlip}>
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden">
                    <Card className="h-full flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-brand-purple/50 transition-colors">
                        <div className="absolute top-4 right-4">
                            <RefreshCw className="w-5 h-5 text-zinc-400 group-hover:text-brand-purple transition-colors" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl md:text-2xl font-bold text-brand-black dark:text-brand-white">
                                {card.front_content}
                            </h3>
                        </div>
                        <div className="absolute bottom-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Tap to Flip
                        </div>
                    </Card>
                </div>

                {/* Back */}
                <div
                    className="absolute w-full h-full backface-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <Card className="h-full flex flex-col items-center justify-center p-8 bg-brand-purple/5 dark:bg-brand-purple/10 border-brand-purple/30">
                        <div className="absolute top-4 right-4">
                            <RefreshCw className="w-5 h-5 text-brand-purple" />
                        </div>
                        <div className="text-center prose dark:prose-invert max-w-none">
                            <p className="text-lg md:text-xl font-medium text-brand-black dark:text-brand-white leading-relaxed">
                                {card.back_content}
                            </p>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
