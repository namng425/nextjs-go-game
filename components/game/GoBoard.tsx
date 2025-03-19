"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { StoneColor, BoardSize, BoardState } from "@/types/go-game-types";

type Coordinates = { x: number; y: number };

interface GoBoardProps {
  size?: BoardSize;
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
  
  // Other state management
  const [hoverPosition, setHoverPosition] = useState<{ row: number; col: number } | null>(null);
  
  // Grid styling calculations
  const cellSize = 30; // Size of each cell in pixels
  const gridSize = cellSize * size;
  const stoneSize = cellSize * 0.85;
  const starPoints = getStarPoints(size);

  // Handle click on the board
  const handleClick = (row: number, col: number) => {
    if (readOnly || boardState[row][col] !== null) return;

    // Call external handler if provided
    if (onPlaceStone) {
      onPlaceStone(row, col);
    }
  };

  return (
    <div
      className={cn("relative bg-amber-100 border border-amber-900", className)}
      style={{
        width: gridSize,
        height: gridSize,
      }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0">
        {Array.from({ length: size }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute bg-amber-900"
            style={{
              left: 0,
              top: cellSize * (i + 0.5),
              width: "100%",
              height: 1,
            }}
          />
        ))}
        {Array.from({ length: size }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute bg-amber-900"
            style={{
              top: 0,
              left: cellSize * (i + 0.5),
              height: "100%",
              width: 1,
            }}
          />
        ))}
      </div>

      {/* Star points */}
      {starPoints.map(({ x, y }, i) => (
        <div
          key={`star-${i}`}
          className="absolute bg-amber-900 rounded-full"
          style={{
            left: cellSize * (x + 0.5) - 3,
            top: cellSize * (y + 0.5) - 3,
            width: 6,
            height: 6,
          }}
        />
      ))}

      {/* Stones */}
      {boardState.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (!cell) return null;
          return (
            <div
              key={`stone-${rowIndex}-${colIndex}`}
              className={cn(
                "absolute rounded-full shadow-md",
                cell === "black" ? "bg-black" : "bg-white"
              )}
              style={{
                left: cellSize * (colIndex + 0.5) - stoneSize / 2,
                top: cellSize * (rowIndex + 0.5) - stoneSize / 2,
                width: stoneSize,
                height: stoneSize,
              }}
            />
          );
        })
      )}

      {/* Hover indicator */}
      {!readOnly && hoverPosition && !boardState[hoverPosition.row]?.[hoverPosition.col] && (
        <div
          className={cn(
            "absolute rounded-full opacity-50",
            currentPlayer === "black" ? "bg-black" : "bg-white"
          )}
          style={{
            left: cellSize * (hoverPosition.col + 0.5) - stoneSize / 2,
            top: cellSize * (hoverPosition.row + 0.5) - stoneSize / 2,
            width: stoneSize,
            height: stoneSize,
          }}
        />
      )}

      {/* Click area */}
      {Array.from({ length: size }).map((_, rowIndex) =>
        Array.from({ length: size }).map((_, colIndex) => (
          <div
            key={`cell-${rowIndex}-${colIndex}`}
            className="absolute cursor-pointer"
            style={{
              left: cellSize * colIndex,
              top: cellSize * rowIndex,
              width: cellSize,
              height: cellSize,
            }}
            onClick={() => handleClick(rowIndex, colIndex)}
            onMouseEnter={() => setHoverPosition({ row: rowIndex, col: colIndex })}
            onMouseLeave={() => setHoverPosition(null)}
          />
        ))
      )}
    </div>
  );
}

// Helper function to get star point coordinates based on board size
function getStarPoints(size: number): Coordinates[] {
  if (size === 9) {
    return [
      { x: 2, y: 2 },
      { x: 2, y: 6 },
      { x: 6, y: 2 },
      { x: 6, y: 6 },
      { x: 4, y: 4 },
    ];
  } else if (size === 13) {
    return [
      { x: 3, y: 3 },
      { x: 3, y: 9 },
      { x: 9, y: 3 },
      { x: 9, y: 9 },
      { x: 6, y: 6 },
    ];
  } else {
    // Default for 19x19
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