export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'floating' | 'moving' | 'crumbling';
  moveDirection?: 'horizontal' | 'vertical';
  moveRange?: number;
  moveSpeed?: number;
  originalX?: number;
  originalY?: number;
}

export interface Soul {
  x: number;
  y: number;
  collected: boolean;
  id: string;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'fire' | 'enemy';
  moveDirection?: 'horizontal' | 'vertical';
  moveRange?: number;
  moveSpeed?: number;
  originalX?: number;
  originalY?: number;
}

export interface Level {
  id: number;
  platforms: Platform[];
  souls: Soul[];
  obstacles: Obstacle[];
  startPosition: Position;
  endPosition: Position;
  width: number;
  height: number;
  timeLimit: number;
  difficulty: number;
}

export interface Player {
  position: Position;
  velocity: Velocity;
  width: number;
  height: number;
  isJumping: boolean;
  isGrounded: boolean;
  facingRight: boolean;
  animationFrame: number;
  isDead: boolean;
}

export interface GameState {
  player: Player;
  currentLevel: number;
  score: number;
  soulsCollected: number;
  totalSouls: number;
  lives: number;
  isPaused: boolean;
  isGameOver: boolean;
  isLevelComplete: boolean;
  timeRemaining: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  level: number;
  date: string;
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  showTouchControls: boolean;
}
