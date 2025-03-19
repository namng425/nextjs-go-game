// Game module exports
export { GoGame } from './core';
export { ComputerAI } from './ai';

// Re-export types for convenience
export type {
  StoneColor,
  BoardSize,
  BoardState,
  Position,
  CapturedStones,
  GoGameState,
  GameScores,
  Player,
  GameSummary,
  GameMode,
  ComputerDifficulty
} from '@/types/go-game-types'; 