import { Button } from '@/components/ui/button';
import { Play, Home, RotateCcw, Settings } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

interface PauseMenuProps {
  level: number;
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
}

export function PauseMenu({
  level,
  score,
  onResume,
  onRestart,
  onSettings,
  onMainMenu,
}: PauseMenuProps) {
  const handleClick = (callback: () => void) => {
    audioEngine.playClick();
    callback();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl p-6 shadow-card border border-border w-full max-w-sm animate-bounce-in">
        <div className="text-center mb-6">
          <h2 className="font-creepster text-4xl text-primary text-shadow-glow mb-2">
            Paused
          </h2>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>Level {level}</span>
            <span>•</span>
            <span>Score: {score}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="game"
            size="lg"
            onClick={() => handleClick(onResume)}
            className="w-full"
          >
            <Play className="mr-2 h-5 w-5" />
            Resume
          </Button>

          <Button
            variant="gameSecondary"
            size="lg"
            onClick={() => handleClick(onRestart)}
            className="w-full"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Restart Level
          </Button>

          <Button
            variant="gameSecondary"
            size="lg"
            onClick={() => handleClick(onSettings)}
            className="w-full"
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => handleClick(onMainMenu)}
            className="w-full"
          >
            <Home className="mr-2 h-5 w-5" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
