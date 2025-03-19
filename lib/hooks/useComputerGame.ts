"use client";

import { useState, useEffect, useCallback } from 'react';
import { GoGame } from '../go-game-logic';
import { ComputerAI } from '../computer-ai';
import { StoneColor, Position, BoardState, BoardSize, CapturedStones } from '@/types/go-game-types';

interface UseComputerGameProps {
  initialBoardSize?: BoardSize;
  difficulty?: 'beginner' | 'medium' | 'advanced';
  playerColor?: 'black' | 'white';
}

interface GameState {
  boardState: BoardState;
  currentPlayer: 'black' | 'white';
  capturedStones: CapturedStones;
  lastMove?: { row: number; col: number } | 'pass';
  gameOver: boolean;
  winner?: 'black' | 'white' | 'draw';
  scores?: { black: number; white: number };
}

export function useComputerGame({
  initialBoardSize = 19,
  difficulty = 'medium',
  playerColor = 'black',
}: UseComputerGameProps = {}) {
  // Initialize game and AI instances using refs to maintain them across renders
  const [game, setGame] = useState(() => new GoGame(initialBoardSize));
  const [ai, setAI] = useState(() => new ComputerAI(game, difficulty, playerColor === 'black' ? 'white' : 'black'));
  const [gameState, setGameState] = useState<GameState>({
    boardState: game.getBoard(),
    currentPlayer: game.getCurrentPlayer(),
    capturedStones: game.getCapturedStones(),
    gameOver: false,
  });
  const [thinking, setThinking] = useState(false);

  // Function to update game state
  const updateGameState = useCallback((lastMove?: { row: number; col: number } | 'pass') => {
    const isGameOver = game.isGameOver();
    const newState: GameState = {
      boardState: game.getBoard(),
      currentPlayer: game.getCurrentPlayer(),
      capturedStones: game.getCapturedStones(),
      lastMove,
      gameOver: isGameOver,
    };

    if (isGameOver) {
      const scores = game.calculateScore();
      newState.scores = scores;
      newState.winner = scores.black > scores.white ? 'black' : 
                      scores.white > scores.black ? 'white' : 'draw';
    }

    setGameState(newState);
  }, [game]);

  // Function for player to make a move
  const placeStone = useCallback((row: number, col: number): boolean => {
    // Ensure it's the player's turn and game is not over
    if (gameState.currentPlayer !== playerColor || gameState.gameOver) {
      return false;
    }

    // Try to place the stone
    const success = game.placeStone(row, col);
    
    if (success) {
      updateGameState({ row, col });
    }
    
    return success;
  }, [game, gameState.currentPlayer, gameState.gameOver, playerColor, updateGameState]);

  // Function for player to pass
  const pass = useCallback(() => {
    // Ensure it's the player's turn and game is not over
    if (gameState.currentPlayer !== playerColor || gameState.gameOver) {
      return false;
    }

    game.pass();
    updateGameState('pass');
    return true;
  }, [game, gameState.currentPlayer, gameState.gameOver, playerColor, updateGameState]);

  // Function to resign the game
  const resign = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      gameOver: true,
      winner: playerColor === 'black' ? 'white' : 'black',
    }));
  }, [playerColor]);

  // Function to restart the game
  const restartGame = useCallback((boardSize: BoardSize = initialBoardSize, newDifficulty = difficulty, newPlayerColor = playerColor) => {
    const newGame = new GoGame(boardSize);
    const newAI = new ComputerAI(
      newGame, 
      newDifficulty, 
      newPlayerColor === 'black' ? 'white' : 'black'
    );
    
    // Update game and AI instances
    setGame(newGame);
    setAI(newAI);
    
    setGameState({
      boardState: newGame.getBoard(),
      currentPlayer: newGame.getCurrentPlayer(),
      capturedStones: newGame.getCapturedStones(),
      gameOver: false,
    });
  }, [initialBoardSize, difficulty, playerColor]);

  // AI's turn handler
  useEffect(() => {
    const computerColor = playerColor === 'black' ? 'white' : 'black';
    
    // Make the computer move after a short delay
    if (gameState.currentPlayer === computerColor && !gameState.gameOver) {
      setThinking(true);
      
      const timer = setTimeout(() => {
        try {
          const aiMove = ai.makeMove();
          
          if (aiMove === 'pass') {
            game.pass();
            updateGameState('pass');
          } else {
            const success = game.placeStone(aiMove.row, aiMove.col);
            if (success) {
              updateGameState(aiMove);
            } else {
              console.error('AI made an invalid move');
              game.pass();
              updateGameState('pass');
            }
          }
        } catch (error) {
          console.error('AI error:', error);
          game.pass();
          updateGameState('pass');
        } finally {
          setThinking(false);
        }
      }, 800); // Delay to simulate thinking
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameOver, playerColor, ai, game, updateGameState]);

  return {
    gameState,
    thinking,
    placeStone,
    pass,
    resign,
    restartGame,
  };
} 