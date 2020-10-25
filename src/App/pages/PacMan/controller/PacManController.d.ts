namespace PacManGame {
  type State = {
    gameBoard: Array<GameBoardPiece>
    score: number
    gameStatus: GameStatus
    latestAction: Actions
  }

  type Actions = 'ghost-eaten' | 'pill-eaten' | 'dot-eaten' | ''

  type GameLevels = 'easy'

  type GameBoardPiece = {
    style: {
      height: number
      transform: string
      width: number
    }
    attributes: Array<string>
  }

  type Direction = {
    movement: number
    rotation: number
  }

  type CharacterMove = {
    direction: Direction
    position: number
  }
}
