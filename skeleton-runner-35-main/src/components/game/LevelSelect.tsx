import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Lock, Star, Skull } from 'lucide-react';
import { getLevelProgress, LevelProgress } from '@/lib/levelProgress';
import { audioEngine } from '@/lib/audioEngine';

interface LevelSelectProps {
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const LEVELS_PER_PAGE = 15;
const TOTAL_LEVELS = 50;

export function LevelSelect({ onSelectLevel, onBack }: LevelSelectProps) {
  const [page, setPage] = useState(0);
  const [progress] = useState<LevelProgress>(() => getLevelProgress());
  
  const totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);
  const startLevel = page * LEVELS_PER_PAGE + 1;
  const endLevel = Math.min(startLevel + LEVELS_PER_PAGE - 1, TOTAL_LEVELS);

  const handleLevelClick = (level: number) => {
    if (level <= progress.highestUnlocked) {
      audioEngine.playClick();
      onSelectLevel(level);
    }
  };

  const handlePrevPage = () => {
    audioEngine.playClick();
    setPage(p => Math.max(0, p - 1));
  };

  const handleNextPage = () => {
    audioEngine.playClick();
    setPage(p => Math.min(totalPages - 1, p + 1));
  };

  const handleBack = () => {
    audioEngine.playClick();
    onBack();
  };

  const renderStars = (levelNum: number) => {
    const stars = progress.levelStars[levelNum] || 0;
    return (
      <div className="flex gap-0.5 mt-1">
        {[1, 2, 3].map(i => (
          <Star
            key={i}
            className={`h-3 w-3 ${i <= stars ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
    );
  };

  const getLevelDifficulty = (level: number): string => {
    if (level <= 10) return 'Easy';
    if (level <= 25) return 'Medium';
    if (level <= 40) return 'Hard';
    return 'Expert';
  };

  const getDifficultyColor = (level: number): string => {
    if (level <= 10) return 'text-green-400';
    if (level <= 25) return 'text-yellow-400';
    if (level <= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-4">
      <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-card border-2 border-primary/30 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-display text-primary drop-shadow-glow mb-2">
            Select Level
          </h1>
          <p className="text-muted-foreground">
            Completed: {progress.completedLevels.length} / {TOTAL_LEVELS}
          </p>
        </div>

        {/* Page indicator */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            disabled={page === 0}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg font-medium text-foreground">
            World {page + 1} <span className="text-muted-foreground text-sm">({startLevel}-{endLevel})</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Level grid */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {Array.from({ length: endLevel - startLevel + 1 }, (_, i) => {
            const levelNum = startLevel + i;
            const isUnlocked = levelNum <= progress.highestUnlocked;
            const isCompleted = progress.completedLevels.includes(levelNum);
            
            return (
              <button
                key={levelNum}
                onClick={() => handleLevelClick(levelNum)}
                disabled={!isUnlocked}
                className={`
                  relative aspect-square rounded-xl flex flex-col items-center justify-center
                  transition-all duration-200 border-2
                  ${isUnlocked 
                    ? isCompleted
                      ? 'bg-primary/20 border-primary hover:bg-primary/30 hover:scale-105 cursor-pointer'
                      : 'bg-secondary/20 border-secondary hover:bg-secondary/30 hover:scale-105 cursor-pointer'
                    : 'bg-muted/50 border-muted cursor-not-allowed opacity-60'
                  }
                `}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-xl md:text-2xl font-bold text-foreground">{levelNum}</span>
                    {isCompleted && renderStars(levelNum)}
                    {!isCompleted && (
                      <Skull className="h-3 w-3 text-muted-foreground mt-1" />
                    )}
                  </>
                ) : (
                  <Lock className="h-6 w-6 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>

        {/* Difficulty legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
          <span className="text-green-400">● Easy (1-10)</span>
          <span className="text-yellow-400">● Medium (11-25)</span>
          <span className="text-orange-400">● Hard (26-40)</span>
          <span className="text-red-400">● Expert (41-50)</span>
        </div>

        {/* Back button */}
        <div className="flex justify-center">
          <Button
            variant="gameSecondary"
            size="lg"
            onClick={handleBack}
            className="px-8"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
