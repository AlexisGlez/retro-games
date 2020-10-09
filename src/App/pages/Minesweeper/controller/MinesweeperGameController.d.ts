namespace MinesweeperGame {
  type CellValue = '💣' | '✅' | number

  type CellData = {
    value: CellValue
    state: 'clicked' | 'flagged' | ''
  }

  type Action = 'click' | 'flag'

  type GameStatus = 'ongoing' | 'win' | 'lose'

  type State = {
    game: Array<Array<MinesweeperGame.CellData>>
    gameStatus: GameStatus
  }
}
