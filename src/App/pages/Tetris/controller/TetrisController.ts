/// <reference path="./TetrisController.d.ts" />

import { GridGameController } from '@app-shared/controllers/GridGameController'
import { isServer } from '@app-shared/utils/isServer'

const rowPoints = [40, 100, 300, 1200]
const initialGameSpeed = 1000

const mobileDifficultyLevels: {
  [key in TetrisGameProps['difficulty']]: { cellSize: number }
} = {
  easy: {
    cellSize: 60,
  },
  normal: {
    cellSize: 40,
  },
  hard: {
    cellSize: 30,
  },
  'extremely-hard': {
    cellSize: 20,
  },
}

const tetrominoes: { [key in TetrisGame.TetrominoesShapes]: TetrisGame.TetrominoesShapes[][] } = {
  0: [[0]],
  I: [
    [0, 'I', 0, 0],
    [0, 'I', 0, 0],
    [0, 'I', 0, 0],
    [0, 'I', 0, 0],
  ],
  J: [
    [0, 'J', 0],
    [0, 'J', 0],
    ['J', 'J', 0],
  ],
  L: [
    [0, 'L', 0],
    [0, 'L', 0],
    [0, 'L', 'L'],
  ],
  O: [
    ['O', 'O'],
    ['O', 'O'],
  ],
  S: [
    [0, 'S', 'S'],
    ['S', 'S', 0],
    [0, 0, 0],
  ],
  T: [
    [0, 0, 0],
    ['T', 'T', 'T'],
    [0, 'T', 0],
  ],
  Z: [
    ['Z', 'Z', 0],
    [0, 'Z', 'Z'],
    [0, 0, 0],
  ],
}

export class TetrisController extends GridGameController implements ArrowMovement {
  private game: TetrisGame.Game = []
  private gameStatus: GameStatus = 'ongoing'
  private player: TetrisGame.Player | undefined
  private gameSpeed: number = initialGameSpeed
  private score: number = 0
  private level: number = 1
  private rowsCleared: number = 0
  private playerRequestsMoreSpeed: boolean = false
  private cellSize: number

  public constructor(difficulty: TetrisGameProps['difficulty']) {
    const difficultyLevel = mobileDifficultyLevels[difficulty]
    const cellSize =
      isServer() || window.innerWidth < 920
        ? difficultyLevel.cellSize
        : difficultyLevel.cellSize * 2

    super(cellSize)

    this.cellSize = cellSize

    this.game = Array.from(Array(this.heightLimit), () => Array(this.widthLimit).fill([0, 'blank']))
    this.initializePlayer()
    this.gameSpeed = initialGameSpeed
    this.gameStatus = 'ongoing'
    this.score = 0
    this.level = 1
    this.rowsCleared = 0
    this.playerRequestsMoreSpeed = false
  }

  private initializePlayer() {
    this.player = {
      pos: { x: Math.floor(this.widthLimit / 2), y: 0 },
      tetrominoe: this.generateRandomTetrominoe(),
      collided: false,
    }
  }

  private generateRandomTetrominoe(): TetrisGame.TetrominoesShapes[][] {
    const tetrominoesShapes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as TetrisGame.TetrominoesShapes[]

    const randomIndex = tetrominoesShapes[Math.floor(Math.random() * tetrominoesShapes.length)]

    return tetrominoes[randomIndex]
  }

  public requestArrowMovement = (pressedControl: ArrowControls): void => {
    if (pressedControl === 'Left') {
      this.movePlayerHorizontally('left')
    } else if (pressedControl === 'Right') {
      this.movePlayerHorizontally('right')
    } else if (pressedControl === 'Up') {
      this.rotatePlayer()
    } else if (pressedControl === 'Down') {
      this.playerRequestsMoreSpeed = true
    }
  }

  public stopMoreSpeed = () => {
    this.playerRequestsMoreSpeed = false
  }

  private movePlayerHorizontally(dir: 'left' | 'right') {
    const xOffset = dir === 'left' ? -1 : 1
    if (!this.isColliding(xOffset, 0)) {
      this.player!.pos.x += xOffset
    }
  }

