/// <reference path="./TicTacToeController.d.ts" />

const possibleWins: Array<{
  name: TicTactToeGame.WinNames
  validation: [number, number, number]
}> = [
  { name: 'top-horizontally', validation: [0, 1, 2] },
  { name: 'bottom-horizontally', validation: [6, 7, 8] },
  { name: 'left-right-cross', validation: [0, 4, 8] },
  { name: 'right-left-cross', validation: [2, 4, 6] },
  { name: 'left-vertically', validation: [0, 3, 6] },
  { name: 'right-vertically', validation: [2, 5, 8] },
  { name: 'middle-vertically', validation: [1, 4, 7] },
  { name: 'middle-horizontally', validation: [3, 4, 5] },
]

export class TicTacToeController {
  private game: TicTactToeGame.Game
  private gameStatus: GameStatus
  private winName: TicTactToeGame.WinNames | undefined

  private currentPlayer: TicTactToeGame.Player

  public constructor(currentPlayer: TicTactToeGame.Player = 'X') {
    this.game = ['', '', '', '', '', '', '', '', '']
    this.gameStatus = 'ongoing'
    this.currentPlayer = currentPlayer
  }

  public getGameState(): TicTactToeGame.State {
    return { game: this.game, gameStatus: this.gameStatus, winName: this.winName }
  }

  public getNextGameState(cell: number): TicTactToeGame.State {
    if (this.game[cell]) {
      return this.getGameState()
    }

    this.game[cell] = this.currentPlayer

    const win = this.checkForWin()

    if (win) {
      this.gameStatus = 'win'
      this.winName = win.name
    } else {
      this.gameStatus = this.game.every(Boolean) ? 'tie' : 'ongoing'
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'

    return this.getGameState()
  }

  private checkForWin() {
    return possibleWins.find((possibleWin) =>
      possibleWin.validation.every((cell) => this.game[cell] === this.currentPlayer),
    )
  }
}
