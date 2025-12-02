// Web Audio API based sound engine for the game

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private isPlaying = false;

  private musicVolume = 0.3;
  private sfxVolume = 0.5;

  init() {
    if (this.audioContext) return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.musicGain = this.audioContext.createGain();
    this.sfxGain = this.audioContext.createGain();

    this.masterGain.connect(this.audioContext.destination);
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);

    this.musicGain.gain.value = this.musicVolume;
    this.sfxGain.gain.value = this.sfxVolume;
  }

  resume() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setMusicVolume(volume: number) {
    this.musicVolume = volume;
    if (this.musicGain) {
      this.musicGain.gain.value = volume;
    }
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = volume;
    if (this.sfxGain) {
      this.sfxGain.gain.value = volume;
    }
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getSfxVolume() {
    return this.sfxVolume;
  }

  playJump() {
    if (!this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  playSoulCollect() {
    if (!this.audioContext || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = this.audioContext!.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playDeath() {
    if (!this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);

    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }

  playLevelComplete() {
    if (!this.audioContext || !this.sfxGain) return;

    const melody = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 880, 1046.5];
    
    melody.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = this.audioContext!.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  playClick() {
    if (!this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = 800;

    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  startMusic() {
    if (!this.audioContext || !this.musicGain || this.isPlaying) return;

    this.isPlaying = true;
    this.playMusicLoop();
  }

  private playMusicLoop() {
    if (!this.audioContext || !this.musicGain || !this.isPlaying) return;

    // Day of the Dead inspired melody pattern
    const bassNotes = [130.81, 146.83, 164.81, 174.61]; // C3, D3, E3, F3
    const melodyNotes = [
      261.63, 293.66, 329.63, 349.23, 392, 349.23, 329.63, 293.66,
      261.63, 329.63, 392, 440, 392, 329.63, 293.66, 261.63
    ];

    const loopDuration = 4; // seconds

    // Bass line
    bassNotes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      filter.type = 'lowpass';
      filter.frequency.value = 300;

      const startTime = this.audioContext!.currentTime + i * (loopDuration / 4);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.setValueAtTime(0.15, startTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(startTime);
      osc.stop(startTime + 1);
      this.musicOscillators.push(osc);
    });

    // Melody
    melodyNotes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = this.audioContext!.currentTime + i * (loopDuration / 16);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
      this.musicOscillators.push(osc);
    });

    // Schedule next loop
    setTimeout(() => {
      if (this.isPlaying) {
        this.playMusicLoop();
      }
    }, loopDuration * 1000);
  }

  stopMusic() {
    this.isPlaying = false;
    this.musicOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.musicOscillators = [];
  }
}

export const audioEngine = new AudioEngine();
