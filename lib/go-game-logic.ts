import { StoneColor, Position, BoardState, CapturedStones } from '@/types/go-game-types';

export class GoGame {
  private boardState: BoardState;
  private size: number;
  private currentPlayer: 'black' | 'white';
  private capturedStones: CapturedStones;
  private previousBoardState: BoardState | null;
  private lastMove: Position | null;
  private passes: number;

  constructor(size: 9 | 13 | 19 = 19) {
    this.size = size;
    this.boardState = Array(size).fill(null).map(() => Array(size).fill(null));
    this.currentPlayer = 'black';
    this.capturedStones = { black: 0, white: 0 };
    this.previousBoardState = null;
    this.lastMove = null;
    this.passes = 0;
  }

  public getBoard(): BoardState {
    return this.boardState.map(row => [...row]);
  }

  public getCurrentPlayer(): 'black' | 'white' {
    return this.currentPlayer;
  }

  public getCapturedStones(): CapturedStones {
    return { ...this.capturedStones };
  }

  public isGameOver(): boolean {
    return this.passes >= 2;
  }

  public placeStone(row: number, col: number): boolean {
    this.passes = 0;
    if (!this.isValidMove(row, col)) return false;

    this.previousBoardState = this.boardState.map(row => [...row]);
    this.boardState[row][col] = this.currentPlayer;
    this.lastMove = { row, col };

    this.captureStones(row, col);

    if (this.isSuicideMove(row, col)) {
      if (this.previousBoardState) {
        this.boardState = this.previousBoardState.map(row => [...row]);
      }
      return false;
    }

    if (this.isKoRuleViolation()) {
      if (this.previousBoardState) {
        this.boardState = this.previousBoardState.map(row => [...row]);
      }
      return false;
    }

    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    return true;
  }

  public pass(): void {
    this.passes++;
    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
  }

  private isValidMove(row: number, col: number): boolean {
    return (
      row >= 0 && row < this.size &&
      col >= 0 && col < this.size &&
      this.boardState[row][col] === null
    );
  }

  private captureStones(row: number, col: number): void {
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    const adjacentPositions = this.getAdjacentPositions(row, col);

    for (const pos of adjacentPositions) {
      if (
        pos.row >= 0 && pos.row < this.size &&
        pos.col >= 0 && pos.col < this.size &&
        this.boardState[pos.row][pos.col] === opponent
      ) {
        const group = this.findGroup(pos.row, pos.col);
        if (!this.hasLiberties(group)) {
          this.captureGroup(group, opponent);
        }
      }
    }
  }

  private getAdjacentPositions(row: number, col: number): Position[] {
    return [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];
  }

  private findGroup(row: number, col: number): Position[] {
    const color = this.boardState[row][col];
    if (color === null) return [];

    const group: Position[] = [];
    const visited = Array(this.size).fill(false).map(() => Array(this.size).fill(false));

    const stack: Position[] = [{ row, col }];
    while (stack.length > 0) {
      const pos = stack.pop()!;
      if (visited[pos.row][pos.col]) continue;

      visited[pos.row][pos.col] = true;
      group.push(pos);

      const adjacentPositions = this.getAdjacentPositions(pos.row, pos.col);
      for (const adjPos of adjacentPositions) {
        if (
          adjPos.row >= 0 && adjPos.row < this.size &&
          adjPos.col >= 0 && adjPos.col < this.size &&
          !visited[adjPos.row][adjPos.col] &&
          this.boardState[adjPos.row][adjPos.col] === color
        ) {
          stack.push(adjPos);
        }
      }
    }

    return group;
  }

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

  private captureGroup(group: Position[], color: 'black' | 'white'): void {
    for (const pos of group) {
      this.boardState[pos.row][pos.col] = null;
    }
    if (color === 'black') {
      this.capturedStones.white += group.length;
    } else {
      this.capturedStones.black += group.length;
    }
  }

  private isSuicideMove(row: number, col: number): boolean {
    const group = this.findGroup(row, col);
    return !this.hasLiberties(group);
  }

  private isKoRuleViolation(): boolean {
    if (!this.previousBoardState) return false;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.boardState[row][col] !== this.previousBoardState[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  public calculateScore(): { black: number; white: number } {
    const territoryMap = this.calculateTerritory();
    const blackTerritory = territoryMap.filter(point => point.owner === 'black').length;
    const whiteTerritory = territoryMap.filter(point => point.owner === 'white').length;

    return {
      black: blackTerritory + this.capturedStones.white,
      white: whiteTerritory + this.capturedStones.black + 6.5,
    };
  }

  private calculateTerritory(): { position: Position; owner: 'black' | 'white' | null }[] {
    const territory: { position: Position; owner: 'black' | 'white' | null }[] = [];
    const visited = Array(this.size).fill(false).map(() => Array(this.size).fill(false));

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.boardState[row][col] === null && !visited[row][col]) {
          const emptyGroup: Position[] = [];
          const adjacentColors = new Set<StoneColor>();

          this.findEmptyGroup(row, col, emptyGroup, adjacentColors, visited);

          let owner: 'black' | 'white' | null = null;
          if (adjacentColors.size === 1) {
            owner = adjacentColors.has('black') ? 'black' :
                    adjacentColors.has('white') ? 'white' : null;
          }

          for (const pos of emptyGroup) {
            territory.push({ position: pos, owner });
          }
        }
      }
    }

    return territory;
  }

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
      visited[row][col] = true;
      emptyGroup.push({ row, col });

      this.findEmptyGroup(row - 1, col, emptyGroup, adjacentColors, visited);
      this.findEmptyGroup(row + 1, col, emptyGroup, adjacentColors, visited);
      this.findEmptyGroup(row, col - 1, emptyGroup, adjacentColors, visited);
      this.findEmptyGroup(row, col + 1, emptyGroup, adjacentColors, visited);
    } else {
      adjacentColors.add(this.boardState[row][col]);
    }
  }
}