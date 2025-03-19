"use client";

import { create } from 'zustand';
import { GoGame } from '@/lib/game';
import { BoardState, BoardSize, Position, GameMode, ComputerDifficulty } from '@/types/go-game-types';

interface GameState {
  game: GoGame | null;
  boardState: BoardState;
  currentPlayer: "black" | "white";
  boardSize: BoardSize;
  gameMode: GameMode;
  computerDifficulty: ComputerDifficulty;
  lastMove: Position | null;
  capturedBlack: number;
  capturedWhite: number;
  isGameOver: boolean;
  winner: "black" | "white" | "draw" | null;
}

interface GameActions {
  initGame: (size: BoardSize, mode: GameMode, difficulty?: ComputerDifficulty) => void;
  placeStone: (row: number, col: number) => boolean;
  pass: () => void;
  resign: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  game: null,
  boardState: [],
  currentPlayer: "black",
  boardSize: 19,
  gameMode: "computer",
  computerDifficulty: "medium",
  lastMove: null,
  capturedBlack: 0,
  capturedWhite: 0,
  isGameOver: false,
  winner: null,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,
  
  initGame: (size, mode, difficulty = "medium") => {
    const game = new GoGame(size);
    set({
      game,
      boardSize: size,
      gameMode: mode,
      computerDifficulty: difficulty,
      boardState: game.getBoard(),
      currentPlayer: "black",
      lastMove: null,
      capturedBlack: 0,
      capturedWhite: 0,
      isGameOver: false,
      winner: null,
    });
  },
  
  placeStone: (row, col) => {
    const { game } = get();
    if (!game) return false;
    
    const result = game.placeStone(row, col);
    if (result) {
      const captured = game.getCapturedStones();
      set({
        boardState: game.getBoard(),
        currentPlayer: game.getCurrentPlayer(),
        lastMove: { row, col },
        capturedBlack: captured.black,
        capturedWhite: captured.white,
        isGameOver: game.isGameOver(),
        winner: game.getWinner(),
      });
    }
    return result;
  },
  
  pass: () => {
    const { game } = get();
    if (!game) return;
    
    game.pass();
    const captured = game.getCapturedStones();
    set({
      boardState: game.getBoard(),
      currentPlayer: game.getCurrentPlayer(),
      lastMove: null,
      capturedBlack: captured.black,
      capturedWhite: captured.white,
      isGameOver: game.isGameOver(),
      winner: game.getWinner(),
    });
  },
  
  resign: () => {
    const { game, currentPlayer } = get();
    if (!game) return;
    
    set({
      isGameOver: true,
      winner: currentPlayer === "black" ? "white" : "black",
    });
  },
  
  resetGame: () => {
    const { boardSize, gameMode, computerDifficulty } = get();
    const game = new GoGame(boardSize);
    set({
      game,
      boardState: game.getBoard(),
      currentPlayer: "black",
      lastMove: null,
      capturedBlack: 0,
      capturedWhite: 0,
      isGameOver: false,
      winner: null,
    });
  },
})); 