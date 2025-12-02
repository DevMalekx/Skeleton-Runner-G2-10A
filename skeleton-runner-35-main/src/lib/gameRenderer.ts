import { GameState, Level, Player, Platform, Soul, Obstacle } from './gameTypes';

const COLORS = {
  sky: '#1a0a2e',
  skyGradientMid: '#2d1b4e',
  skyGradientBottom: '#3d2a5c',
  ground: '#5c3d2e',
  groundDark: '#4a2f22',
  platform: '#6b4423',
  platformLight: '#8b6914',
  bone: '#e8e0d5',
  boneDark: '#c9c0b0',
  skull: '#f5f0e8',
  soulGreen: '#4ade80',
  soulGlow: '#86efac',
  marigold: '#f59e0b',
  magenta: '#ec4899',
  teal: '#14b8a6',
  spike: '#94a3b8',
  enemy: '#dc2626',
  enemyEye: '#fef08a',
  endPortal: '#a855f7',
};

export function renderGame(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  level: Level,
  cameraX: number,
  animationTime: number
) {
  const { width, height } = ctx.canvas;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
  skyGradient.addColorStop(0, COLORS.sky);
  skyGradient.addColorStop(0.5, COLORS.skyGradientMid);
  skyGradient.addColorStop(1, COLORS.skyGradientBottom);
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height);

  // Draw decorative elements (stars, papel picado)
  drawDecorations(ctx, cameraX, animationTime, width, height);

  // Save context for camera transform
  ctx.save();
  ctx.translate(-cameraX, 0);

  // Draw platforms
  level.platforms.forEach(platform => {
    drawPlatform(ctx, platform, animationTime);
  });

  // Draw souls
  level.souls.forEach(soul => {
    if (!soul.collected) {
      drawSoul(ctx, soul, animationTime);
    }
  });

  // Draw obstacles
  level.obstacles.forEach(obstacle => {
    drawObstacle(ctx, obstacle, animationTime);
  });

  // Draw end portal
  drawEndPortal(ctx, level.endPosition.x, level.endPosition.y, animationTime);

  // Draw player
  if (!gameState.player.isDead) {
    drawPlayer(ctx, gameState.player, animationTime);
  }

  ctx.restore();
}

