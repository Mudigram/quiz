import { Crown, Trophy } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatRank, getRankBadgeType } from '@/lib/utils';

interface RankDisplayProps {
  rank: number;
  totalParticipants: number;
}

export function RankDisplay({ rank, totalParticipants }: RankDisplayProps) {
  const badgeType = getRankBadgeType(rank);
  const isTopThree = rank <= 3;

  return (
    <Card className="slide-up">
      <div className="text-center">
        {isTopThree && (
          <div className="mb-4">
            {rank === 1 ? (
              <Crown className="w-12 h-12 text-yellow-500 mx-auto" />
            ) : (
              <Trophy className="w-12 h-12 text-zinc-500 mx-auto" />
            )}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-zinc-900 mb-3">Your Rank</h3>
        
        <div className="mb-4">
          <Badge variant={badgeType} className="text-2xl px-6 py-3">
            {formatRank(rank)}
          </Badge>
        </div>

        <p className="text-zinc-600">
          out of <span className="font-semibold text-zinc-900">{totalParticipants}</span>{' '}
          participants
        </p>

        {isTopThree && (
          <p className="text-sm text-green-600 font-medium mt-2">
            🎉 Congratulations! You're in the top 3!
          </p>
        )}
      </div>
    </Card>
  );
}