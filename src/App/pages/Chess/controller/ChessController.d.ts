namespace ChessGame {
  type PlayerColor = 'whites' | 'blacks'
  
  type Player = {
    color: PlayerColor
    isInCheck: boolean
    kingPos: Move
  }

  type Rook = 'rook'
  type Knight = 'knight'
  type Bishop = 'bishop'
  type Pawn = 'pawn'
  type Queen = 'queen'
  type King = 'king'

  type Cell = {
    value: Rook | Knight | Bishop | Pawn | Queen | King | ''
    color: PlayerColor | ''
    imageUrl: string
    hasMoved?: boolean
  }

  type Move = { row: number; col: number }

  type Game = Array<Array<Cell>>

  type State = {
    gameStatus: GameStatus
    game: Game
  }
}
