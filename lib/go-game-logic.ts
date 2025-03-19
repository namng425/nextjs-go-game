type StoneColor = "black" | "white" | null;
type BoardState = StoneColor[][];
type Position = { row: number; col: number };
type CapturedStones = { black: number; white: number };

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
  constructor(size: 9 | 13 | 19 = 19) {
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
   * Place a stone on the board
   * @param row Row index
   * @param col Column index
   * @returns Boolean indicating if the move was successful
   */
  public placeStone(row: number, col: number): boolean {
    // Reset pass counter
    this.passes = 0;

    // Check if the move is valid
    if (!this.isValidMove(row, col)) {
      return false;
    }

    // Store the previous board state for ko rule checking
    this.previousBoardState = this.boardState.map(row => [...row]);

    // Place the stone
    this.boardState[row][col] = this.currentPlayer;
    this.lastMove = { row, col };

    // Capture opponent's stones
    this.captureStones(row, col);

    // Check for suicide move (capture own stones if needed)
    if (this.isSuicideMove(row, col)) {
      // Revert to previous state
      if (this.previousBoardState) {
        this.boardState = this.previousBoardState.map(row => [...row]);
      }
      return false;
    }

    // Check for ko rule violation
    if (this.isKoRuleViolation()) {
      // Revert to previous state
      if (this.previousBoardState) {
        this.boardState = this.previousBoardState.map(row => [...row]);
      }
      return false;
    }

    // Switch player
    this.currentPlayer = this.currentPlayer === "black" ? "white" : "black";
    return true;
  }

  /**
   * Pass the current player's turn
   */
  public pass(): void {
    this.passes++;
    this.currentPlayer = this.currentPlayer === "black" ? "white" : "black";
  }

  /**
   * Check if the game is over (two consecutive passes)
   */
  public isGameOver(): boolean {
    return this.passes >= 2;
  }

  /**
   * Check if a move is valid
   * @param row Row index
   * @param col Column index
   * @returns Boolean indicating if the move is valid
   */
  private isValidMove(row: number, col: number): boolean {
    // Check if the position is within the board boundaries
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return false;
    }

    // Check if the position is empty
    if (this.boardState[row][col] !== null) {
      return false;
    }

    return true;
  }

  /**
   * Capture opponent's stones if they have no liberties
   * @param row Row of the last placed stone
   * @param col Column of the last placed stone
   */
  private captureStones(row: number, col: number): void {
    const opponent = this.currentPlayer === "black" ? "white" : "black";
    
    // Check all adjacent positions
    const adjacentPositions = this.getAdjacentPositions(row, col);
    
    for (const pos of adjacentPositions) {
      // If the adjacent position has an opponent's stone
      if (
        pos.row >= 0 && pos.row < this.size &&
        pos.col >= 0 && pos.col < this.size &&
        this.boardState[pos.row][pos.col] === opponent
      ) {
        // Check if the group has liberties
        const group = this.findGroup(pos.row, pos.col);
        if (!this.hasLiberties(group)) {
          // Capture the group
          this.captureGroup(group, opponent);
        }
      }
    }
  }

  /**
   * Check if placing a stone would result in a suicide move
   * @param row Row index
   * @param col Column index
   * @returns Boolean indicating if it's a suicide move
   */
  private isSuicideMove(row: number, col: number): boolean {
    const group = this.findGroup(row, col);
    return !this.hasLiberties(group);
  }

  /**
   * Check if a move violates the ko rule
   * @returns Boolean indicating if the move violates the ko rule
   */
  private isKoRuleViolation(): boolean {
    // Ko rule: A player cannot make a move that would recreate the previous board position
    if (!this.previousBoardState) return false;

    // Compare current board with previous board
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
   * Find all stones in a group (connected stones of the same color)
   * @param row Starting row
   * @param col Starting column
   * @returns Array of positions in the group
   */
  private findGroup(row: number, col: number): Position[] {
    const color = this.boardState[row][col];
    if (color === null) return [];

    const group: Position[] = [];
    const visited = Array(this.size).fill(false).map(() => Array(this.size).fill(false));
    
    const searchGroup = (r: number, c: number) => {
      if (
        r < 0 || r >= this.size || c < 0 || c >= this.size ||
        visited[r][c] || this.boardState[r][c] !== color
      ) {
        return;
      }

      visited[r][c] = true;
      group.push({ row: r, col: c });

      // Check adjacent positions
      searchGroup(r - 1, c); // up
      searchGroup(r + 1, c); // down
      searchGroup(r, c - 1); // left
      searchGroup(r, c + 1); // right
    };

    searchGroup(row, col);
    return group;
  }

  /**
   * Check if a group of stones has any liberties (empty adjacent intersections)
   * @param group Array of positions in the group
   * @returns Boolean indicating if the group has liberties
   */
  private hasLiberties(group: Position[]): boolean {
    for (const pos of group) {
      const adjacentPositions = this.getAdjacentPositions(pos.row, pos.col);
      
      for (const adjPos of adjacentPositions) {
        if (
          adjPos.row >= 0 && adjPos.row < this.size &&
          adjPos.col >= 0 && adjPos.col < this.size &&
          this.boardState[adjPos.row][adjPos.col] === null
        ) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Get all adjacent positions
   * @param row Row index
   * @param col Column index
   * @returns Array of adjacent positions
   */
  private getAdjacentPositions(row: number, col: number): Position[] {
    return [
      { row: row - 1, col }, // up
      { row: row + 1, col }, // down
      { row, col: col - 1 }, // left
      { row, col: col + 1 }, // right
    ];
  }

  /**
   * Capture a group of stones
   * @param group Array of positions in the group
   * @param color Color of the stones being captured
   */
  private captureGroup(group: Position[], color: "black" | "white"): void {
    // Remove the stones from the board
    for (const pos of group) {
      this.boardState[pos.row][pos.col] = null;
    }

    // Update captured stones count
    if (color === "black") {
      this.capturedStones.black += group.length;
    } else {
      this.capturedStones.white += group.length;
    }
  }

  /**
   * Calculate the current score
   * @returns Object with scores for both players
   */
  public calculateScore(): { black: number; white: number } {
    const territoryMap = this.calculateTerritory();
    const blackTerritory = territoryMap.filter(point => point.owner === "black").length;
    const whiteTerritory = territoryMap.filter(point => point.owner === "white").length;

    return {
      black: blackTerritory + this.capturedStones.white,
      white: whiteTerritory + this.capturedStones.black + 6.5, // 6.5 komi (compensation for black's first-move advantage)
    };
  }

  /**
   * Calculate territory ownership
   * @returns Array of territory points with their owners
   */
  private calculateTerritory(): { position: Position; owner: "black" | "white" | null }[] {
    const territory: { position: Position; owner: "black" | "white" | null }[] = [];
    const visited = Array(this.size).fill(false).map(() => Array(this.size).fill(false));

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.boardState[row][col] === null && !visited[row][col]) {
          // Empty intersection - check if it's territory
          const emptyGroup: Position[] = [];
          const adjacentColors = new Set<StoneColor>();
          
          this.findEmptyGroup(row, col, emptyGroup, adjacentColors, visited);
          
          // If only one color surrounds the empty group, it's that player's territory
          let owner: "black" | "white" | null = null;
          if (adjacentColors.size === 1) {
            owner = adjacentColors.has("black") ? "black" : 
                    adjacentColors.has("white") ? "white" : null;
          }

          // Add each point in the group to the territory
          for (const pos of emptyGroup) {
            territory.push({ position: pos, owner });
          }
        }
      }
    }

    return territory;
  }

  /**
   * Find all connected empty intersections and track adjacent stone colors
   * @param row Starting row
   * @param col Starting column
   * @param emptyGroup Array to populate with empty positions
   * @param adjacentColors Set to populate with adjacent stone colors
   * @param visited Matrix to track visited positions
   */
  private findEmptyGroup(
    row: number,
    col: number,
    emptyGroup: Position[],
    adjacentColors: Set<StoneColor>,
    visited: boolean[][]
  ): void {
    if (
      row < 0 || row >= this.size || col < 0 || col >= this.size ||
      visited[row][col]
    ) {
      return;
    }

    if (this.boardState[row][col] === null) {
      // Empty intersection
      visited[row][col] = true;
      emptyGroup.push({ row, col });

      // Check adjacent positions
      this.findEmptyGroup(row - 1, col, emptyGroup, adjacentColors, visited);
      this.findEmptyGroup(row + 1, col, emptyGroup, adjacentColors, visited);
      this.findEmptyGroup(row, col - 1, emptyGroup, adjacentColors, visited);
      this.findEmptyGroup(row, col + 1, emptyGroup, adjacentColors, visited);
    } else {
      // Stone found - add its color to the set of adjacent colors
      adjacentColors.add(this.boardState[row][col]);
    }
  }
} 