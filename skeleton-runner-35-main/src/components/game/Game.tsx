import { useState, useCallback } from 'react';
import { MainMenu } from './MainMenu';
import { SettingsMenu } from './SettingsMenu';
import { Leaderboard } from './Leaderboard';
import { LevelSelect } from './LevelSelect';
import { GameCanvas } from './GameCanvas';
import { GameSettings } from '@/lib/gameTypes';

type GameScreen = 'menu' | 'settings' | 'leaderboard' | 'levelSelect' | 'playing' | 'settingsInGame';

export function Game() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [previousScreen, setPreviousScreen] = useState<GameScreen>('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [settings, setSettings] = useState<GameSettings>({
    musicVolume: 0.3,
    sfxVolume: 0.5,
    showTouchControls: true,
  });

  const handlePlay = useCallback(() => {
    setSelectedLevel(1);
    setScreen('playing');
  }, []);

  const handleLevelSelect = useCallback(() => {
    setScreen('levelSelect');
  }, []);

  const handleSelectLevel = useCallback((level: number) => {
    setSelectedLevel(level);
    setScreen('playing');
  }, []);

  const handleSettings = useCallback(() => {
    setPreviousScreen(screen);
    setScreen('settings');
  }, [screen]);

  const handleSettingsInGame = useCallback(() => {
    setPreviousScreen('playing');
    setScreen('settingsInGame');
  }, []);

  const handleLeaderboard = useCallback(() => {
    setScreen('leaderboard');
  }, []);

  const handleMainMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  const handleSettingsBack = useCallback(() => {
    setScreen(previousScreen);
  }, [previousScreen]);

  const handleSettingsChange = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
  }, []);

  switch (screen) {
    case 'menu':
      return (
        <MainMenu
          onPlay={handlePlay}
          onLevelSelect={handleLevelSelect}
          onSettings={handleSettings}
          onLeaderboard={handleLeaderboard}
        />
      );

    case 'levelSelect':
      return (
        <LevelSelect
          onSelectLevel={handleSelectLevel}
          onBack={handleMainMenu}
        />
      );

    case 'settings':
    case 'settingsInGame':
      return (
        <SettingsMenu
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onBack={handleSettingsBack}
        />
      );

    case 'leaderboard':
      return <Leaderboard onBack={handleMainMenu} />;

    case 'playing':
      return (
        <GameCanvas
          startLevel={selectedLevel}
          settings={settings}
          onMainMenu={handleMainMenu}
          onSettingsOpen={handleSettingsInGame}
        />
      );

    default:
      return null;
  }
}
