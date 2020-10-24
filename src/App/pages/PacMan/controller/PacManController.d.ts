namespace PacManGame {
  type State = {
    gameBoard: Array<GameBoardPiece>
  }
  type GameLevels = 'easy'

  type GameBoardPiece = {
    type: string
    style: Object
    attributes: Array<string>
  }

  type PacManDirection = {
    movement: number
    rotation: number
  }
}
