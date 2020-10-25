type ChildrenOnlyProp = { children: React.ReactNode }

type GameNames = 'Snake' | 'Minesweeper' | 'PacMan'

type PageNames = 'Home' | GameNames

type ArrowControls = 'Up' | 'Right' | 'Down' | 'Left' | string

type GameStatus = 'ongoing' | 'win' | 'lose'

interface ArrowMovement {
  public requestArrowMovement: (pressedControl: ArrowControls) => void
}
