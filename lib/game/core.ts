import { StoneColor, BoardState, Position, CapturedStones, BoardSize } from '@/types/go-game-types';

/**
 * Go Game Logic
 * 
 * This class handles the core game rules for Go:
 * - Placing stones
 * - Capturing opponent's stones
 * - Implementing ko rule
 * - Checking for valid moves
 * - Calculating territory
 */
export class GoGame {
  private boardState: BoardState;
  private size: number;
  private currentPlayer: "black" | "white";
  private capturedStones: CapturedStones;
  private previousBoardState: BoardState | null;
  private lastMove: Position | null;
  private passes: number;

  /**
   * Initialize a new Go game
   * @param size Board size (9, 13, or 19)
   */
  constructor(size: BoardSize = 19) {
    this.size = size;
    this.boardState = Array(size).fill(null).map(() => Array(size).fill(null));
    this.currentPlayer = "black"; // Black always starts
    this.capturedStones = { black: 0, white: 0 };
    this.previousBoardState = null;
    this.lastMove = null;
    this.passes = 0;
  }

  /**
   * Get the current board state
   */
  public getBoard(): BoardState {
    return this.boardState.map(row => [...row]);
  }

  /**
   * Get the current player
   */
  public getCurrentPlayer(): "black" | "white" {
    return this.currentPlayer;
  }

  /**
   * Get captured stones count
   */
  public getCapturedStones(): CapturedStones {
    return { ...this.capturedStones };
  }

  /**
   * Check if game is over
   */
  public isGameOver(): boolean {
    // Game ends after two consecutive passes
    return this.passes >= 2;
  }

  /**
   * Get the winner of the game
   * @returns "black" | "white" | "draw" | null (if game is not over)
   */
  public getWinner(): "black" | "white" | "draw" | null {
    if (!this.isGameOver()) {
      return null;
    }
    
    const scores = this.calculateScore();
    if (scores.black > scores.white) {
      return "black";
    } else if (scores.white > scores.black) {
      return "white";
    } else {
      return "draw";
    }
  }

  /**
   * Place a stone on the board
   */
  public placeStone(row: number, col: number): boolean {
    // Check if the game is over
    if (this.isGameOver()) {
      return false;
    }

    // Check if the position is valid
    if (!this.isValidPosition(row, col)) {
      return false;
    }

    // Check if the position is already occupied
    if (this.boardState[row][col] !== null) {
      return false;
    }

    // Store the current board state to check for ko rule
    this.previousBoardState = this.boardState.map(row => [...row]);

    // Place the stone
    this.boardState[row][col] = this.currentPlayer;
    this.lastMove = { row, col };

    // Capture opponent's stones
    const capturedPositions = this.captureStones(this.getOpponent());

    // Check if the move is valid (not a suicide move unless it captures stones)
    const group = this.findGroup(row, col);
    const liberties = this.countLiberties(group);
    if (liberties === 0 && capturedPositions.length === 0) {
      // Suicide move - revert the board state
      this.boardState = this.previousBoardState.map(row => [...row]);
      this.lastMove = null;
      return false;
    }

    // Check for ko rule
    if (this.isKoViolation()) {
      // Ko rule violation - revert the board state
      this.boardState = this.previousBoardState.map(row => [...row]);
      this.lastMove = null;
      return false;
    }

    // Reset passes counter
    this.passes = 0;

    // Switch to the other player
    this.currentPlayer = this.getOpponent();

    return true;
  }

  /**
   * Pass the turn
   */
  public pass(): void {
    this.passes++;
    this.currentPlayer = this.getOpponent();
    this.lastMove = null;
  }

  /**
   * Calculate the score
   */
  public calculateScore() {
    const territory = this.calculateTerritory();
    return {
      black: territory.black + this.capturedStones.black,
      white: territory.white + this.capturedStones.white
    };
  }

  /**
   * Check if a position is within the board boundaries
   */
  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Get the opponent of the current player
   */
  private getOpponent(): "black" | "white" {
    return this.currentPlayer === "black" ? "white" : "black";
  }

