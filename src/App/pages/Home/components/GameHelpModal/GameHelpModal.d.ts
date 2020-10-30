namespace GameHelpModal {
  type GameHelp = {
    description: string
    gameOver: string
    controls: string
  }

  type Game = {
    gameName: string
    gameHelp: GameHelp
  }
}
