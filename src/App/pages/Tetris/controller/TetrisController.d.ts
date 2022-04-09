namespace TetrisGame {
  type TetrominoesShapes = 0 | 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'

  type Cell = [TetrominoesShapes, 'blank' | 'merged']

  type Game = Cell[][]

  type Player = {
    pos: { x: number; y: number }
    tetrominoe: TetrominoesShapes[][]
    collided: boolean
  }

  type State = {
    gameStatus: GameStatus
    game: Game
    player: Player
    cellSize: number
    gameWidth: number
    gameHeight: number
    gameSpeed: number
    score: number
    level: number
  }
}
