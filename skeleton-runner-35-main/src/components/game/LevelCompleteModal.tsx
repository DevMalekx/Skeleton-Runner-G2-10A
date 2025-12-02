import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Home } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';
import { completeLevel } from '@/lib/levelProgress';

interface LevelCompleteModalProps {
  level: number;
  score: number;
  soulsCollected: number;
  totalSouls: number;
  timeBonus: number;
  onNextLevel: () => void;
  onMainMenu: () => void;
}

export function LevelCompleteModal({
  level,
  score,
  soulsCollected,
  totalSouls,
  timeBonus,
  onNextLevel,
  onMainMenu,
}: LevelCompleteModalProps) {
  const stars = soulsCollected === totalSouls ? 3 : soulsCollected >= totalSouls / 2 ? 2 : 1;

  // Save progress when level is completed
  useEffect(() => {
    completeLevel(level, stars);
  }, [level, stars]);

  const handleNextLevel = () => {
    audioEngine.playClick();
    onNextLevel();
  };

  const handleMainMenu = () => {
    audioEngine.playClick();
    onMainMenu();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border w-full max-w-sm animate-bounce-in">
        <div className="text-center mb-6">
          <h2 className="font-creepster text-4xl text-soul text-shadow-soul mb-2">
            Level {level}
          </h2>
          <p className="font-creepster text-2xl text-primary">
            Complete!
          </p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((starNum) => (
            <Star
              key={starNum}
              className={`h-10 w-10 transition-all duration-500 ${
                starNum <= stars
                  ? 'text-marigold fill-marigold animate-bounce-in'
                  : 'text-muted-foreground'
              }`}
              style={{ animationDelay: `${starNum * 0.2}s` }}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">Souls Collected</span>
            <span className="font-bold text-soul">
              {soulsCollected}/{totalSouls}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">Time Bonus</span>
            <span className="font-bold text-teal">+{timeBonus}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/20 rounded-lg">
            <span className="text-foreground font-medium">Total Score</span>
            <span className="font-bold text-primary text-xl">{score}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="gameSecondary"
            onClick={handleMainMenu}
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            Menu
          </Button>
          {level < 50 ? (
            <Button
              variant="game"
              onClick={handleNextLevel}
              className="flex-1"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="game"
              onClick={handleMainMenu}
              className="flex-1"
            >
              🎉 Victory!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
