import { LeaderboardEntry } from './gameTypes';

const STORAGE_KEY = 'skeleton_runner_leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function addToLeaderboard(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry {
  const leaderboard = getLeaderboard();
  
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
  };
  
  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep only top 100
  const trimmed = leaderboard.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  
  return newEntry;
}

export function clearLeaderboard(): void {
  localStorage.removeItem(STORAGE_KEY);
}
