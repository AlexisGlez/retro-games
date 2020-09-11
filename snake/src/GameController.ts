import isEqual from 'lodash.isequal'

const CELL_SIZE = 20

const initialGameState = {
  snakeHeadPosition: { x: 3, y: 10 },
  snakeMovement: { x: 1, y: 0 },
  snakeBody: [
    { x: 1, y: 10 },
    { x: 2, y: 10 },
    { x: 3, y: 10 },
  ],
  foodLocation: { x: 7, y: 7 },
  cellSize: CELL_SIZE,
}

const SNAKE_MOVEMENTS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
} as const

type GameSettings = Partial<{ intialGameState: GameState }>

function getGridSize(): GridSize {
  if (typeof window === 'undefined') {
    return { width: 1, height: 1 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

class GameController {
  public readonly gridSize: GridSize = getGridSize()

  private currentGameState: GameState
  private widthLimit: number
  private heightLimit: number

  public constructor(settings: GameSettings = {}) {
    this.currentGameState = settings.intialGameState ? settings.intialGameState : initialGameState
    this.widthLimit = this.gridSize.width / this.currentGameState.cellSize
    this.heightLimit = this.gridSize.height / this.currentGameState.cellSize
  }

  public getCurrentGameState(): GameState {
    return this.currentGameState
  }

  public getNextGameState(nextSnakeMovement: SnakePosition): GameState | null {
    this.currentGameState = {
      ...this.currentGameState,
      snakeMovement: { ...nextSnakeMovement },
      snakeHeadPosition: {
        x: this.currentGameState.snakeHeadPosition.x + nextSnakeMovement.x,
        y: this.currentGameState.snakeHeadPosition.y + nextSnakeMovement.y,
      },
    }

    if (this.isSnakeOutOfBounds()) {
      alert('You lose! Snake is out of the screen')
      return null
    }

    if (this.isSnakeEatingItself()) {
      alert('You lose! Snake cannot eat itself!')
      return null
    }

    if (this.isSnakeEatingFood()) {
      this.eatFood()
      this.generateFoodInRandomPosition()
    }

    this.moveSnakeOnePosition()

    return this.currentGameState
  }

  private isSnakeOutOfBounds(): boolean {
    return (
      this.currentGameState.snakeHeadPosition.x < 0 ||
      this.currentGameState.snakeHeadPosition.x > this.widthLimit ||
      this.currentGameState.snakeHeadPosition.y < 0 ||
      this.currentGameState.snakeHeadPosition.y > this.heightLimit
    )
  }

  private isSnakeEatingFood(): boolean {
    return (
      this.currentGameState.snakeHeadPosition.x === this.currentGameState.foodLocation.x &&
      this.currentGameState.snakeHeadPosition.y === this.currentGameState.foodLocation.y
    )
  }

  private eatFood(): void {
    // Increase the body of the snake by one
    this.currentGameState.snakeBody.push({
      ...this.currentGameState.snakeHeadPosition,
    })

    // Move the snake one position
    this.currentGameState.snakeHeadPosition.x =
      this.currentGameState.snakeHeadPosition.x + this.currentGameState.snakeMovement.x
    this.currentGameState.snakeHeadPosition.y =
      this.currentGameState.snakeHeadPosition.y + this.currentGameState.snakeMovement.y
  }

  private generateFoodInRandomPosition(): void {
    // verify that the food has not spawn in a position where the snake currently is
    const hasFoodSpawnInSnakePosition = () => {
      return Boolean(
        this.currentGameState.snakeBody.find(
          (snakePiece) =>
            snakePiece.x === this.currentGameState.foodLocation.x &&
            snakePiece.y === this.currentGameState.foodLocation.y,
        ),
      )
    }

    do {
      this.currentGameState.foodLocation.x = Math.floor(Math.random() * this.widthLimit)
      this.currentGameState.foodLocation.y = Math.floor(Math.random() * this.heightLimit)
    } while (hasFoodSpawnInSnakePosition())
  }

  private isSnakeEatingItself() {
    return this.currentGameState.snakeBody.find(
      (snakePiece) =>
        snakePiece.x === this.currentGameState.snakeHeadPosition.x &&
        snakePiece.y === this.currentGameState.snakeHeadPosition.y,
    )
  }

  private moveSnakeOnePosition() {
    // Add the current head position as part of the body
    this.currentGameState.snakeBody.push({
      ...this.currentGameState.snakeHeadPosition,
    })

    // Remove the first position of the snake's body
    this.currentGameState.snakeBody.shift()
  }

  public getSnakeMovement(pressedControl: GameControls): SnakePosition {
    switch (pressedControl) {
      case 'ArrowLeft': {
        return this.isSnakeMovingToTheRight()
          ? this.currentGameState.snakeMovement
          : SNAKE_MOVEMENTS.left
      }
      case 'ArrowDown': {
        return this.isSnakeMovingUp() ? this.currentGameState.snakeMovement : SNAKE_MOVEMENTS.down
      }
      case 'ArrowRight': {
        return this.isSnakeMovingToTheLeft()
          ? this.currentGameState.snakeMovement
          : SNAKE_MOVEMENTS.right
      }
      case 'ArrowUp': {
        return this.isSnakeMovingDown() ? this.currentGameState.snakeMovement : SNAKE_MOVEMENTS.up
      }
      default: {
        return this.currentGameState.snakeMovement
      }
    }
  }

  private isSnakeMovingToTheRight(): boolean {
    return isEqual(this.currentGameState.snakeMovement, SNAKE_MOVEMENTS.right)
  }

  private isSnakeMovingToTheLeft(): boolean {
    return isEqual(this.currentGameState.snakeMovement, SNAKE_MOVEMENTS.left)
  }

  private isSnakeMovingDown(): boolean {
    return isEqual(this.currentGameState.snakeMovement, SNAKE_MOVEMENTS.down)
  }

  private isSnakeMovingUp(): boolean {
    return isEqual(this.currentGameState.snakeMovement, SNAKE_MOVEMENTS.up)
  }
}

export type GameState = typeof initialGameState
export type SnakePosition = typeof initialGameState.snakeMovement
export type GridSize = { width: number; height: number }
export type GameControls = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft'

export { CELL_SIZE }
export default GameController
