'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from './Header';
import { Button } from './ui/Button';
import { ScoreBreakdown } from './results/ScoreBreakdown';
import { RankDisplay } from './results/RankDisplay';
import { LeaderboardTable } from './leaderboard/LeaderboardTable';
import { QuizAttempt, Quiz } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { useLeaderboard } from '@/lib/api-hooks';

interface ResultsScreenProps {
  attempt: QuizAttempt;
  quiz: Quiz;
  onBack: () => void;
}

export function ResultsScreen({ attempt, quiz, onBack }: ResultsScreenProps) {
  const { user } = useAuth();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { data: leaderboard = [] } = useLeaderboard(quiz.id);

  const userRank = leaderboard.findIndex((entry) => entry.user_id === user?.id) + 1;
  const totalParticipants = leaderboard.length;

  if (showLeaderboard) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-brand-obsidian">
        <Header />

        <main className="container py-8">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="secondary"
              onClick={() => setShowLeaderboard(false)}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Results
            </Button>

            <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-6 uppercase italic tracking-tighter">Leaderboard</h1>

            {user && <LeaderboardTable entries={leaderboard} currentUserId={user.id} />}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button
            variant="secondary"
            onClick={onBack}
            className="mb-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <ScoreBreakdown attempt={attempt} />

          {userRank > 0 && (
            <RankDisplay rank={userRank} totalParticipants={totalParticipants} />
          )}

          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={() => setShowLeaderboard(true)}
              className="px-8"
            >
              View Full Leaderboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}