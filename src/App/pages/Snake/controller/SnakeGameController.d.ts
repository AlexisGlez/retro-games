namespace SnakeGame {
  type State = {
    snakeHeadPosition: Coordinate
    snakeMovement: Coordinate
    snakeBody: Array<Coordinate>
    foodPosition: Coordinate
  }

  type Settings = Partial<{ intialGameState: State }>
}
