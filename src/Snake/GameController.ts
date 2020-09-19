import isEqual from 'lodash.isequal'

const SNAKE_MOVEMENTS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
} as const

function isServer(): boolean {
  return typeof window === 'undefined'
}

export type Coordinate = { x: number; y: number }
export type GameState = {
  snakeHeadPosition: Coordinate
  snakeMovement: Coordinate
  snakeBody: Array<Coordinate>
  foodPosition: Coordinate
}

export type GameControls = 'Up' | 'Right' | 'Down' | 'Left'
export type GridSize = { width: number; height: number }
export type GameSettings = Partial<{ intialGameState: GameState }>

function getGridSize(): GridSize {
  if (isServer()) {
    return { width: 1, height: 1 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export class GameController {
  public readonly gridSize: GridSize = getGridSize()

  private currentGameState: GameState
  private widthLimit: number
  private heightLimit: number
  private nextSnakeMovement: Coordinate

  public constructor(cellSize: number, settings: GameSettings = {}) {
    this.widthLimit = Math.floor(this.gridSize.width / cellSize)
    this.heightLimit = Math.floor(this.gridSize.height / cellSize)

    this.currentGameState = settings.intialGameState
      ? settings.intialGameState
      : this.generateRandomInitialGame()

    this.nextSnakeMovement = this.currentGameState.snakeMovement
  }

  private generateRandomInitialGame(): GameState {
    if (isServer()) {
      return {
        snakeHeadPosition: { x: 0, y: 0 },
        snakeMovement: SNAKE_MOVEMENTS.right,
        snakeBody: [{ x: 0, y: 0 }],
        foodPosition: { x: 0, y: 0 },
      }
    }

    const snakeBody = this.generateRandomSnakePosition()

    const snakeHeadPosition = snakeBody[snakeBody.length - 1]
    const snakeNeckPosition = snakeBody[snakeBody.length - 2]
    const snakeMovement = this.generateRandomSnakeMovement(snakeHeadPosition, snakeNeckPosition)

    const foodPosition = this.generateRandomFoodPosition(snakeBody)

    return {
      snakeHeadPosition,
      snakeMovement,
      snakeBody,
      foodPosition,
    }
  }

  private generateRandomSnakePosition(): Array<Coordinate> {
    const snakeAlignment = Math.random() <= 0.5 ? 'horizontal' : 'vertical'

    let xLimit = this.widthLimit
    let yLimit = this.heightLimit

    // At the beggining of the game, the snake will have a size of 3.
    // To ensure the snake starts in a random position that fits in the
    // screen size, we need to extract 2 of the maximum width or height
    // depending on the starting snake alignment (vertical/horizontal)
    if (snakeAlignment === 'horizontal') {
      xLimit -= 2
    } else {
      yLimit -= 2
    }

    const randomXCoord = Math.floor(Math.random() * xLimit)
    const randomYCoord = Math.floor(Math.random() * yLimit)

    if (snakeAlignment === 'horizontal') {
      return [
        { x: randomXCoord, y: randomYCoord },
        { x: randomXCoord + 1, y: randomYCoord },
        { x: randomXCoord + 2, y: randomYCoord },
      ]
    }

    return [
      { x: randomXCoord, y: randomYCoord },
      { x: randomXCoord, y: randomYCoord + 1 },
      { x: randomXCoord, y: randomYCoord + 2 },
    ]
  }

  private generateRandomSnakeMovement(
    snakeHeadPosition: Coordinate,
    snakeNeckPosition: Coordinate,
  ): Coordinate {
    const snakeCannotMoveLeft =
      snakeHeadPosition.x === 0 || snakeHeadPosition.x - 1 === snakeNeckPosition.x
    const snakeCannotMoveRight =
      snakeHeadPosition.x === this.widthLimit || snakeHeadPosition.x + 1 === snakeNeckPosition.x
    const snakeCannotMoveUp =
      snakeHeadPosition.y === 0 || snakeHeadPosition.y - 1 === snakeNeckPosition.y
    const snakeCannotMoveDown =
      snakeHeadPosition.y === this.heightLimit || snakeHeadPosition.y + 1 === snakeNeckPosition.y

    // If the snake cannot start moving somewhere due to its head position,
    // the movement gets disabled by setting it to -1
    const possibleMovements: { [key in keyof typeof SNAKE_MOVEMENTS]: number } = {
      left: snakeCannotMoveLeft ? -1 : 0,
      right: snakeCannotMoveRight ? -1 : 1,
      up: snakeCannotMoveUp ? -1 : 2,
      down: snakeCannotMoveDown ? -1 : 3,
    }
    const movementKeys = Object.keys(possibleMovements) as Array<keyof typeof SNAKE_MOVEMENTS>

    let randomSnakeMovement: number
    let snakeMovementSelected: keyof typeof SNAKE_MOVEMENTS | undefined
    do {
      // snake has 4 possible movements: up, down, left, & right
      randomSnakeMovement = Math.floor(Math.random() * 4)

      // see if the random selected movement is not disabled
      snakeMovementSelected = movementKeys.find(
        (key) => possibleMovements[key] === randomSnakeMovement,
      )
    } while (!snakeMovementSelected)

    return SNAKE_MOVEMENTS[snakeMovementSelected]
  }

  public getCurrentGameState(): GameState {
    return this.currentGameState
  }

  public getNextGameState(): GameState | null {
    this.currentGameState = {
      ...this.currentGameState,
      snakeMovement: { ...this.nextSnakeMovement },
      snakeHeadPosition: {
        x: this.currentGameState.snakeHeadPosition.x + this.nextSnakeMovement.x,
        y: this.currentGameState.snakeHeadPosition.y + this.nextSnakeMovement.y,
      },
    }

    if (this.isSnakeOutOfBounds()) {
      return null
    }

    if (this.isSnakeEatingItself()) {
      return null
    }

    if (this.isSnakeEatingFood()) {
      this.eatFood()
      this.currentGameState.foodPosition = this.generateRandomFoodPosition(
        this.currentGameState.snakeBody,
      )
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
      this.currentGameState.snakeHeadPosition.x === this.currentGameState.foodPosition.x &&
      this.currentGameState.snakeHeadPosition.y === this.currentGameState.foodPosition.y
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

  private generateRandomFoodPosition(snakeBody: Array<Coordinate>): Coordinate {
    // verify that the food has not spawn in a position where the snake currently is
    const hasFoodSpawnInSnakePosition = (foodPosition: Coordinate) => {
      return Boolean(
        snakeBody.find(
          (snakePiece) => snakePiece.x === foodPosition.x && snakePiece.y === foodPosition.y,
        ),
      )
    }

    const foodPosition: Coordinate = { x: 0, y: 0 }

    do {
      foodPosition.x = Math.floor(Math.random() * this.widthLimit)
      foodPosition.y = Math.floor(Math.random() * this.heightLimit)
    } while (hasFoodSpawnInSnakePosition(foodPosition))

    return foodPosition
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

  public requestNextSnakeMovement(pressedControl: GameControls): void {
    if (pressedControl === 'Left') {
      this.nextSnakeMovement = this.isSnakeMovingToTheRight()
        ? this.currentGameState.snakeMovement
        : SNAKE_MOVEMENTS.left
    } else if (pressedControl === 'Right') {
      this.nextSnakeMovement = this.isSnakeMovingToTheLeft()
        ? this.currentGameState.snakeMovement
        : SNAKE_MOVEMENTS.right
    } else if (pressedControl === 'Up') {
      this.nextSnakeMovement = this.isSnakeMovingDown()
        ? this.currentGameState.snakeMovement
        : SNAKE_MOVEMENTS.up
    } else if (pressedControl === 'Down') {
      this.nextSnakeMovement = this.isSnakeMovingUp()
        ? this.currentGameState.snakeMovement
        : SNAKE_MOVEMENTS.down
    } else {
      this.nextSnakeMovement = this.currentGameState.snakeMovement
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
