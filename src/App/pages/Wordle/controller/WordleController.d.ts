namespace WordleGame {
  type Cell = {
    letter: string
    status?: 'correct' | 'almost' | 'incorrect'
  }

  type Game = Cell[][]

  type ErrorState = 'not-enough-letters' | 'not-word-found'

  type ProcessedLetters = { [key: string]: Cell['status'] }

  type State = {
    gameStatus: GameStatus
    game: Game
    errorState?: ErrorState
    processedLetters: ProcessedLetters
    currentRow: number
    targetWord?: string
  }
}
