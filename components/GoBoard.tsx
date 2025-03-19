"use client";

import { useCallback, useEffect, useRef } from 'react';
import { StoneColor, BoardState } from '@/types/go-game-types';

interface GoBoardProps {
  size: number;
  currentPlayer: 'black' | 'white';
  boardState?: BoardState;
  onPlaceStone?: (row: number, col: number) => void;
  readOnly?: boolean;
}

export default function GoBoard({
  size,
  currentPlayer,
  boardState = Array(size).fill(null).map(() => Array(size).fill(null)),
  onPlaceStone,
  readOnly = false,
}: GoBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellSize = 30;
  const padding = 20;
  const stoneRadius = cellSize * 0.45;

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#DCB35C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    for (let i = 0; i < size; i++) {
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(padding, padding + i * cellSize);
      ctx.lineTo(padding + (size - 1) * cellSize, padding + i * cellSize);
      ctx.stroke();

      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(padding + i * cellSize, padding);
      ctx.lineTo(padding + i * cellSize, padding + (size - 1) * cellSize);
      ctx.stroke();
    }

    // Draw star points
    const starPoints = [
      { x: 3, y: 3 },
      { x: size - 4, y: 3 },
      { x: 3, y: size - 4 },
      { x: size - 4, y: size - 4 },
    ];

    if (size >= 13) {
      const mid = Math.floor(size / 2);
      starPoints.push(
        { x: mid, y: mid },
        { x: 3, y: mid },
        { x: size - 4, y: mid },
        { x: mid, y: 3 },
        { x: mid, y: size - 4 }
      );
    }

    ctx.fillStyle = '#000000';
    for (const point of starPoints) {
      ctx.beginPath();
      ctx.arc(
        padding + point.x * cellSize,
        padding + point.y * cellSize,
        3,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // Draw stones
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const stone = boardState[row][col];
        if (stone) {
          ctx.fillStyle = stone === 'black' ? '#000000' : '#FFFFFF';
          ctx.strokeStyle = stone === 'black' ? '#000000' : '#000000';
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.arc(
            padding + col * cellSize,
            padding + row * cellSize,
            stoneRadius,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }, [size, boardState, cellSize, padding, stoneRadius]);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (readOnly || !onPlaceStone) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calculate grid position
      const col = Math.round((x - padding) / cellSize);
      const row = Math.round((y - padding) / cellSize);

      // Check if click is within valid bounds
      if (
        col >= 0 && col < size &&
        row >= 0 && row < size
      ) {
        onPlaceStone(row, col);
      }
    },
    [size, cellSize, padding, onPlaceStone, readOnly]
  );

  return (
    <canvas
      ref={canvasRef}
      width={size * cellSize + 2 * padding}
      height={size * cellSize + 2 * padding}
      onClick={handleCanvasClick}
      className={`cursor-${readOnly ? 'default' : 'pointer'}`}
    />
  );
}
