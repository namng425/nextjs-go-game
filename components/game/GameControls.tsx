"use client";

import { useGameStore } from "@/lib/hooks/useGameStore";

export default function GameControls() {
  const pass = useGameStore(state => state.pass);
  const resign = useGameStore(state => state.resign);
  const resetGame = useGameStore(state => state.resetGame);
  const isGameOver = useGameStore(state => state.isGameOver);
  const winner = useGameStore(state => state.winner);
  const currentPlayer = useGameStore(state => state.currentPlayer);
  
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold">Game Controls</h2>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Current player</span>
          <div className="flex items-center mt-1">
            <div 
              className={`w-4 h-4 rounded-full mr-2 ${
                currentPlayer === "black" ? "bg-black" : "bg-white border border-gray-300"
              }`} 
            />
            <span>{currentPlayer === "black" ? "Black" : "White"}</span>
          </div>
        </div>
        
        {isGameOver && (
          <div>
            <span className="text-sm text-muted-foreground">Game status</span>
            <div className="flex items-center mt-1">
              <span className="font-medium">
                {winner === "black" 
                  ? "Black wins" 
                  : winner === "white" 
                  ? "White wins" 
                  : "Draw"}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={() => pass()}
          disabled={isGameOver}
          className="px-4 py-2 bg-secondary/80 hover:bg-secondary rounded-md text-sm disabled:opacity-50"
        >
          Pass
        </button>
        
        <button
          onClick={() => resign()}
          disabled={isGameOver}
          className="px-4 py-2 bg-destructive/80 hover:bg-destructive text-white rounded-md text-sm disabled:opacity-50"
        >
          Resign
        </button>
        
        {isGameOver && (
          <button
            onClick={() => resetGame()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            New Game
          </button>
        )}
      </div>
    </div>
  );
} 