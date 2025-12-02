import { GameState, Level, Player, Position } from './gameTypes';
import { audioEngine } from './audioEngine';

const GRAVITY = 0.6;
const JUMP_FORCE = -14;
const MOVE_SPEED = 5;
const MAX_FALL_SPEED = 15;
const FRICTION = 0.85;

export function createInitialPlayer(startPosition: Position): Player {
  return {
    position: { x: startPosition.x, y: startPosition.y },
    velocity: { x: 0, y: 0 },
    width: 30,
    height: 50,
    isJumping: false,
    isGrounded: false,
    facingRight: true,
    animationFrame: 0,
    isDead: false,
  };
}

export function createInitialGameState(level: Level): GameState {
  return {
    player: createInitialPlayer(level.startPosition),
    currentLevel: level.id,
    score: 0,
    soulsCollected: 0,
    totalSouls: level.souls.length,
    lives: 3,
    isPaused: false,
    isGameOver: false,
    isLevelComplete: false,
    timeRemaining: level.timeLimit,
  };
}

export function updateGame(
  gameState: GameState,
  level: Level,
  inputs: { left: boolean; right: boolean; jump: boolean },
  deltaTime: number
): GameState {
  if (gameState.isPaused || gameState.isGameOver || gameState.isLevelComplete) {
    return gameState;
  }

  const newState = { ...gameState };
  const player = { ...newState.player };
  
  // Update time
  newState.timeRemaining -= deltaTime;
  if (newState.timeRemaining <= 0) {
    player.isDead = true;
    audioEngine.playDeath();
  }

  // Update animation frame
  player.animationFrame++;

  // Handle horizontal movement
  if (inputs.left) {
    player.velocity.x = -MOVE_SPEED;
    player.facingRight = false;
  } else if (inputs.right) {
    player.velocity.x = MOVE_SPEED;
    player.facingRight = true;
  } else {
    player.velocity.x *= FRICTION;
  }

  // Handle jumping
  if (inputs.jump && player.isGrounded && !player.isJumping) {
    player.velocity.y = JUMP_FORCE;
    player.isJumping = true;
    player.isGrounded = false;
    audioEngine.playJump();
  }

  // Apply gravity
  player.velocity.y += GRAVITY;
  player.velocity.y = Math.min(player.velocity.y, MAX_FALL_SPEED);

  // Update position
  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;

  // Update moving platforms and obstacles
  const updatedLevel = updateLevelEntities(level);

  // Platform collision
  player.isGrounded = false;
  for (const platform of updatedLevel.platforms) {
    const collision = checkPlatformCollision(player, platform);
    if (collision.collided) {
      if (collision.fromTop) {
        player.position.y = platform.y - player.height;
        player.velocity.y = 0;
        player.isGrounded = true;
        player.isJumping = false;
      } else if (collision.fromBottom) {
        player.position.y = platform.y + platform.height;
        player.velocity.y = 0;
      } else if (collision.fromLeft) {
        player.position.x = platform.x - player.width;
        player.velocity.x = 0;
      } else if (collision.fromRight) {
        player.position.x = platform.x + platform.width;
        player.velocity.x = 0;
      }
    }
  }

  // Soul collection
  for (const soul of updatedLevel.souls) {
    if (!soul.collected && checkSoulCollision(player, soul)) {
      soul.collected = true;
      newState.soulsCollected++;
      newState.score += 100;
      audioEngine.playSoulCollect();
    }
  }

  // Obstacle collision
  for (const obstacle of updatedLevel.obstacles) {
    if (checkObstacleCollision(player, obstacle)) {
      player.isDead = true;
      audioEngine.playDeath();
    }
  }

  // Check for falling off screen
  if (player.position.y > level.height + 100) {
    player.isDead = true;
    audioEngine.playDeath();
  }

  // Check for level completion
  if (checkEndPortalCollision(player, level.endPosition)) {
    newState.isLevelComplete = true;
    newState.score += Math.floor(newState.timeRemaining) * 10;
    newState.score += newState.soulsCollected * 50;
    audioEngine.playLevelComplete();
  }

  // Handle death
  if (player.isDead) {
    newState.lives--;
    if (newState.lives <= 0) {
      newState.isGameOver = true;
    } else {
      // Respawn
      player.position = { ...level.startPosition };
      player.velocity = { x: 0, y: 0 };
      player.isDead = false;
      player.isJumping = false;
      newState.timeRemaining = level.timeLimit;
    }
  }

  newState.player = player;
  return newState;
}

