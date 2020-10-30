type ChildrenOnlyProp = { children: React.ReactNode }

type GameNames = 'Snake' | 'Minesweeper' | 'PacMan'

type PagesConfig = {
  Home: HomeData
  Snake: SnakeGameProps
  Minesweeper: MinesweeperGameProps
  PacMan: PacManGameProps
}

type PageNames = 'Home' | GameNames

type ArrowControls = 'Up' | 'Right' | 'Down' | 'Left' | string

type GameStatus = 'ongoing' | 'win' | 'lose'

type GamesSettings = Record<GameNames, Array<GameSetting>>

type GamesHelp = Record<GameNames, GameHelpModal.GameHelp>

interface ArrowMovement {
  public requestArrowMovement: (pressedControl: ArrowControls) => void
}
