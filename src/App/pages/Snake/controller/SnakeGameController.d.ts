namespace SnakeGame {
  type State = {
    snakeHeadPosition: Coordinate
    snakeMovement: Coordinate
    snakeBody: Array<Coordinate>
    foodPosition: Coordinate
  }

  type Controls = 'Up' | 'Right' | 'Down' | 'Left'

  type Settings = Partial<{ intialGameState: State }>
}
