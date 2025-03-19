export type StoneColor = "black" | "white" | null;
export type BoardSize = 9 | 13 | 19;
export type BoardState = StoneColor[][];
export type Position = { row: number; col: number };
export type CapturedStones = { black: number; white: number };

export interface GoGameState {
  boardState: BoardState;
  currentPlayer: "black" | "white";
  capturedStones: CapturedStones;
  lastMove?: Position | "pass";
  size: BoardSize;
}

export interface GameScores {
  black: number;
  white: number;
}

export interface Player {
  id: string;
  username?: string;
  color?: "black" | "white";
}

export interface GameSummary {
  id: string;
  createdAt: Date;
  players: {
    black?: Player;
    white?: Player;
  };
  size: BoardSize;
  status: "waiting" | "active" | "finished";
  winner?: "black" | "white" | "draw";
  scores?: GameScores;
}

export type GameMode = "real-time" | "async" | "computer";
export type ComputerDifficulty = "beginner" | "medium" | "advanced"; 