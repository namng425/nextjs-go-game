import { GoGame } from './go-game-logic';
import { StoneColor, Position, BoardState } from '@/types/go-game-types';

export class ComputerAI {
  private game: GoGame;
  private difficulty: 'beginner' | 'medium' | 'advanced';
  private color: 'black' | 'white';
  private size: number;

  constructor(
    game: GoGame,
    difficulty: 'beginner' | 'medium' | 'advanced' = 'medium',
    color: 'black' | 'white' = 'white'
  ) {
    this.game = game;
    this.difficulty = difficulty;
    this.color = color;
    this.size = game.getBoard().length;
  }

  public makeMove(): Position | 'pass' {
    if (this.game.getCurrentPlayer() !== this.color) {
      throw new Error("Not the AI's turn");
    }

    const boardState = this.game.getBoard();

    switch (this.difficulty) {
      case 'beginner':
        return this.makeBeginnerMove(boardState);
      case 'medium':
        return this.makeMediumMove(boardState);
      case 'advanced':
        return this.makeAdvancedMove(boardState);
      default:
        return this.makeBeginnerMove(boardState);
    }
  }

  private makeBeginnerMove(boardState: BoardState): Position | 'pass' {
    if (Math.random() < 0.05) return 'pass';

    const legalMoves = this.findLegalMoves(boardState);
    if (legalMoves.length === 0) return 'pass';

    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    const move = legalMoves[randomIndex];

    const success = this.game.placeStone(move.row, move.col);

    if (!success) {
      legalMoves.splice(randomIndex, 1);
      if (legalMoves.length === 0) return 'pass';

      const newRandomIndex = Math.floor(Math.random() * legalMoves.length);
      const newMove = legalMoves[newRandomIndex];

      const newSuccess = this.game.placeStone(newMove.row, newMove.col);
      if (!newSuccess) return 'pass';

      return newMove;
    }

    return move;
  }

  private makeMediumMove(boardState: BoardState): Position | 'pass' {
    if (Math.random() < 0.02) return 'pass';

    const legalMoves = this.findLegalMoves(boardState);
    if (legalMoves.length === 0) return 'pass';

    const captureMove = this.findCaptureMove(boardState);
    if (captureMove) {
      const success = this.game.placeStone(captureMove.row, captureMove.col);
      if (success) return captureMove;
    }

    const defendMove = this.findDefendMove(boardState);
    if (defendMove) {
      const success = this.game.placeStone(defendMove.row, defendMove.col);
      if (success) return defendMove;
    }

    const centerMoves = legalMoves.filter(
      move => move.row > 1 && move.row < this.size - 2 &&
              move.col > 1 && move.col < this.size - 2
    );

    const movesToTry = centerMoves.length > 0 ? centerMoves : legalMoves;

    for (let i = 0; i < 3; i++) {
      if (movesToTry.length === 0) break;

      const randomIndex = Math.floor(Math.random() * movesToTry.length);
      const move = movesToTry[randomIndex];

      const success = this.game.placeStone(move.row, move.col);
      if (success) return move;

      movesToTry.splice(randomIndex, 1);
    }

    return 'pass';
  }

  private makeAdvancedMove(boardState: BoardState): Position | 'pass' {
    const totalStones = this.countStones(boardState);

    if (totalStones < 10) {
      const starPoints = this.getStarPoints();
      const emptyStarPoints = starPoints.filter(
        point => boardState[point.row][point.col] === null
      );

      if (emptyStarPoints.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyStarPoints.length);
        const move = emptyStarPoints[randomIndex];

        const success = this.game.placeStone(move.row, move.col);
        if (success) return move;
      }
    }

    return this.makeMediumMove(boardState);
  }

  private findLegalMoves(boardState: BoardState): Position[] {
    const legalMoves: Position[] = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (boardState[row][col] === null) {
          legalMoves.push({ row, col });
        }
      }
    }

    return legalMoves;
  }

  private findCaptureMove(boardState: BoardState): Position | null {
    const opponentColor = this.color === 'black' ? 'white' : 'black';

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (boardState[row][col] !== null) continue;

        const adjacentPositions = [
          { row: row - 1, col },
          { row: row + 1, col },
          { row, col: col - 1 },
          { row, col: col + 1 },
        ];

        for (const pos of adjacentPositions) {
          if (
            pos.row >= 0 && pos.row < this.size &&
            pos.col >= 0 && pos.col < this.size &&
            boardState[pos.row][pos.col] === opponentColor
          ) {
            const hasOnlyOneLiberty = this.hasOnlyOneLiberty(boardState, pos.row, pos.col);
            if (hasOnlyOneLiberty) return { row, col };
          }
        }
      }
    }

    return null;
  }

  private findDefendMove(boardState: BoardState): Position | null {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (boardState[row][col] === this.color) {
          const libertyPositions = this.findLibertyPositions(boardState, row, col);
          if (libertyPositions.length === 1) return libertyPositions[0];
        }
      }
    }

    return null;
  }

  private hasOnlyOneLiberty(boardState: BoardState, row: number, col: number): boolean {
    let libertyCount = 0;
    const adjacentPositions = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    for (const pos of adjacentPositions) {
      if (
        pos.row >= 0 && pos.row < this.size &&
        pos.col >= 0 && pos.col < this.size &&
        boardState[pos.row][pos.col] === null
      ) {
        libertyCount++;
        if (libertyCount > 1) return false;
      }
    }

    return libertyCount === 1;
  }

  private findLibertyPositions(boardState: BoardState, row: number, col: number): Position[] {
    const liberties: Position[] = [];
    const adjacentPositions = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    for (const pos of adjacentPositions) {
      if (
        pos.row >= 0 && pos.row < this.size &&
        pos.col >= 0 && pos.col < this.size &&
        boardState[pos.row][pos.col] === null
      ) {
        liberties.push(pos);
      }
    }

    return liberties;
  }

  private countStones(boardState: BoardState): number {
    let count = 0;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (boardState[row][col] !== null) count++;
      }
    }
    return count;
  }

  private getStarPoints(): Position[] {
    const points: Position[] = [];
    const starPoints = [
      { row: 3, col: 3 },
      { row: 3, col: this.size - 4 },
      { row: this.size - 4, col: 3 },
      { row: this.size - 4, col: this.size - 4 },
    ];

    if (this.size >= 13) {
      const mid = Math.floor(this.size / 2);
      points.push(
        { row: mid, col: mid },
        { row: 3, col: mid },
        { row: this.size - 4, col: mid },
        { row: mid, col: 3 },
        { row: mid, col: this.size - 4 }
      );
    }

    return [...starPoints, ...points];
  }
}