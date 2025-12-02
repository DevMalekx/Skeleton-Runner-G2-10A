import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Skull, Star } from 'lucide-react';
import { getLeaderboard } from '@/lib/leaderboard';
import { audioEngine } from '@/lib/audioEngine';
import { LeaderboardEntry } from '@/lib/gameTypes';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  // Fetch leaderboard data on mount to ensure fresh data
  useEffect(() => {
    setEntries(getLeaderboard());
  }, []);
  const handleBack = () => {
    audioEngine.playClick();
    onBack();
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return 'text-marigold';
      case 1:
        return 'text-bone';
      case 2:
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getMedalIcon = (index: number) => {
    if (index < 3) {
      return <Trophy className={`h-5 w-5 ${getMedalColor(index)}`} />;
    }
    return <Skull className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-gradient-sky bg-papel-picado flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-8 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="font-creepster text-4xl text-primary text-shadow-glow">
            Leaderboard
          </h2>
        </div>

        <div className="bg-gradient-card rounded-2xl p-4 shadow-card border border-border">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Skull className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                No scores yet!
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Play the game to be the first on the leaderboard
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {entries.slice(0, 20).map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    index < 3 ? 'bg-muted/50' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="w-8 flex justify-center">
                    {getMedalIcon(index)}
                  </div>
                  <span className={`w-6 text-center font-bold ${getMedalColor(index)}`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Level {entry.level}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-soul">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">{entry.score.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats summary */}
        {entries.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gradient-card rounded-xl p-4 text-center border border-border">
              <p className="text-2xl font-bold text-marigold">
                {entries.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Runs</p>
            </div>
            <div className="bg-gradient-card rounded-xl p-4 text-center border border-border">
              <p className="text-2xl font-bold text-soul">
                {entries[0]?.score.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">High Score</p>
            </div>
            <div className="bg-gradient-card rounded-xl p-4 text-center border border-border">
              <p className="text-2xl font-bold text-secondary">
                {Math.max(...entries.map(e => e.level))}
              </p>
              <p className="text-xs text-muted-foreground">Max Level</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
