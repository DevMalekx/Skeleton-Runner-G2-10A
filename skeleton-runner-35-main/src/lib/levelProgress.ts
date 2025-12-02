const STORAGE_KEY = 'skeleton_runner_progress';

export interface LevelProgress {
  highestUnlocked: number;
  completedLevels: number[];
  levelStars: Record<number, number>;
}

export function getLevelProgress(): LevelProgress {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      highestUnlocked: 1,
      completedLevels: [],
      levelStars: {},
    };
  }
  
  try {
    return JSON.parse(stored) as LevelProgress;
  } catch {
    return {
      highestUnlocked: 1,
      completedLevels: [],
      levelStars: {},
    };
  }
}

export function unlockLevel(levelNum: number): void {
  const progress = getLevelProgress();
  if (levelNum > progress.highestUnlocked) {
    progress.highestUnlocked = levelNum;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export function completeLevel(levelNum: number, stars: number): void {
  const progress = getLevelProgress();
  
  if (!progress.completedLevels.includes(levelNum)) {
    progress.completedLevels.push(levelNum);
  }
  
  if (!progress.levelStars[levelNum] || stars > progress.levelStars[levelNum]) {
    progress.levelStars[levelNum] = stars;
  }
  
  // Unlock next level
  if (levelNum + 1 > progress.highestUnlocked && levelNum < 50) {
    progress.highestUnlocked = levelNum + 1;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
