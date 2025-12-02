import { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Level, GameSettings } from '@/lib/gameTypes';
import { generateLevel } from '@/lib/levelGenerator';
import { createInitialGameState, updateGame, calculateCameraX } from '@/lib/gameEngine';
import { renderGame, renderUI } from '@/lib/gameRenderer';
import { audioEngine } from '@/lib/audioEngine';
import { TouchControls } from './TouchControls';
import { PauseMenu } from './PauseMenu';
import { GameOverModal } from './GameOverModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { Button } from '@/components/ui/button';
import { Pause } from 'lucide-react';

interface GameCanvasProps {
  startLevel?: number;
  settings: GameSettings;
  onMainMenu: () => void;
  onSettingsOpen: () => void;
}

export function GameCanvas({ 
  startLevel = 1, 
  settings, 
  onMainMenu,
  onSettingsOpen 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animationTimeRef = useRef<number>(0);

  const [level, setLevel] = useState<Level>(() => generateLevel(startLevel));
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(level));
  const [isPaused, setIsPaused] = useState(false);
  const [cameraX, setCameraX] = useState(0);

  const inputsRef = useRef({
    left: false,
    right: false,
    jump: false,
    jumpPressed: false,
  });

  // Initialize audio
  useEffect(() => {
    audioEngine.init();
    audioEngine.startMusic();
    return () => {
      audioEngine.stopMusic();
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev);
        return;
      }

      if (isPaused || gameState.isGameOver || gameState.isLevelComplete) return;

      switch (e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          inputsRef.current.left = true;
          break;
        case 'd':
        case 'arrowright':
          inputsRef.current.right = true;
          break;
        case 'w':
        case 'arrowup':
        case ' ':
          if (!inputsRef.current.jumpPressed) {
            inputsRef.current.jump = true;
            inputsRef.current.jumpPressed = true;
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          inputsRef.current.left = false;
          break;
        case 'd':
        case 'arrowright':
          inputsRef.current.right = false;
          break;
        case 'w':
        case 'arrowup':
        case ' ':
          inputsRef.current.jump = false;
          inputsRef.current.jumpPressed = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, gameState.isGameOver, gameState.isLevelComplete]);

  // Touch control handlers
  const handleLeftStart = useCallback(() => {
    inputsRef.current.left = true;
  }, []);

  const handleLeftEnd = useCallback(() => {
    inputsRef.current.left = false;
  }, []);

  const handleRightStart = useCallback(() => {
    inputsRef.current.right = true;
  }, []);

  const handleRightEnd = useCallback(() => {
    inputsRef.current.right = false;
  }, []);

  const handleJump = useCallback(() => {
    if (!inputsRef.current.jumpPressed) {
      inputsRef.current.jump = true;
      inputsRef.current.jumpPressed = true;
      setTimeout(() => {
        inputsRef.current.jump = false;
        inputsRef.current.jumpPressed = false;
      }, 100);
    }
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;
      animationTimeRef.current += deltaTime;

      if (!isPaused && !gameState.isGameOver && !gameState.isLevelComplete) {
        const newState = updateGame(
          gameState,
          level,
          inputsRef.current,
          deltaTime
        );
        setGameState(newState);

        const newCameraX = calculateCameraX(newState.player, level.width, canvas.width);
        setCameraX(newCameraX);
      }

      // Render
      renderGame(ctx, gameState, level, cameraX, animationTimeRef.current);
      renderUI(ctx, gameState, level);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, level, isPaused, cameraX]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      const maxWidth = Math.min(container.clientWidth, 800);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      const aspectRatio = 800 / 600;

      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRestart = useCallback(() => {
    const newLevel = generateLevel(gameState.currentLevel);
    setLevel(newLevel);
    setGameState(createInitialGameState(newLevel));
    setCameraX(0);
    setIsPaused(false);
    inputsRef.current = { left: false, right: false, jump: false, jumpPressed: false };
  }, [gameState.currentLevel]);

  const handleNextLevel = useCallback(() => {
    const nextLevelNum = gameState.currentLevel + 1;
    const newLevel = generateLevel(nextLevelNum);
    setLevel(newLevel);
    setGameState(prev => ({
      ...createInitialGameState(newLevel),
      score: prev.score,
      lives: prev.lives,
    }));
    setCameraX(0);
    inputsRef.current = { left: false, right: false, jump: false, jumpPressed: false };
  }, [gameState.currentLevel, gameState.score, gameState.lives]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handlePause = useCallback(() => {
    audioEngine.playClick();
    setIsPaused(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-2 md:p-4">
      {/* Game canvas container */}
      <div className="relative w-full max-w-[800px]">
        {/* Pause button */}
        <Button
          variant="control"
          size="icon"
          onClick={handlePause}
          className="absolute top-2 right-2 z-10 bg-background/50"
        >
          <Pause className="h-5 w-5" />
        </Button>

        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="rounded-lg shadow-card border-2 border-border w-full"
        />
      </div>

      {/* Touch controls */}
      {settings.showTouchControls && (
        <TouchControls
          onLeftStart={handleLeftStart}
          onLeftEnd={handleLeftEnd}
          onRightStart={handleRightStart}
          onRightEnd={handleRightEnd}
          onJump={handleJump}
        />
      )}

      {/* Modals */}
      {isPaused && (
        <PauseMenu
          level={gameState.currentLevel}
          score={gameState.score}
          onResume={handleResume}
          onRestart={handleRestart}
          onSettings={onSettingsOpen}
          onMainMenu={onMainMenu}
        />
      )}

      {gameState.isGameOver && (
        <GameOverModal
          score={gameState.score}
          level={gameState.currentLevel}
          soulsCollected={gameState.soulsCollected}
          onRestart={handleRestart}
          onMainMenu={onMainMenu}
        />
      )}

      {gameState.isLevelComplete && (
        <LevelCompleteModal
          level={gameState.currentLevel}
          score={gameState.score}
          soulsCollected={gameState.soulsCollected}
          totalSouls={level.souls.length}
          timeBonus={Math.floor(gameState.timeRemaining) * 10}
          onNextLevel={handleNextLevel}
          onMainMenu={onMainMenu}
        />
      )}
    </div>
  );
}
