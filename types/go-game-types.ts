export type StoneColor = 'black' | 'white' | null;

export interface Position {
  row: number;
  col: number;
}

export type BoardState = StoneColor[][];

export type BoardSize = 9 | 13 | 19;

export interface CapturedStones {
  black: number;
  white: number;
}

export type GameMode = 'real-time' | 'async' | 'computer';

export interface GameState {
  boardState: BoardState;
  currentPlayer: 'black' | 'white';
  capturedStones: CapturedStones;
  lastMove?: { row: number; col: number } | 'pass';
  gameOver: boolean;
  winner?: 'black' | 'white' | 'draw';
  scores?: { black: number; white: number };
}