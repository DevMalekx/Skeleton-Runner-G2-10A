import { Level, Platform, Soul, Obstacle, Position } from './gameTypes';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function getDifficultyModifiers(level: number) {
  const difficulty = Math.min(level / 50, 1); // 0 to 1 scale
  
  return {
    platformGap: 80 + difficulty * 80, // 80 to 160
    platformWidth: Math.max(60, 150 - difficulty * 60), // 150 to 60
    movingPlatformChance: 0.1 + difficulty * 0.4, // 10% to 50%
    obstacleCount: Math.floor(difficulty * 8), // 0 to 8
    soulCount: 3 + Math.floor(difficulty * 7), // 3 to 10
    timeLimit: Math.max(30, 90 - difficulty * 40), // 90 to 30 seconds
    enemySpeed: 1 + difficulty * 2, // 1 to 3
    levelWidth: CANVAS_WIDTH * (1.5 + level * 0.1), // Longer levels as you progress
    difficulty: difficulty,
  };
}

export function generateLevel(levelNumber: number): Level {
  const mods = getDifficultyModifiers(levelNumber);
  const platforms: Platform[] = [];
  const souls: Soul[] = [];
  const obstacles: Obstacle[] = [];

  // Ground platform at start
  platforms.push({
    x: 0,
    y: CANVAS_HEIGHT - 40,
    width: 200,
    height: 40,
    type: 'ground',
  });

  // Generate platforms across the level
  let lastX = 150;
  let lastY = CANVAS_HEIGHT - 80;

  while (lastX < mods.levelWidth - 200) {
    const gap = mods.platformGap + Math.random() * 40 - 20;
    const newX = lastX + gap;
    const yVariation = Math.random() * 150 - 75;
    const newY = Math.max(100, Math.min(CANVAS_HEIGHT - 100, lastY + yVariation));
    const width = mods.platformWidth + Math.random() * 40;

    const isMoving = Math.random() < mods.movingPlatformChance;
    
    platforms.push({
      x: newX,
      y: newY,
      width: width,
      height: 20,
      type: isMoving ? 'moving' : 'floating',
      moveDirection: isMoving ? (Math.random() > 0.5 ? 'horizontal' : 'vertical') : undefined,
      moveRange: isMoving ? 50 + Math.random() * 50 : undefined,
      moveSpeed: isMoving ? 1 + Math.random() * mods.enemySpeed : undefined,
      originalX: newX,
      originalY: newY,
    });

    // Add soul above some platforms
    if (Math.random() < 0.6 && souls.length < mods.soulCount) {
      souls.push({
        x: newX + width / 2,
        y: newY - 50,
        collected: false,
        id: generateId(),
      });
    }

    lastX = newX + width;
    lastY = newY;
  }

  // End platform
  platforms.push({
    x: mods.levelWidth - 200,
    y: CANVAS_HEIGHT - 60,
    width: 200,
    height: 60,
    type: 'ground',
  });

  // Add obstacles
  for (let i = 0; i < mods.obstacleCount; i++) {
    const platform = platforms[Math.floor(Math.random() * (platforms.length - 2)) + 1];
    
    if (Math.random() > 0.5) {
      // Spike
      obstacles.push({
        x: platform.x + Math.random() * (platform.width - 30),
        y: platform.y - 20,
        width: 30,
        height: 20,
        type: 'spike',
      });
    } else {
      // Moving enemy
      const enemyX = platform.x + platform.width + 50;
      obstacles.push({
        x: enemyX,
        y: platform.y - 30,
        width: 30,
        height: 30,
        type: 'enemy',
        moveDirection: 'horizontal',
        moveRange: 80,
        moveSpeed: mods.enemySpeed,
        originalX: enemyX,
        originalY: platform.y - 30,
      });
    }
  }

  // Ensure minimum souls
  while (souls.length < 3) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    souls.push({
      x: platform.x + platform.width / 2,
      y: platform.y - 50,
      collected: false,
      id: generateId(),
    });
  }

  const startPosition: Position = { x: 50, y: CANVAS_HEIGHT - 100 };
  const endPosition: Position = { x: mods.levelWidth - 100, y: CANVAS_HEIGHT - 100 };

  return {
    id: levelNumber,
    platforms,
    souls,
    obstacles,
    startPosition,
    endPosition,
    width: mods.levelWidth,
    height: CANVAS_HEIGHT,
    timeLimit: mods.timeLimit,
    difficulty: mods.difficulty,
  };
}

export function getAllLevels(): Level[] {
  const levels: Level[] = [];
  for (let i = 1; i <= 50; i++) {
    levels.push(generateLevel(i));
  }
  return levels;
}