  public getGameState(): TetrisGame.State {
    return {
      game: this.game,
      gameStatus: this.gameStatus,
      player: this.player!,
      cellSize: this.cellSize,
      gameWidth: this.widthLimit,
      gameHeight: this.heightLimit,
      gameSpeed: this.playerRequestsMoreSpeed ? 100 : this.gameSpeed,
      score: this.score,
      level: this.level,
    }
  }

  public getNextGameState(): TetrisGame.State {
    this.updateGame()

    this.increaseLevelAndScoreIfNeeded()

    this.dropPlayer()

    const nextGameState = this.getGameState()

    return nextGameState
  }

  private increaseLevelAndScoreIfNeeded() {
    if (this.rowsCleared > 0) {
      this.score +=
        rowPoints[this.rowsCleared >= rowPoints.length ? rowPoints.length - 1 : this.rowsCleared] *
        this.level
      this.level += 1
      this.gameSpeed -= this.level * 10
    }
  }

  private dropPlayer() {
    if (this.isColliding(0, 1)) {
      this.player!.collided = true
      if (this.player!.pos.y < 1) {
        this.gameStatus = 'lose'
      }
    } else {
      this.player!.pos.y += 1
    }
  }

  private updateGame() {
    this.rowsCleared = 0

    // Flush the stage if it says "blank", add 0 appropriately
    const newGame: TetrisGame.Game = this.game.map((row) =>
      row.map((cell) => (cell[1] === 'blank' ? [0, 'blank'] : cell) as TetrisGame.Cell),
    )

    this.player!.tetrominoe.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value) {
          newGame[i + this.player!.pos.y][j + this.player!.pos.x] = [
            value,
            this.player!.collided ? 'merged' : 'blank',
          ]
        }
      })
    })

    if (this.player!.collided) {
      // Create a new tetrominoe
      this.initializePlayer()

      // Clear rows if needed
      this.game = newGame.reduce((acc, row) => {
        // If we don't find a 0 it means that the row is full and should be cleared
        if (!row.some((cell) => cell[0] === 0)) {
          this.rowsCleared += 1

          // Create an empty row at the beginning of the array to push the Tetrominoes down
          // instead of returning the cleared row
          acc.unshift(new Array(newGame[0].length).fill([0, 'blank']) as TetrisGame.Cell[])
        } else {
          acc.push(row)
        }

        return acc
      }, [] as TetrisGame.Game)
    } else {
      this.game = newGame
    }
  }

  private rotatePlayer() {
    // Make the rows to become cols (transpose)
    const matrix = this.player!.tetrominoe.map((_, i) =>
      this.player!.tetrominoe.map((column) => column[i]),
    )

    // Reverse each row to get a rotated matrix
    this.player!.tetrominoe = matrix.map((row) => row.reverse())

    // player can't rotate into the walls or other tetrominoes
    const posX = this.player!.pos.x
    let offset = 1
    while (this.isColliding(0, 0)) {
      this.player!.pos.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))

      if (offset > this.player!.tetrominoe[0].length) {
        this.player!.pos.x = posX
        return
      }
    }
  }

  private isColliding(xOffset: number, yOffset: number) {
    for (let i = 0; i < this.player!.tetrominoe.length; i += 1) {
      for (let j = 0; j < this.player!.tetrominoe[i].length; j += 1) {
        if (this.player!.tetrominoe[i][j] !== 0) {
          if (
            // 2. Check that our move is inside the game areas height (y)
            // That we're not moving through the bottom of the grid
            !this.game[i + this.player!.pos.y + yOffset] ||
            // 3. Check that our move is inside the game areas width (x)
            !this.game[i + this.player!.pos.y + yOffset][j + this.player!.pos.x + xOffset] ||
            // 4. Check that the cell we're moving to isn't set to blank
            this.game[i + this.player!.pos.y + yOffset][j + this.player!.pos.x + xOffset][1] !==
              'blank'
          ) {
            return true
          }
        }
      }
    }

    return false
  }
}
