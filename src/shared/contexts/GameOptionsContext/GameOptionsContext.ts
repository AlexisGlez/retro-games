import React from 'react'

type GameOptionsContext = {
  onGameSettingsClick?: (gameName: string) => void
  onGameHelpClick?: (gameName: string) => void
}

export const GameOptionsContext = React.createContext<GameOptionsContext>({})
