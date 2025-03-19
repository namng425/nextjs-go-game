import { GoGame } from './core';
import { StoneColor, Position, BoardState, ComputerDifficulty } from '@/types/go-game-types';

/**
 * Computer AI for the Go game
 */
export class ComputerAI {
  private game: GoGame;
  private difficulty: ComputerDifficulty;
  private color: 'black' | 'white';
  private size: number;

  /**
   * Create a new computer AI instance
   * @param game GoGame instance
   * @param difficulty AI difficulty level
   * @param color AI player color
   */
  constructor(
    game: GoGame, 
    difficulty: ComputerDifficulty = 'medium',
    color: 'black' | 'white' = 'white'
  ) {
    this.game = game;
    this.difficulty = difficulty;
    this.color = color;
    this.size = game.getBoard().length;
  }

  /**
   * Make the AI's move
   * @returns Position of the stone placed or null if passed
   */
  public makeMove(): Position | null {
    if (this.game.isGameOver()) {
      return null;
    }

    if (this.game.getCurrentPlayer() !== this.color) {
      return null;
    }

    // Different strategies based on difficulty
    switch (this.difficulty) {
      case 'beginner':
        return this.makeBeginnerMove();
      case 'medium':
        return this.makeMediumMove();
      case 'advanced':
        return this.makeAdvancedMove();
      default:
        return this.makeRandomMove();
    }
  }

  /**
   * Beginner level AI: Mostly random moves with some basic capture awareness
   */
  private makeBeginnerMove(): Position | null {
    // Try to capture opponent's stones with 30% probability
    if (Math.random() < 0.3) {
      const captureMove = this.findCaptureMoves()[0];
      if (captureMove) {
        this.game.placeStone(captureMove.row, captureMove.col);
        return captureMove;
      }
    }

    // Otherwise make a random move
    return this.makeRandomMove();
  }

  /**
   * Medium level AI: Mix of random moves and basic strategy
   */
  private makeMediumMove(): Position | null {
    // Try to capture opponent's stones with 50% probability
    if (Math.random() < 0.5) {
      const captureMove = this.findCaptureMoves()[0];
      if (captureMove) {
        this.game.placeStone(captureMove.row, captureMove.col);
        return captureMove;
      }
    }

    // Try to defend own stones with 40% probability
    if (Math.random() < 0.4) {
      const defendMove = this.findDefensiveMoves()[0];
      if (defendMove) {
        this.game.placeStone(defendMove.row, defendMove.col);
        return defendMove;
      }
    }

    // Try to play near the center or other stones
    const influenceMove = this.findInfluenceMove();
    if (influenceMove) {
      this.game.placeStone(influenceMove.row, influenceMove.col);
      return influenceMove;
    }

    // Fallback to random move
    return this.makeRandomMove();
  }

  /**
   * Advanced level AI: Strategic play with some tactical awareness
   */
  private makeAdvancedMove(): Position | null {
    // First check for capture moves
    const captureMoves = this.findCaptureMoves();
    if (captureMoves.length > 0) {
      const move = captureMoves[0];
      this.game.placeStone(move.row, move.col);
      return move;
    }

    // Then check for defensive moves
    const defensiveMoves = this.findDefensiveMoves();
    if (defensiveMoves.length > 0) {
      const move = defensiveMoves[0];
      this.game.placeStone(move.row, move.col);
      return move;
    }

    // Try to play strategically, considering influence and territory
    const strategicMove = this.findStrategicMove();
    if (strategicMove) {
      this.game.placeStone(strategicMove.row, strategicMove.col);
      return strategicMove;
    }

    // Fallback to random move
    return this.makeRandomMove();
  }

