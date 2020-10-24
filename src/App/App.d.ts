type ChildrenOnlyProp = { children: React.ReactNode }

type GameNames = 'Snake' | 'Minesweeper'

type PageNames = 'Home' | GameNames

type ArrowControls = 'Up' | 'Right' | 'Down' | 'Left' | string

interface ArrowMovement {
  public requestArrowMovement: (pressedControl: ArrowControls) => void
}
