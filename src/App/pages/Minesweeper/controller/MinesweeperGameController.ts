/// <reference path="./MinesweeperGameController.d.ts" />

import { GridGameController } from '@app-shared/controllers/GridGameController'

const neighborsOperations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
]

export class MinesweeperGameController extends GridGameController {
  private gameGrid: Array<Array<MinesweeperGame.CellData>> = []

  private bombs: number
  private flags: number

  public constructor(cellSize: number, bombsAmount: number) {
    super(cellSize)

    this.bombs = bombsAmount
    this.flags = 0
    this.generateRandomInitialGame()
    this.calculateNeighbors()
  }

  private generateRandomInitialGame() {
    // Creates an unidimensional array
    const randomGrid = this.generateRandomGrid()

    // Convert the grid game into a matrix for an easier dev experience
    for (let row = 0; row < this.heightLimit; row += 1) {
      if (!this.gameGrid[row]) {
        this.gameGrid[row] = []
      }

      for (let col = 0; col < this.widthLimit; col += 1) {
        this.gameGrid[row][col] = {
          value: randomGrid[row * this.widthLimit + col],
          state: '',
        }
      }
    }
  }

  private generateRandomGrid(): Array<MinesweeperGame.CellValue> {
    const bombCells: Array<MinesweeperGame.CellValue> = Array(this.bombs).fill('💣')
    const safeCells: Array<MinesweeperGame.CellValue> = Array(
      this.widthLimit * this.heightLimit - this.bombs,
    ).fill('✅')
    const gameCells: Array<MinesweeperGame.CellValue> = safeCells.concat(bombCells)

    return gameCells.sort(() => Math.random() - 0.5)
  }

  private calculateNeighbors() {
    for (let row = 0; row < this.heightLimit; row += 1) {
      for (let col = 0; col < this.widthLimit; col += 1) {
        if (this.gameGrid[row][col].value === '💣') {
          continue
        }

        this.assignNeighborBombs(row, col)
      }
    }
  }

  private assignNeighborBombs(row: number, col: number) {
    let i, j: number
    const bombNeighbors = neighborsOperations.reduce((neighbors, operation) => {
      i = row + operation[0]
      j = col + operation[1]

      if (i < 0 || j < 0) {
        return neighbors
      }

      if (i >= this.heightLimit || j >= this.widthLimit) {
        return neighbors
      }

      if (this.gameGrid[i][j].value === '💣') {
        return neighbors + 1
      }

      return neighbors
    }, 0)

    if (bombNeighbors > 0) {
      this.gameGrid[row][col].value = bombNeighbors
    }
  }

  public getGameGrid(): Array<Array<MinesweeperGame.CellData>> {
    return this.gameGrid
  }

  public getNextGameState(
    action: MinesweeperGame.Action,
    row: number,
    col: number,
  ): MinesweeperGame.State {
    const cell = this.gameGrid[row][col]

    if (cell == null) {
      return { game: this.gameGrid, gameStatus: 'ongoing' }
    }

    let gameStatus: MinesweeperGame.GameStatus = 'ongoing'
    if (action === 'click') {
      gameStatus = this.onCellClicked(cell, row, col)
    } else if (action === 'flag') {
      gameStatus = this.onCellFlagged(cell)
    }

    return { game: this.gameGrid, gameStatus }
  }

  private onCellClicked(
    cell: MinesweeperGame.CellData,
    row: number,
    col: number,
  ): MinesweeperGame.GameStatus {
    if (cell.state === 'clicked') {
      return 'ongoing'
    }

    // Game Over
    if (cell.value === '💣') {
      this.displayAllCells()
      return 'lose'
    }

    if (cell.value === '✅') {
      this.displayNeighborCells(row, col)
    } else {
      cell.state = 'clicked'
    }

    return 'ongoing'
  }

  private displayAllCells() {
    this.gameGrid.forEach((row) => {
      row.forEach((cell) => {
        cell.state = 'clicked'
      })
    })
  }

  private displayNeighborCells(row: number, col: number) {
    if (row < 0 || row >= this.heightLimit || col < 0 || col >= this.widthLimit) {
      return
    }

    const cell = this.gameGrid[row][col]

    if (cell == null || cell.value === '💣' || cell.state === 'clicked') {
      return
    }

    cell.state = 'clicked'

    if (cell.value !== '✅') {
      return
    }

    neighborsOperations.forEach((operation) => {
      this.displayNeighborCells(row + operation[0], col + operation[1])
    })
  }

  private onCellFlagged(cell: MinesweeperGame.CellData): MinesweeperGame.GameStatus {
    if (cell.state === 'flagged') {
      cell.state = ''
      this.flags -= 1
      return 'ongoing'
    }

    cell.state = 'flagged'
    this.flags += 1

    if (this.flags === this.bombs) {
      return this.checkForWin()
    }

    return 'ongoing'
  }

  private checkForWin(): MinesweeperGame.GameStatus {
    let cell: MinesweeperGame.CellData
    let matches = 0

    for (let row = 0; row < this.heightLimit; row += 1) {
      for (let col = 0; col < this.widthLimit; col += 1) {
        cell = this.gameGrid[row][col]

        if (cell.state !== 'flagged') {
          continue
        }

        if (cell.value === '💣') {
          matches += 1
        } else {
          return 'ongoing'
        }
      }
    }

    return matches === this.bombs ? 'win' : 'ongoing'
  }
}
