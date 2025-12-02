import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skull, Home, RotateCcw, Trophy } from 'lucide-react';
import { addToLeaderboard } from '@/lib/leaderboard';
import { audioEngine } from '@/lib/audioEngine';

interface GameOverModalProps {
  score: number;
  level: number;
  soulsCollected: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function GameOverModal({
  score,
  level,
  soulsCollected,
  onRestart,
  onMainMenu,
}: GameOverModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (playerName.trim()) {
      addToLeaderboard({
        name: playerName.trim(),
        score,
        level,
      });
      setSubmitted(true);
      audioEngine.playSoulCollect();
    }
  };

  const handleRestart = () => {
    audioEngine.playClick();
    onRestart();
  };

  const handleMainMenu = () => {
    audioEngine.playClick();
    onMainMenu();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border w-full max-w-sm animate-bounce-in">
        <div className="text-center mb-6">
          <Skull className="h-16 w-16 mx-auto text-destructive mb-4 animate-shake" />
          <h2 className="font-creepster text-4xl text-destructive mb-2">
            Game Over
          </h2>
          <p className="text-muted-foreground">
            Your skeleton has fallen...
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-soul">{score}</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">{level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-marigold">{soulsCollected}</p>
            <p className="text-xs text-muted-foreground">Souls</p>
          </div>
        </div>

        {/* Leaderboard submission */}
        {!submitted ? (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Submit your score to the leaderboard:
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="flex-1"
              />
              <Button
                variant="gameAccent"
                onClick={handleSubmit}
                disabled={!playerName.trim()}
              >
                <Trophy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 bg-soul/20 rounded-lg text-center">
            <p className="text-soul font-medium">
              Score submitted! ✓
            </p>
          </div>
        )}

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
          <Button
            variant="game"
            onClick={handleRestart}
            className="flex-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