  /**
   * Find moves that can capture opponent's stones
   */
  private findCaptureMoves(): Position[] {
    const board = this.game.getBoard();
    const captureMoves: Position[] = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] !== null) continue;

        // Try placing a stone here
        if (this.game.placeStone(row, col)) {
          // If the move was successful, revert it and remember it
          this.game.pass(); // Pass to get back to AI's turn
          this.game.pass(); // Pass again to let AI play again
          captureMoves.push({ row, col });
        }
      }
    }

    return captureMoves;
  }

  /**
   * Find moves that can defend own stones
   */
  private findDefensiveMoves(): Position[] {
    const board = this.game.getBoard();
    const defensiveMoves: Position[] = [];

    // Look for own stones with only one liberty
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] === this.color) {
          // Check adjacent positions
          const adjacent = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 }
          ];

          adjacent.forEach(pos => {
            if (
              this.isValidPosition(pos.row, pos.col) &&
              board[pos.row][pos.col] === null
            ) {
              // Try placing a stone here
              if (this.game.placeStone(pos.row, pos.col)) {
                // If the move was successful, revert it and remember it
                this.game.pass(); // Pass to get back to AI's turn
                this.game.pass(); // Pass again to let AI play again
                defensiveMoves.push({ row: pos.row, col: pos.col });
              }
            }
          });
        }
      }
    }

    return defensiveMoves;
  }

  /**
   * Find a move based on influence and territory
   */
  private findInfluenceMove(): Position | null {
    // For simplicity, just play near the center or existing stones
    const board = this.game.getBoard();
    const center = Math.floor(this.size / 2);
    const centerArea = [
      { row: center - 1, col: center - 1 },
      { row: center - 1, col: center },
      { row: center - 1, col: center + 1 },
      { row: center, col: center - 1 },
      { row: center, col: center },
      { row: center, col: center + 1 },
      { row: center + 1, col: center - 1 },
      { row: center + 1, col: center },
      { row: center + 1, col: center + 1 }
    ];

    // Try center area first
    for (const pos of centerArea) {
      if (
        this.isValidPosition(pos.row, pos.col) &&
        board[pos.row][pos.col] === null &&
        this.game.placeStone(pos.row, pos.col)
      ) {
        // Revert it and return the position
        this.game.pass();
        this.game.pass();
        return pos;
      }
    }

    // Try playing near existing stones
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] !== null) {
          // Check adjacent positions
          const adjacent = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 }
          ];

          for (const pos of adjacent) {
            if (
              this.isValidPosition(pos.row, pos.col) &&
              board[pos.row][pos.col] === null &&
              this.game.placeStone(pos.row, pos.col)
            ) {
              // Revert it and return the position
              this.game.pass();
              this.game.pass();
              return pos;
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Find a strategic move considering territory
   */
  private findStrategicMove(): Position | null {
    // This is a simplified strategic move finder
    // Advanced AIs would use more sophisticated algorithms like Monte Carlo Tree Search
    
    // Start with some good opening moves if the board is mostly empty
    const board = this.game.getBoard();
    let emptyCount = 0;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] === null) {
          emptyCount++;
        }
      }
    }

    // If board is mostly empty, play near star points
    if (emptyCount > this.size * this.size * 0.8) {
      const starPoints = this.getStarPoints();
      for (const pos of starPoints) {
        if (board[pos.row][pos.col] === null && this.game.placeStone(pos.row, pos.col)) {
          // Revert it and return the position
          this.game.pass();
          this.game.pass();
          return pos;
        }
      }
    }

    // Otherwise look for influential moves
    return this.findInfluenceMove();
  }

  /**
   * Make a random valid move
   */
  private makeRandomMove(): Position | null {
    const board = this.game.getBoard();
    const validMoves: Position[] = [];

    // Find all valid moves
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] === null) {
          // Test if the move is valid
          if (this.game.placeStone(row, col)) {
            // If the move was successful, revert it and add to valid moves
            this.game.pass(); // Pass to get back to AI's turn
            this.game.pass(); // Pass again to let AI play again
            validMoves.push({ row, col });
          }
        }
      }
    }

    // If no valid moves, pass
    if (validMoves.length === 0) {
      this.game.pass();
      return null;
    }

    // Choose a random valid move
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    const move = validMoves[randomIndex];
    this.game.placeStone(move.row, move.col);
    return move;
  }

  /**
   * Check if a position is within the board boundaries
   */
  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Get the star points for the current board size
   */
  private getStarPoints(): Position[] {
    if (this.size === 9) {
      return [
        { row: 2, col: 2 },
        { row: 2, col: 6 },
        { row: 4, col: 4 },
        { row: 6, col: 2 },
        { row: 6, col: 6 }
      ];
    } else if (this.size === 13) {
      return [
        { row: 3, col: 3 },
        { row: 3, col: 9 },
        { row: 6, col: 6 },
        { row: 9, col: 3 },
        { row: 9, col: 9 }
      ];
    } else {
      // Default for 19x19
      return [
        { row: 3, col: 3 },
        { row: 3, col: 9 },
        { row: 3, col: 15 },
        { row: 9, col: 3 },
        { row: 9, col: 9 },
        { row: 9, col: 15 },
        { row: 15, col: 3 },
        { row: 15, col: 9 },
        { row: 15, col: 15 }
      ];
    }
  }
} 