  /**
   * Find all stones in a group
   */
  private findGroup(row: number, col: number): Position[] {
    const color = this.boardState[row][col];
    if (color === null) {
      return [];
    }

    const visited: boolean[][] = Array(this.size)
      .fill(false)
      .map(() => Array(this.size).fill(false));
    const group: Position[] = [];

    const dfs = (r: number, c: number) => {
      if (
        !this.isValidPosition(r, c) ||
        visited[r][c] ||
        this.boardState[r][c] !== color
      ) {
        return;
      }

      visited[r][c] = true;
      group.push({ row: r, col: c });

      // Check all four adjacent positions
      dfs(r - 1, c);
      dfs(r + 1, c);
      dfs(r, c - 1);
      dfs(r, c + 1);
    };

    dfs(row, col);
    return group;
  }

  /**
   * Count the liberties of a group
   */
  private countLiberties(group: Position[]): number {
    const liberties: Set<string> = new Set();

    group.forEach(({ row, col }) => {
      const adjacentPositions = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 }
      ];

      adjacentPositions.forEach(pos => {
        if (
          this.isValidPosition(pos.row, pos.col) &&
          this.boardState[pos.row][pos.col] === null
        ) {
          liberties.add(`${pos.row},${pos.col}`);
        }
      });
    });

    return liberties.size;
  }

  /**
   * Capture opponent's stones
   */
  private captureStones(opponent: "black" | "white"): Position[] {
    const capturedPositions: Position[] = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.boardState[row][col] === opponent) {
          const group = this.findGroup(row, col);
          const liberties = this.countLiberties(group);

          if (liberties === 0) {
            // Capture the group
            group.forEach(pos => {
              this.boardState[pos.row][pos.col] = null;
              capturedPositions.push(pos);
            });
          }
        }
      }
    }

    // Update captured stones count
    if (opponent === "black") {
      this.capturedStones.black += capturedPositions.length;
    } else {
      this.capturedStones.white += capturedPositions.length;
    }

    return capturedPositions;
  }

  /**
   * Check for ko rule violation
   */
  private isKoViolation(): boolean {
    if (!this.previousBoardState || !this.lastMove) {
      return false;
    }

    const { row, col } = this.lastMove;
    const group = this.findGroup(row, col);

    // Ko rule applies when:
    // 1. Only one stone is placed
    // 2. Only one stone is captured
    // 3. The board returns to the previous state
    if (group.length !== 1) {
      return false;
    }

    // Check if the board state is the same as the previous state
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.boardState[r][c] !== this.previousBoardState[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Calculate territory controlled by each player
   */
  private calculateTerritory() {
    // Mark all empty points as either black territory, white territory, or neutral
    const territory: { black: number; white: number } = { black: 0, white: 0 };
    const visited: (StoneColor | "neutral")[][] = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(null));

    // Helper function to determine if a territory belongs to a player
    const determineTerritory = (row: number, col: number) => {
      if (this.boardState[row][col] !== null) {
        return;
      }

      const emptyPoints: Position[] = [];
      const borders: Set<StoneColor> = new Set();
      const seen: boolean[][] = Array(this.size)
        .fill(false)
        .map(() => Array(this.size).fill(false));

      const dfs = (r: number, c: number) => {
        if (!this.isValidPosition(r, c)) {
          return;
        }

        if (seen[r][c]) {
          return;
        }

        seen[r][c] = true;

        if (this.boardState[r][c] !== null) {
          borders.add(this.boardState[r][c]);
          return;
        }

        emptyPoints.push({ row: r, col: c });

        // Check all four adjacent positions
        dfs(r - 1, c);
        dfs(r + 1, c);
        dfs(r, c - 1);
        dfs(r, c + 1);
      };

      dfs(row, col);

      // Determine who controls this territory
      let owner: StoneColor | "neutral" = "neutral";
      if (borders.size === 1) {
        owner = borders.has("black") ? "black" : "white";
        territory[owner] += emptyPoints.length;
      }

      // Mark all empty points in this territory
      emptyPoints.forEach(pos => {
        visited[pos.row][pos.col] = owner;
      });
    };

    // Check all empty points
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.boardState[row][col] === null && visited[row][col] === null) {
          determineTerritory(row, col);
        }
      }
    }

    return territory;
  }
} 