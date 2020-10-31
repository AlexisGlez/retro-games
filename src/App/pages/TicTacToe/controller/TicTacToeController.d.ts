namespace TicTactToeGame {
  type Player = 'X' | 'O'

  type WinNames =
    | 'top-horizontally'
    | 'bottom-horizontally'
    | 'left-right-cross'
    | 'right-left-cross'
    | 'left-vertically'
    | 'right-vertically'
    | 'middle-vertically'
    | 'middle-horizontally'

  type CellValue = Player | ''

  type Game = [
    CellValue,
    CellValue,
    CellValue,
    CellValue,
    CellValue,
    CellValue,
    CellValue,
    CellValue,
    CellValue,
  ]

  type State = {
    gameStatus: GameStatus
    game: Game
    winName?: WinNames
  }
}
