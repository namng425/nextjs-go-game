"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { StoneColor } from '@/types/go-game-types';

interface GameState {
  boardState: Array<Array<StoneColor>>;
  currentPlayer: 'black' | 'white';
  capturedStones: {
    black: number;
    white: number;
  };
  lastMove?: {
    row: number;
    col: number;
  } | 'pass';
}

interface GameScores {
  black: number;
  white: number;
}

interface GameOverData {
  scores?: GameScores;
  winner?: 'black' | 'white';
  byResignation?: boolean;
}

interface UseSocketProps {
  socketUrl?: string;
}

export function useSocket({ socketUrl = 'http://localhost:3001' }: UseSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<'black' | 'white' | null>(null);
  const [isSpectator, setIsSpectator] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameOver, setGameOver] = useState<GameOverData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  
  // Initialize socket connection
  useEffect(() => {
    const socket = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to game server');
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err.message || 'An error occurred');
    });

    // Game state updates
    socket.on('game_state', (state: GameState) => {
      setGameState(state);
    });

    // Game created response
    socket.on('game_created', ({ gameId }: { gameId: string }) => {
      setGameId(gameId);
    });

    // Join responses
    socket.on('joined_as_player', ({ gameId, color }: { gameId: string; color: 'black' | 'white' }) => {
      setGameId(gameId);
      setPlayerColor(color);
      setIsSpectator(false);
    });
    
    socket.on('joined_as_spectator', ({ gameId }: { gameId: string; message?: string }) => {
      setGameId(gameId);
      setPlayerColor(null);
      setIsSpectator(true);
    });

    // Game over events
    socket.on('game_over', (data: GameOverData) => {
      setGameOver(data);
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [socketUrl]);

  // Create a new game
  const createGame = useCallback((size: 9 | 13 | 19 = 19) => {
    if (!socketRef.current || !isConnected) return;
    socketRef.current.emit('create_game', { size });
  }, [isConnected]);

  // Join an existing game
  const joinGame = useCallback((gameId: string, role: 'black' | 'white' | 'spectator' = 'spectator') => {
    if (!socketRef.current || !isConnected) return;
    socketRef.current.emit('join_game', { gameId, role });
  }, [isConnected]);

  // Place a stone on the board
  const placeStone = useCallback((row: number, col: number) => {
    if (!socketRef.current || !gameId || !isConnected) return;
    socketRef.current.emit('place_stone', { gameId, row, col });
  }, [gameId, isConnected]);

  // Pass the current turn
  const passTurn = useCallback(() => {
    if (!socketRef.current || !gameId || !isConnected) return;
    socketRef.current.emit('pass', { gameId });
  }, [gameId, isConnected]);

  // Resign from the game
  const resignGame = useCallback(() => {
    if (!socketRef.current || !gameId || !isConnected) return;
    socketRef.current.emit('resign', { gameId });
  }, [gameId, isConnected]);

  return {
    isConnected,
    gameId,
    playerColor,
    isSpectator,
    gameState,
    gameOver,
    error,
    createGame,
    joinGame,
    placeStone,
    passTurn,
    resignGame,
  };
}