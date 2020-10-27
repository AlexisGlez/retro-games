import React from 'react'

export type GameOptionsContext = {
  onGameSettingsClick?: (gameName: string) => void
  onGameHelpClick?: (gameName: string) => void
}

export const GameOptionsContext = React.createContext<GameOptionsContext>({})
