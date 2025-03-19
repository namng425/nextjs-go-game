import { GoGame } from './go-game-logic';
import { StoneColor, Position, BoardState } from '@/types/go-game-types';

/**
 * Computer AI for the Go game
 */
export class ComputerAI {
  private game: GoGame;
  private difficulty: 'beginner' | 'medium' | 'advanced';
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
    difficulty: 'beginner' | 'medium' | 'advanced' = 'medium',
    color: 'black' | 'white' = 'white'
  ) {
    this.game = game;
    this.difficulty = difficulty;
    this.color = color;
    this.size = game.getBoard().length;
  }

  /**
   * Make the AI's move
   * @returns Position of the move or 'pass'
   */
  public makeMove(): Position | 'pass' {
    // Check if it's the AI's turn
    if (this.game.getCurrentPlayer() !== this.color) {
      throw new Error("Not the AI's turn");
    }

    // Get the current board state
    const boardState = this.game.getBoard();
    
    // Based on difficulty, choose a strategy
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

  /**
   * Make a beginner level move (mostly random with some basic logic)
   * @param boardState Current board state
   * @returns Position of the move or 'pass'
   */
  private makeBeginnerMove(boardState: BoardState): Position | 'pass' {
    // 5% chance to pass (simulates not understanding the game well)
    if (Math.random() < 0.05) {
      return 'pass';
    }

    // Try to find a valid move
    const legalMoves = this.findLegalMoves(boardState);
    
    if (legalMoves.length === 0) {
      return 'pass';
    }

    // Choose a random legal move
    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    const move = legalMoves[randomIndex];
    
    // Try to make the move
    const success = this.game.placeStone(move.row, move.col);
    
    // If not successful, try another random move or pass
    if (!success) {
      // Remove this move from legal moves
      legalMoves.splice(randomIndex, 1);
      
      if (legalMoves.length === 0) {
        return 'pass';
      }
      
      // Try another random move
      const newRandomIndex = Math.floor(Math.random() * legalMoves.length);
      const newMove = legalMoves[newRandomIndex];
      
      const newSuccess = this.game.placeStone(newMove.row, newMove.col);
      
      if (!newSuccess) {
        return 'pass';
      }
      
      return newMove;
    }
    
    return move;
  }

  /**
   * Make a medium level move (some strategy)
   * @param boardState Current board state
   * @returns Position of the move or 'pass'
   */
  private makeMediumMove(boardState: BoardState): Position | 'pass' {
    // 2% chance to pass (less likely to make a mistake)
    if (Math.random() < 0.02) {
      return 'pass';
    }

    // Get legal moves
    const legalMoves = this.findLegalMoves(boardState);
    
    if (legalMoves.length === 0) {
      return 'pass';
    }

    // Try to capture opponent's stones if possible
    const captureMove = this.findCaptureMove(boardState);
    if (captureMove) {
      const success = this.game.placeStone(captureMove.row, captureMove.col);
      if (success) {
        return captureMove;
      }
    }

    // Try to defend own stones if they're in danger
    const defendMove = this.findDefendMove(boardState);
    if (defendMove) {
      const success = this.game.placeStone(defendMove.row, defendMove.col);
      if (success) {
        return defendMove;
      }
    }

    // If no strategic moves, choose a random move
    // with preference for moves not on the edge
    const centerMoves = legalMoves.filter(
      move => move.row > 1 && move.row < this.size - 2 && 
              move.col > 1 && move.col < this.size - 2
    );
    
    const movesToTry = centerMoves.length > 0 ? centerMoves : legalMoves;
    
    // Try up to 3 random moves
    for (let i = 0; i < 3; i++) {
      if (movesToTry.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * movesToTry.length);
      const move = movesToTry[randomIndex];
      
      const success = this.game.placeStone(move.row, move.col);
      
      if (success) {
        return move;
      }
      
      // Remove this move and try again
      movesToTry.splice(randomIndex, 1);
    }
    
    return 'pass';
  }

  /**
   * Make an advanced level move (more sophisticated strategy)
   * @param boardState Current board state
   * @returns Position of the move or 'pass'
   */
  private makeAdvancedMove(boardState: BoardState): Position | 'pass' {
    // Similar to medium move, but with more sophisticated strategy
    // In a real implementation, this would include territory evaluation,
    // reading ahead multiple moves, etc.
    
    // For this simplified version, we'll use the medium-level logic
    // but with a better understanding of opening moves and territory
    
    // First 10 moves, prefer corners and star points
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
        
        if (success) {
          return move;
        }
      }
    }
    
    // Fall back to medium-level logic
    return this.makeMediumMove(boardState);
  }

  /**
   * Find all legal moves on the board
   * @param boardState Current board state
   * @returns Array of legal move positions
   */
  private findLegalMoves(boardState: BoardState): Position[] {
    const legalMoves: Position[] = [];
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // Empty intersection
        if (boardState[row][col] === null) {
          legalMoves.push({ row, col });
        }
      }
    }
    
    return legalMoves;
  }

  /**
   * Find a move that would capture opponent's stones
   * @param boardState Current board state
   * @returns Position of the move or null if none found
   */
  private findCaptureMove(boardState: BoardState): Position | null {
    const opponentColor = this.color === 'black' ? 'white' : 'black';
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // Skip non-empty intersections
        if (boardState[row][col] !== null) {
          continue;
        }
        
        // Check if placing a stone here would capture opponent's stones
        // This is a simplified check - in a real implementation, we would
        // need to actually check the liberties of opponent groups
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
            // Check if this opponent stone has only one liberty
            // (the position we're considering)
            const hasOnlyOneLiberty = this.hasOnlyOneLiberty(boardState, pos.row, pos.col);
            
            if (hasOnlyOneLiberty) {
              return { row, col };
            }
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Find a move that would defend own stones
   * @param boardState Current board state
   * @returns Position of the move or null if none found
   */
  private findDefendMove(boardState: BoardState): Position | null {
    // Look for own stones with only one liberty
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (boardState[row][col] === this.color) {
          const libertyPositions = this.findLibertyPositions(boardState, row, col);
          
          if (libertyPositions.length === 1) {
            return libertyPositions[0];
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Check if a stone has only one liberty
   * @param boardState Current board state
   * @param row Row of the stone
   * @param col Column of the stone
   * @returns Boolean indicating if the stone has only one liberty
   */
  private hasOnlyOneLiberty(boardState: BoardState, row: number, col: number): boolean {
    return this.findLibertyPositions(boardState, row, col).length === 1;
  }

  /**
   * Find all liberty positions for a stone
   * @param boardState Current board state
   * @param row Row of the stone
   * @param col Column of the stone
   * @returns Array of liberty positions
   */
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

  /**
   * Count total stones on the board
   * @param boardState Current board state
   * @returns Total number of stones
   */
  private countStones(boardState: BoardState): number {
    let count = 0;
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (boardState[row][col] !== null) {
          count++;
        }
      }
    }
    
    return count;
  }

  /**
   * Get star points (hoshi) for the current board size
   * @returns Array of star point positions
   */
  private getStarPoints(): Position[] {
    switch (this.size) {
      case 9:
        return [
          { row: 2, col: 2 },
          { row: 2, col: 6 },
          { row: 4, col: 4 },
          { row: 6, col: 2 },
          { row: 6, col: 6 },
        ];
      case 13:
        return [
          { row: 3, col: 3 },
          { row: 3, col: 9 },
          { row: 6, col: 6 },
          { row: 9, col: 3 },
          { row: 9, col: 9 },
        ];
      case 19:
        return [
          { row: 3, col: 3 },
          { row: 3, col: 9 },
          { row: 3, col: 15 },
          { row: 9, col: 3 },
          { row: 9, col: 9 },
          { row: 9, col: 15 },
          { row: 15, col: 3 },
          { row: 15, col: 9 },
          { row: 15, col: 15 },
        ];
      default:
        return [];
    }
  }
} 