type ChildrenOnlyProp = { children: React.ReactNode }

type GameNames = 'Snake' | 'Minesweeper' | 'PacMan' | 'TicTacToe' | 'Chess' | 'Wordle'

type PageNames = 'Home' | GameNames

type PagesConfig = {
  Home: HomeData
  Snake: SnakeGameProps
  Minesweeper: MinesweeperGameProps
  PacMan: PacManGameProps
  TicTacToe: TicTacToeGameProps
  Chess: ChessGameProps
  Wordle: WordleGameProps
}

type ArrowControls = 'Up' | 'Right' | 'Down' | 'Left' | string

type GameStatus = 'ongoing' | 'win' | 'lose' | 'tie'

type GamesSettings = Record<GameNames, Array<GameSetting>>

type GamesHelp = Record<GameNames, GameHelpModal.GameHelp>

interface ArrowMovement {
  requestArrowMovement: (pressedControl: ArrowControls) => void
}
