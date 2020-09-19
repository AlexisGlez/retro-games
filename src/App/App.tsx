/// <reference path="./App.d.ts" />

import React from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider, CSSReset, ColorModeProvider, useDisclosure } from '@chakra-ui/core'

import { theme } from '@app-shared/theme'
import { GameOptionsContext } from '@app-shared/contexts/GameOptionsContext'

import { GameSettingsModal } from './components/GameSettingsModal'
import { pagesConfig, gamesSettings } from './config'

export function App({ Component, pageProps }: AppProps) {
  const [currentPagesConfig, setCurrentPagesConfig] = React.useState(pagesConfig)
  const [currentGamesSettings, setCurrentGamesSettings] = React.useState(gamesSettings)
  const gameSettingsModal = useDisclosure(false)
  const [currentGame, setCurrentGame] = React.useState<GameSettingsModal.Game>({
    gameName: '',
    gameSettings: [],
  })

  const gameOptions = {
    onGameSettingsClick: (gameName: string) => {
      setCurrentGame({
        gameName,
        gameSettings: currentGamesSettings[gameName as GameNames] as Array<GameSetting>,
      })

      gameSettingsModal.onOpen()
    },
    onGameHelpClick: (gameName: string) => {
      console.log('onGameHelpClick', gameName)
    },
  }

  const onGameSettingsChanged = (gameSettings: GameSettingsModal.GameSettingsUpdates) => {
    const newSettings = gameSettings.gameSettings.reduce((acc, curr) => {
      acc[curr.propertyName] = curr.newValue
      return acc
    }, {} as any)

    setCurrentPagesConfig((prevState) => ({
      ...prevState,
      [gameSettings.gameName]: {
        ...prevState[gameSettings.gameName as GameNames],
        ...newSettings,
      },
    }))

    setCurrentGamesSettings((prevState) => ({
      ...prevState,
      [gameSettings.gameName]: prevState[gameSettings.gameName as GameNames].map((settings) => ({
        ...settings,
        currentValue: newSettings[settings.propertyName],
      })),
    }))
  }

  const Wrappers = {
    Home: ({ children }: ChildrenOnlyProp) => (
      <GameOptionsContext.Provider value={gameOptions}>{children}</GameOptionsContext.Provider>
    ),
  }

  const ComponentWrapper =
    Wrappers[Component.displayName as keyof typeof Wrappers] ||
    (({ children }: ChildrenOnlyProp) => <>{children}</>)

  const additionalProps = currentPagesConfig[Component.displayName as PageNames] || {}

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <ComponentWrapper>
          <Component {...pageProps} {...additionalProps} />
          <GameSettingsModal
            isOpen={gameSettingsModal.isOpen}
            onClose={gameSettingsModal.onClose}
            onGameSettingsChanged={onGameSettingsChanged}
            {...currentGame}
          />
        </ComponentWrapper>
      </ColorModeProvider>
    </ThemeProvider>
  )
}
