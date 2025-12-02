import { Button } from '@/components/ui/button';
import { Play, Settings, Trophy, Volume2, Grid3X3 } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

interface MainMenuProps {
  onPlay: () => void;
  onLevelSelect: () => void;
  onSettings: () => void;
  onLeaderboard: () => void;
}

export function MainMenu({ onPlay, onLevelSelect, onSettings, onLeaderboard }: MainMenuProps) {
  const handleClick = (callback: () => void) => {
    audioEngine.init();
    audioEngine.resume();
    audioEngine.playClick();
    callback();
  };

  return (
    <div className="min-h-screen bg-gradient-sky bg-papel-picado flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div
              className={`w-4 h-4 rounded-full ${
                i % 3 === 0 ? 'bg-marigold' : i % 3 === 1 ? 'bg-magenta' : 'bg-teal'
              } opacity-60`}
            />
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="text-center mb-12 animate-bounce-in">
        <h1 className="font-creepster text-6xl md:text-8xl text-primary text-shadow-glow mb-4">
          Skeleton
        </h1>
        <h2 className="font-creepster text-4xl md:text-6xl text-secondary">
          Runner
        </h2>
        <p className="text-muted-foreground mt-4 text-lg">
          Día de los Muertos Edition
        </p>
      </div>

      {/* Skeleton character preview */}
      <div className="mb-12 animate-skeleton-idle">
        <svg width="80" height="120" viewBox="0 0 80 120" className="drop-shadow-lg">
          {/* Skull */}
          <ellipse cx="40" cy="25" rx="20" ry="22" fill="hsl(var(--bone))" />
          <ellipse cx="33" cy="22" rx="6" ry="7" fill="hsl(var(--background))" />
          <ellipse cx="47" cy="22" rx="6" ry="7" fill="hsl(var(--background))" />
          <circle cx="33" cy="22" r="3" fill="hsl(var(--marigold))" />
          <circle cx="47" cy="22" r="3" fill="hsl(var(--marigold))" />
          <polygon points="40,28 36,36 44,36" fill="hsl(var(--background))" />
          <rect x="30" y="38" width="20" height="6" fill="hsl(var(--background))" />
          {/* Teeth */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={31 + i * 4} y="38" width="3" height="6" fill="hsl(var(--bone))" />
          ))}
          {/* Flower decoration */}
          <circle cx="22" cy="12" r="6" fill="hsl(var(--secondary))" />
          <circle cx="22" cy="12" r="3" fill="hsl(var(--marigold))" />
          {/* Body */}
          <rect x="38" y="50" width="4" height="30" fill="hsl(var(--bone))" />
          {/* Ribs */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M 40 ${55 + i * 7} Q 55 ${53 + i * 7} 52 ${58 + i * 7} Q 55 ${63 + i * 7} 40 ${61 + i * 7}`} 
                    stroke="hsl(var(--bone))" strokeWidth="2" fill="none" />
              <path d={`M 40 ${55 + i * 7} Q 25 ${53 + i * 7} 28 ${58 + i * 7} Q 25 ${63 + i * 7} 40 ${61 + i * 7}`} 
                    stroke="hsl(var(--bone))" strokeWidth="2" fill="none" />
            </g>
          ))}
          {/* Legs */}
          <rect x="32" y="82" width="4" height="25" fill="hsl(var(--bone))" />
          <rect x="44" y="82" width="4" height="25" fill="hsl(var(--bone))" />
          <rect x="30" y="105" width="8" height="5" fill="hsl(var(--bone))" />
          <rect x="42" y="105" width="8" height="5" fill="hsl(var(--bone))" />
          {/* Arms */}
          <rect x="20" y="52" width="4" height="18" fill="hsl(var(--bone))" transform="rotate(-15 22 52)" />
          <rect x="56" y="52" width="4" height="18" fill="hsl(var(--bone))" transform="rotate(15 58 52)" />
        </svg>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs animate-slide-up">
        <Button
          variant="game"
          size="xl"
          onClick={() => handleClick(onPlay)}
          className="w-full"
        >
          <Play className="mr-2 h-6 w-6" />
          Play
        </Button>

        <Button
          variant="gameSecondary"
          size="lg"
          onClick={() => handleClick(onLevelSelect)}
          className="w-full"
        >
          <Grid3X3 className="mr-2 h-5 w-5" />
          Level Select
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
          variant="gameSecondary"
          size="lg"
          onClick={() => handleClick(onLeaderboard)}
          className="w-full"
        >
          <Trophy className="mr-2 h-5 w-5" />
          Leaderboard
        </Button>
      </div>

      {/* Sound hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm">
        <Volume2 className="h-4 w-4" />
        <span>Tap to enable sound</span>
      </div>
    </div>
  );
}
