"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Types for stones and intersections
type StoneColor = "black" | "white" | null;
type BoardSize = 9 | 13 | 19;
type BoardState = StoneColor[][];
type Coordinates = { x: number; y: number };

interface GoBoardProps {
  size: BoardSize;
  onPlaceStone?: (row: number, col: number) => void;
  readOnly?: boolean;
  currentPlayer?: "black" | "white";
  boardState?: BoardState;
  className?: string;
}

export default function GoBoard({
  size = 19,
  onPlaceStone,
  readOnly = false,
  currentPlayer = "black",
  boardState: externalBoardState,
  className,
}: GoBoardProps) {
  // Initialize board state if not provided
  const boardState = externalBoardState || Array(size).fill(null).map(() => Array(size).fill(null));

  // Handle stone placement
  const handleIntersectionClick = (row: number, col: number) => {
    if (readOnly || boardState[row][col] !== null) return;
    
    // Notify parent component
    if (onPlaceStone) {
      onPlaceStone(row, col);
    }
  };

  // Render board grid
  return (
    <div 
      className={cn(
        "relative bg-amber-100 border border-gray-800 shadow-md rounded",
        className
      )}
      style={{
        width: `${size * 30}px`,
        height: `${size * 30}px`,
      }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 grid" style={{ 
        gridTemplateColumns: `repeat(${size - 1}, 1fr)`,
        gridTemplateRows: `repeat(${size - 1}, 1fr)`,
        margin: "15px",
        width: `calc(100% - 30px)`,
        height: `calc(100% - 30px)`,
      }}>
        {Array(size - 1).fill(null).map((_, rowIdx) => (
          Array(size - 1).fill(null).map((_, colIdx) => (
            <div 
              key={`grid-${rowIdx}-${colIdx}`} 
              className="relative border border-gray-800"
            />
          ))
        ))}
      </div>

      {/* Star points (hoshi) */}
      {getStarPoints(size).map(({x, y}) => (
        <div
          key={`star-${x}-${y}`}
          className="absolute w-2 h-2 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${(x / (size - 1)) * (100 - (30 / (size * 30) * 100)) + (15 / (size * 30) * 100)}%`,
            top: `${(y / (size - 1)) * (100 - (30 / (size * 30) * 100)) + (15 / (size * 30) * 100)}%`,
          }}
        />
      ))}

      {/* Intersections */}
      <div className="absolute inset-0 grid" style={{ 
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}>
        {boardState.map((row, y) => (
          row.map((intersection, x) => (
            <div 
              key={`intersection-${x}-${y}`} 
              className="flex items-center justify-center cursor-pointer"
              onClick={() => handleIntersectionClick(y, x)}
            >
              {intersection && (
                <div 
                  className={cn(
                    "w-5/6 h-5/6 rounded-full shadow-md transform transition-transform",
                    intersection === "black" ? "bg-gray-900" : "bg-white border border-gray-300"
                  )}
                />
              )}
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

// Helper function to get star points based on board size
function getStarPoints(size: BoardSize): Coordinates[] {
  if (size === 9) {
    return [
      { x: 2, y: 2 },
      { x: 2, y: 6 },
      { x: 4, y: 4 },
      { x: 6, y: 2 },
      { x: 6, y: 6 },
    ];
  } else if (size === 13) {
    return [
      { x: 3, y: 3 },
      { x: 3, y: 9 },
      { x: 6, y: 6 },
      { x: 9, y: 3 },
      { x: 9, y: 9 },
    ];
  } else { // size === 19
    return [
      { x: 3, y: 3 },
      { x: 3, y: 9 },
      { x: 3, y: 15 },
      { x: 9, y: 3 },
      { x: 9, y: 9 },
      { x: 9, y: 15 },
      { x: 15, y: 3 },
      { x: 15, y: 9 },
      { x: 15, y: 15 },
    ];
  }
} 