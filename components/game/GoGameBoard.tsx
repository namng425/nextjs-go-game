"use client";

import { useEffect } from "react";
import GoBoard from "./GoBoard";
import { useGameStore } from "@/lib/hooks/useGameStore";

export default function GoGameBoard() {
  const boardSize = useGameStore(state => state.boardSize);
  const boardState = useGameStore(state => state.boardState);
  const currentPlayer = useGameStore(state => state.currentPlayer);
  const initGame = useGameStore(state => state.initGame);
  const placeStone = useGameStore(state => state.placeStone);
  const isGameOver = useGameStore(state => state.isGameOver);
  
  // Initialize game on component mount
  useEffect(() => {
    initGame(19, "computer", "medium");
  }, [initGame]);

  return (
    <div className="flex flex-col items-center gap-4">
      <GoBoard
        size={boardSize}
        boardState={boardState}
        currentPlayer={currentPlayer}
        readOnly={isGameOver}
        onPlaceStone={placeStone}
      />
    </div>
  );
} 