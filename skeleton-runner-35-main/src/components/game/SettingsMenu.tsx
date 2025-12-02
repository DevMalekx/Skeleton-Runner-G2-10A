import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Volume2, Music, Smartphone } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';
import { GameSettings } from '@/lib/gameTypes';

interface SettingsMenuProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onBack: () => void;
}

export function SettingsMenu({ settings, onSettingsChange, onBack }: SettingsMenuProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleMusicChange = (value: number[]) => {
    const volume = value[0];
    audioEngine.setMusicVolume(volume);
    setLocalSettings(prev => ({ ...prev, musicVolume: volume }));
    onSettingsChange({ ...localSettings, musicVolume: volume });
  };

  const handleSfxChange = (value: number[]) => {
    const volume = value[0];
    audioEngine.setSfxVolume(volume);
    setLocalSettings(prev => ({ ...prev, sfxVolume: volume }));
    onSettingsChange({ ...localSettings, sfxVolume: volume });
    audioEngine.playClick();
  };

  const handleTouchControlsChange = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, showTouchControls: checked }));
    onSettingsChange({ ...localSettings, showTouchControls: checked });
    audioEngine.playClick();
  };

  const handleBack = () => {
    audioEngine.playClick();
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-sky bg-papel-picado flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="font-creepster text-4xl text-primary text-shadow-glow">
            Settings
          </h2>
        </div>

        <div className="space-y-8">
          {/* Music Volume */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Music className="h-5 w-5 text-secondary" />
              <span className="text-lg font-medium">Music Volume</span>
            </div>
            <Slider
              value={[localSettings.musicVolume]}
              onValueChange={handleMusicChange}
              max={1}
              step={0.1}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground">
              {Math.round(localSettings.musicVolume * 100)}%
            </span>
          </div>

          {/* SFX Volume */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-accent" />
              <span className="text-lg font-medium">Sound Effects</span>
            </div>
            <Slider
              value={[localSettings.sfxVolume]}
              onValueChange={handleSfxChange}
              max={1}
              step={0.1}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground">
              {Math.round(localSettings.sfxVolume * 100)}%
            </span>
          </div>

          {/* Touch Controls */}
          <div className="flex items-center justify-between py-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-marigold" />
              <span className="text-lg font-medium">Touch Controls</span>
            </div>
            <Switch
              checked={localSettings.showTouchControls}
              onCheckedChange={handleTouchControlsChange}
            />
          </div>
        </div>

        {/* Controls info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-foreground">Controls</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-card rounded border border-border">W</kbd>
              <kbd className="px-2 py-1 bg-card rounded border border-border">↑</kbd>
              <span>Jump</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-card rounded border border-border">Space</kbd>
              <span>Jump</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-card rounded border border-border">A</kbd>
              <kbd className="px-2 py-1 bg-card rounded border border-border">←</kbd>
              <span>Left</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-card rounded border border-border">D</kbd>
              <kbd className="px-2 py-1 bg-card rounded border border-border">→</kbd>
              <span>Right</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
