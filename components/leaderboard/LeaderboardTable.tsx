import { Trophy } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { LeaderboardEntry } from '@/lib/types';
import { formatScore, formatTimeRemaining, getRankBadgeType } from '@/lib/utils';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-6">
      {/* Top 3 */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((entry) => (
            <Card
              key={entry.user_id}
              className={`text-center slide-up ${entry.user_id === currentUserId ? 'ring-2 ring-brand-purple' : ''
                }`}
            >
              <div className="mb-3">
                <Trophy
                  className={`w-8 h-8 mx-auto ${entry.rank === 1
                      ? 'text-brand-magenta'
                      : entry.rank === 2
                        ? 'text-brand-purple'
                        : 'text-brand-blue'
                    }`}
                />
              </div>
              <Avatar
                src={entry.discord_avatar_url}
                alt={entry.discord_username}
                size="lg"
                className="mx-auto mb-3"
              />
              <Badge variant={getRankBadgeType(entry.rank)} className="mb-2">
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'} {entry.rank}
                {entry.rank === 1 ? 'st' : entry.rank === 2 ? 'nd' : 'rd'}
              </Badge>
              <h3 className="font-bold text-brand-black dark:text-brand-white mb-1">{entry.discord_username}</h3>
              <div className="text-2xl font-black text-brand-purple mb-1 italic tracking-tighter">
                {formatScore(entry.score)}
              </div>
              <div className="text-xs text-brand-black/60 dark:text-brand-white/60 font-medium">
                {entry.correct_answers} correct • {formatTimeRemaining(entry.time_taken_seconds)}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <Card className="slide-up">
          <div className="divide-y divide-zinc-200">
            {rest.map((entry) => (
              <div
                key={entry.user_id}
                className={`flex items-center gap-4 py-4 ${entry.user_id === currentUserId ? 'bg-brand-purple/5 -mx-6 px-6' : ''
                  }`}
              >
                <div className="w-12 text-center">
                  <span className="font-semibold text-zinc-900">{entry.rank}</span>
                </div>
                <Avatar src={entry.discord_avatar_url} alt={entry.discord_username} size="sm" />
                <div className="flex-1">
                  <div className="font-medium text-zinc-900">{entry.discord_username}</div>
                  <div className="text-sm text-zinc-600">
                    {entry.correct_answers} correct • {formatTimeRemaining(entry.time_taken_seconds)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-brand-purple italic tracking-tighter">
                    {formatScore(entry.score)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}