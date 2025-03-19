"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useComputerGame } from "@/lib/hooks/useComputerGame";
import { BoardSize, GameMode } from "@/types/go-game-types";

// Dynamically import the GoBoard component to avoid SSR issues
const GoBoard = dynamic(() => import("@/components/GoBoard"), { ssr: false });

export default function PlayPage() {
  const [gameMode, setGameMode] = useState<GameMode>("real-time");
  const [boardSize, setBoardSize] = useState<BoardSize>(19);
  const [difficulty, setDifficulty] = useState<"beginner" | "medium" | "advanced">("medium");
  const [showNewGameForm, setShowNewGameForm] = useState(true);
  const [currentGame, setCurrentGame] = useState<{
    id: string;
    mode: GameMode;
    size: BoardSize;
    opponent?: string;
  } | null>(null);

  // Initialize computer game hook
  const {
    gameState,
    thinking,
    placeStone,
    pass,
    resign,
    restartGame,
  } = useComputerGame({
    initialBoardSize: boardSize,
    difficulty,
    playerColor: "black",
  });

  // Function to handle starting a new game
  const handleStartGame = () => {
    // In a real app, this would connect to a backend API
    const gameId = Math.random().toString(36).substring(2, 10);
    
    setCurrentGame({
      id: gameId,
      mode: gameMode,
      size: boardSize,
      opponent: gameMode === "computer" ? `AI (${difficulty})` : undefined,
    });
    
    if (gameMode === "computer") {
      restartGame(boardSize, difficulty, "black");
    }
    
    setShowNewGameForm(false);
  };

  // Function to handle stone placement
  const handlePlaceStone = (row: number, col: number) => {
    if (currentGame?.mode === "computer") {
      placeStone(row, col);
    }
  };

  // Function to handle passing turn
  const handlePass = () => {
    if (currentGame?.mode === "computer") {
      pass();
    }
  };

  // Function to handle resignation
  const handleResign = () => {
    if (currentGame?.mode === "computer") {
      resign();
    }
    setShowNewGameForm(true);
  };

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Play Go</h1>
        <p className="text-muted-foreground">
          Start a new game or continue an existing one
        </p>
      </div>

      {showNewGameForm ? (
        <div className="max-w-md mx-auto space-y-8">
          <div className="p-6 space-y-6 border rounded-lg">
            <h2 className="text-xl font-medium">Start a New Game</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Game Mode</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value as GameMode)}
                >
                  <option value="real-time">Real-time Game</option>
                  <option value="async">Asynchronous Game</option>
                  <option value="computer">Play Against Computer</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Board Size</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={boardSize}
                  onChange={(e) => setBoardSize(Number(e.target.value) as BoardSize)}
                >
                  <option value={9}>9×9</option>
                  <option value={13}>13×13</option>
                  <option value={19}>19×19</option>
                </select>
              </div>

              {gameMode === "computer" && (
                <div>
                  <label className="block mb-2 text-sm font-medium">Difficulty</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as "beginner" | "medium" | "advanced")}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="medium">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              )}
              
              <button
                onClick={handleStartGame}
                className="w-full px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/90"
              >
                Start Game
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 border rounded-lg">
            <h2 className="text-xl font-medium">Your Games</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You have no active games. Start a new game or sign in to access your saved games.
              </p>
              <Link 
                href="/login" 
                className="block w-full px-4 py-2 text-center border rounded-md hover:bg-secondary/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-medium">
              Game #{currentGame?.id}
              {currentGame?.opponent && ` - vs ${currentGame.opponent}`}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {`${currentGame?.size}×${currentGame?.size} board - ${
                currentGame?.mode === "real-time" 
                  ? "Real-time Game" 
                  : currentGame?.mode === "async" 
                    ? "Asynchronous Game" 
                    : "Computer Game"
              }`}
            </p>
            {thinking && currentGame?.mode === "computer" && (
              <p className="mt-2 text-sm text-muted-foreground">
                Computer is thinking...
              </p>
            )}
          </div>

          <div className="flex items-center justify-center my-8">
            <GoBoard
              size={currentGame?.size || 19}
              currentPlayer={gameState.currentPlayer}
              boardState={currentGame?.mode === "computer" ? gameState.boardState : undefined}
              onPlaceStone={handlePlaceStone}
              readOnly={thinking || gameState.gameOver}
            />
          </div>

          <div className="flex gap-4">
            <button 
              className="px-4 py-2 text-white bg-destructive rounded-md hover:bg-destructive/90"
              onClick={handleResign}
              disabled={gameState.gameOver}
            >
              Resign Game
            </button>
            <button 
              className="px-4 py-2 border rounded-md hover:bg-secondary/10"
              onClick={handlePass}
              disabled={thinking || gameState.gameOver}
            >
              Pass Turn
            </button>
          </div>

          {gameState.gameOver && currentGame?.mode === "computer" && (
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium">
                Game Over - {gameState.winner === "black" ? "You Won!" : "Computer Won!"}
              </h3>
              {gameState.scores && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Final Score - Black: {gameState.scores.black} | White: {gameState.scores.white}
                </p>
              )}
              <button
                className="mt-4 px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/90"
                onClick={() => setShowNewGameForm(true)}
              >
                Start New Game
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 