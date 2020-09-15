import React from 'react'

type GameOptionsContext = {
  onGameSettingsClick?: (gameName: string) => void
  onGameHelpClick?: (gameName: string) => void
}

const GameOptionsContext = React.createContext<GameOptionsContext>({})

export default GameOptionsContext