function updateLevelEntities(level: Level): Level {
  const time = Date.now() / 1000;

  // Update moving platforms
  for (const platform of level.platforms) {
    if (platform.type === 'moving' && platform.moveDirection && platform.moveRange && platform.moveSpeed) {
      if (platform.moveDirection === 'horizontal') {
        platform.x = platform.originalX! + Math.sin(time * platform.moveSpeed) * platform.moveRange;
      } else {
        platform.y = platform.originalY! + Math.sin(time * platform.moveSpeed) * platform.moveRange;
      }
    }
  }

  // Update moving obstacles
  for (const obstacle of level.obstacles) {
    if (obstacle.moveDirection && obstacle.moveRange && obstacle.moveSpeed) {
      if (obstacle.moveDirection === 'horizontal') {
        obstacle.x = obstacle.originalX! + Math.sin(time * obstacle.moveSpeed) * obstacle.moveRange;
      } else {
        obstacle.y = obstacle.originalY! + Math.sin(time * obstacle.moveSpeed) * obstacle.moveRange;
      }
    }
  }

  return level;
}

function checkPlatformCollision(
  player: Player,
  platform: { x: number; y: number; width: number; height: number }
) {
  const playerBottom = player.position.y + player.height;
  const playerRight = player.position.x + player.width;
  const platformBottom = platform.y + platform.height;
  const platformRight = platform.x + platform.width;

  const isOverlapping =
    player.position.x < platformRight &&
    playerRight > platform.x &&
    player.position.y < platformBottom &&
    playerBottom > platform.y;

  if (!isOverlapping) {
    return { collided: false, fromTop: false, fromBottom: false, fromLeft: false, fromRight: false };
  }

  const overlapTop = playerBottom - platform.y;
  const overlapBottom = platformBottom - player.position.y;
  const overlapLeft = playerRight - platform.x;
  const overlapRight = platformRight - player.position.x;

  const minOverlap = Math.min(overlapTop, overlapBottom, overlapLeft, overlapRight);

  return {
    collided: true,
    fromTop: minOverlap === overlapTop && player.velocity.y > 0,
    fromBottom: minOverlap === overlapBottom && player.velocity.y < 0,
    fromLeft: minOverlap === overlapLeft && player.velocity.x > 0,
    fromRight: minOverlap === overlapRight && player.velocity.x < 0,
  };
}

function checkSoulCollision(player: Player, soul: { x: number; y: number }): boolean {
  const playerCenterX = player.position.x + player.width / 2;
  const playerCenterY = player.position.y + player.height / 2;
  const distance = Math.sqrt(
    Math.pow(playerCenterX - soul.x, 2) + Math.pow(playerCenterY - soul.y, 2)
  );
  return distance < 30;
}

function checkObstacleCollision(
  player: Player,
  obstacle: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    player.position.x < obstacle.x + obstacle.width &&
    player.position.x + player.width > obstacle.x &&
    player.position.y < obstacle.y + obstacle.height &&
    player.position.y + player.height > obstacle.y
  );
}

function checkEndPortalCollision(player: Player, endPosition: Position): boolean {
  const playerCenterX = player.position.x + player.width / 2;
  const playerCenterY = player.position.y + player.height / 2;
  const distance = Math.sqrt(
    Math.pow(playerCenterX - endPosition.x, 2) + Math.pow(playerCenterY - endPosition.y, 2)
  );
  return distance < 40;
}

export function calculateCameraX(player: Player, levelWidth: number, canvasWidth: number): number {
  const targetX = player.position.x - canvasWidth / 3;
  return Math.max(0, Math.min(targetX, levelWidth - canvasWidth));
}