function drawDecorations(ctx: CanvasRenderingContext2D, cameraX: number, time: number, width: number, height: number) {
  // Stars
  ctx.fillStyle = '#fef08a';
  for (let i = 0; i < 50; i++) {
    const x = ((i * 73 + cameraX * 0.1) % (width + 100)) - 50;
    const y = (i * 37) % (height * 0.6);
    const size = 1 + Math.sin(time * 2 + i) * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Papel picado banners at top
  const colors = [COLORS.marigold, COLORS.magenta, COLORS.teal, COLORS.soulGreen];
  for (let i = 0; i < 20; i++) {
    const x = ((i * 80 - cameraX * 0.3) % (width + 160)) - 80;
    const sway = Math.sin(time * 2 + i * 0.5) * 5;
    
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 30, 0);
    ctx.lineTo(x + 25 + sway, 40);
    ctx.lineTo(x + 15, 35);
    ctx.lineTo(x + 5 + sway, 40);
    ctx.closePath();
    ctx.fill();
  }

  // Floating marigold petals
  ctx.fillStyle = COLORS.marigold;
  for (let i = 0; i < 15; i++) {
    const x = ((i * 120 + time * 30 - cameraX * 0.2) % (width + 100)) - 50;
    const y = (Math.sin(time + i * 2) * 50 + 150 + i * 20) % height;
    const rotation = time * 2 + i;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawPlatform(ctx: CanvasRenderingContext2D, platform: Platform, time: number) {
  const gradient = ctx.createLinearGradient(
    platform.x, platform.y,
    platform.x, platform.y + platform.height
  );
  gradient.addColorStop(0, COLORS.platformLight);
  gradient.addColorStop(1, COLORS.platform);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

  // Decorative skulls on platforms
  if (platform.width > 60) {
    drawMiniSkull(ctx, platform.x + 10, platform.y - 8);
    if (platform.width > 120) {
      drawMiniSkull(ctx, platform.x + platform.width - 20, platform.y - 8);
    }
  }

  // Border
  ctx.strokeStyle = COLORS.groundDark;
  ctx.lineWidth = 2;
  ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
}

function drawMiniSkull(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = COLORS.bone;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = COLORS.sky;
  ctx.beginPath();
  ctx.arc(x - 2, y - 1, 2, 0, Math.PI * 2);
  ctx.arc(x + 2, y - 1, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSoul(ctx: CanvasRenderingContext2D, soul: Soul, time: number) {
  const pulse = Math.sin(time * 4) * 5 + 20;
  const float = Math.sin(time * 2 + soul.x) * 5;

  // Glow effect
  const glowGradient = ctx.createRadialGradient(
    soul.x, soul.y + float, 0,
    soul.x, soul.y + float, pulse
  );
  glowGradient.addColorStop(0, COLORS.soulGlow);
  glowGradient.addColorStop(0.5, COLORS.soulGreen + '80');
  glowGradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(soul.x, soul.y + float, pulse, 0, Math.PI * 2);
  ctx.fill();

  // Core
  ctx.fillStyle = COLORS.soulGreen;
  ctx.beginPath();
  ctx.arc(soul.x, soul.y + float, 12, 0, Math.PI * 2);
  ctx.fill();

  // Inner highlight
  ctx.fillStyle = COLORS.soulGlow;
  ctx.beginPath();
  ctx.arc(soul.x - 3, soul.y + float - 3, 4, 0, Math.PI * 2);
  ctx.fill();

  // Wispy trails
  ctx.strokeStyle = COLORS.soulGreen + '60';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const angle = time * 3 + i * (Math.PI * 2 / 3);
    ctx.beginPath();
    ctx.moveTo(soul.x, soul.y + float + 12);
    ctx.quadraticCurveTo(
      soul.x + Math.cos(angle) * 15,
      soul.y + float + 25,
      soul.x + Math.cos(angle) * 8,
      soul.y + float + 35
    );
    ctx.stroke();
  }
}

function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle, time: number) {
  if (obstacle.type === 'spike') {
    ctx.fillStyle = COLORS.spike;
    ctx.beginPath();
    ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
    ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y);
    ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (obstacle.type === 'enemy') {
    // Skull enemy
    const bounce = Math.sin(time * 5) * 3;
    
    ctx.fillStyle = COLORS.enemy;
    ctx.beginPath();
    ctx.arc(obstacle.x + 15, obstacle.y + 15 + bounce, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = COLORS.enemyEye;
    ctx.beginPath();
    ctx.arc(obstacle.x + 10, obstacle.y + 12 + bounce, 4, 0, Math.PI * 2);
    ctx.arc(obstacle.x + 20, obstacle.y + 12 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = COLORS.enemyEye;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(obstacle.x + 8, obstacle.y + 22 + bounce);
    ctx.lineTo(obstacle.x + 22, obstacle.y + 22 + bounce);
    ctx.stroke();
  }
}

function drawEndPortal(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  // Outer glow
  const glowGradient = ctx.createRadialGradient(x, y - 30, 0, x, y - 30, 60);
  glowGradient.addColorStop(0, COLORS.endPortal + '80');
  glowGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(x, y - 30, 60, 0, Math.PI * 2);
  ctx.fill();

  // Portal ring
  ctx.strokeStyle = COLORS.endPortal;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x, y - 30, 30, 40, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Swirling effect
  ctx.strokeStyle = COLORS.magenta;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const angle = time * 2 + i * (Math.PI * 2 / 3);
    ctx.beginPath();
    ctx.arc(x, y - 30, 20, angle, angle + Math.PI);
    ctx.stroke();
  }

  // Altar base
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(x - 35, y - 10, 70, 20);
  ctx.fillStyle = COLORS.marigold;
  ctx.fillRect(x - 30, y - 15, 60, 5);
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player, time: number) {
  const { position, width, height, facingRight, isJumping, isGrounded, animationFrame } = player;
  
  ctx.save();
  ctx.translate(position.x + width / 2, position.y + height / 2);
  
  if (!facingRight) {
    ctx.scale(-1, 1);
  }

  // Animation offset
  const walkBounce = isGrounded && Math.abs(player.velocity.x) > 0.1 
    ? Math.sin(animationFrame * 0.5) * 3 
    : 0;
  const idleBounce = isGrounded && Math.abs(player.velocity.x) < 0.1 
    ? Math.sin(time * 3) * 2 
    : 0;
  const jumpStretch = isJumping ? 1.1 : 1;

  ctx.translate(0, walkBounce + idleBounce);
  ctx.scale(1, jumpStretch);

  // Draw skeleton body
  const boneColor = COLORS.bone;
  const darkBone = COLORS.boneDark;

  // Torso (ribcage)
  ctx.fillStyle = boneColor;
  ctx.strokeStyle = darkBone;
  ctx.lineWidth = 1;

  // Spine
  ctx.fillRect(-2, -10, 4, 25);

  // Ribs
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, -8 + i * 6);
    ctx.quadraticCurveTo(12, -6 + i * 6, 10, -2 + i * 6);
    ctx.quadraticCurveTo(12, 2 + i * 6, 0, 0 + i * 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -8 + i * 6);
    ctx.quadraticCurveTo(-12, -6 + i * 6, -10, -2 + i * 6);
    ctx.quadraticCurveTo(-12, 2 + i * 6, 0, 0 + i * 6);
    ctx.stroke();
  }

  // Pelvis
  ctx.beginPath();
  ctx.ellipse(0, 18, 10, 6, 0, 0, Math.PI);
  ctx.fill();

  // Legs
  const legSwing = Math.abs(player.velocity.x) > 0.1 ? Math.sin(animationFrame * 0.5) * 15 : 0;
  
  // Left leg
  ctx.save();
  ctx.translate(-5, 22);
  ctx.rotate((legSwing * Math.PI) / 180);
  ctx.fillRect(-2, 0, 4, 18);
  ctx.fillRect(-3, 18, 6, 4);
  ctx.restore();

  // Right leg
  ctx.save();
  ctx.translate(5, 22);
  ctx.rotate((-legSwing * Math.PI) / 180);
  ctx.fillRect(-2, 0, 4, 18);
  ctx.fillRect(-3, 18, 6, 4);
  ctx.restore();

  // Arms
  const armSwing = Math.abs(player.velocity.x) > 0.1 ? Math.sin(animationFrame * 0.5 + Math.PI) * 20 : 0;
  
  // Left arm
  ctx.save();
  ctx.translate(-10, -6);
  ctx.rotate((armSwing * Math.PI) / 180);
  ctx.fillRect(-2, 0, 4, 14);
  ctx.fillRect(-3, 14, 6, 4);
  ctx.restore();

  // Right arm
  ctx.save();
  ctx.translate(10, -6);
  ctx.rotate((-armSwing * Math.PI) / 180);
  ctx.fillRect(-2, 0, 4, 14);
  ctx.fillRect(-3, 14, 6, 4);
  ctx.restore();

  // Skull
  ctx.fillStyle = COLORS.skull;
  ctx.beginPath();
  ctx.ellipse(0, -22, 12, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye sockets
  ctx.fillStyle = COLORS.sky;
  ctx.beginPath();
  ctx.ellipse(-5, -24, 4, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(5, -24, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye glow (Day of the Dead style)
  ctx.fillStyle = COLORS.marigold;
  ctx.beginPath();
  ctx.arc(-5, -24, 2, 0, Math.PI * 2);
  ctx.arc(5, -24, 2, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = COLORS.sky;
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(-3, -16);
  ctx.lineTo(3, -16);
  ctx.closePath();
  ctx.fill();

  // Mouth/teeth
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(-7, -13, 14, 4);
  ctx.fillStyle = COLORS.skull;
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(-6 + i * 3, -13, 2, 4);
  }

  // Decorative flowers (Day of the Dead style)
  ctx.fillStyle = COLORS.magenta;
  ctx.beginPath();
  ctx.arc(-10, -30, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.marigold;
  ctx.beginPath();
  ctx.arc(-10, -30, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function renderUI(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  level: Level
) {
  const { width } = ctx.canvas;

  // Score and souls display
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(10, 10, 200, 70);
  
  ctx.fillStyle = COLORS.soulGreen;
  ctx.font = 'bold 20px Fredoka';
  ctx.fillText(`Souls: ${gameState.soulsCollected}/${level.souls.length}`, 20, 35);
  
  ctx.fillStyle = COLORS.marigold;
  ctx.fillText(`Score: ${gameState.score}`, 20, 60);

  // Level display
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(width - 120, 10, 110, 35);
  ctx.fillStyle = COLORS.magenta;
  ctx.fillText(`Level ${gameState.currentLevel}`, width - 110, 35);

  // Time display
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(width / 2 - 50, 10, 100, 35);
  ctx.fillStyle = gameState.timeRemaining < 10 ? COLORS.enemy : COLORS.teal;
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.ceil(gameState.timeRemaining)}s`, width / 2, 35);
  ctx.textAlign = 'left';

  // Lives display
  for (let i = 0; i < gameState.lives; i++) {
    drawMiniSkullUI(ctx, 20 + i * 25, 80);
  }
}

function drawMiniSkullUI(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = COLORS.skull;
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = COLORS.sky;
  ctx.beginPath();
  ctx.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
  ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
  ctx.fill();
}
