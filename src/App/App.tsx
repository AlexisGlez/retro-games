/// <reference path="./App.d.ts" />

import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ThemeProvider, CSSReset, ColorModeProvider, useDisclosure } from '@chakra-ui/core'

import { theme } from '@app-shared/theme'
import { GameOptionsContext } from '@app-shared/contexts/GameOptionsContext'

import { GameSettingsModal } from './components/GameSettingsModal'
import { GameHelpModal } from './components/GameHelpModal'
import { pagesConfig, gamesSettings, gamesHelp } from './config'

type CurrentGame = GameSettingsModal.Game | GameHelpModal.Game

export function App({ Component, pageProps }: AppProps) {
  const [currentPagesConfig, setCurrentPagesConfig] = React.useState(pagesConfig)
  const [currentGamesSettings, setCurrentGamesSettings] = React.useState(gamesSettings)

  const gameSettingsModal = useDisclosure(false)
  const gameHelpModal = useDisclosure(false)

  const [currentGame, setCurrentGame] = React.useState<CurrentGame>({
    gameName: '',
    gameSettings: [],
    gameHelp: {
      description: '',
      controls: '',
      gameOver: '',
    },
  })

  const gameOptions = {
    onGameSettingsClick: (gameName: string) => {
      setCurrentGame((prevState) => ({
        ...prevState,
        gameName,
        gameSettings: currentGamesSettings[gameName as GameNames] as Array<GameSetting>,
      }))

      gameSettingsModal.onOpen()
    },
    onGameHelpClick: (gameName: string) => {
      setCurrentGame((prevState) => ({
        ...prevState,
        gameName,
        gameHelp: gamesHelp[gameName as GameNames],
      }))

      gameHelpModal.onOpen()
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
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <ComponentWrapper>
          <Component {...pageProps} {...additionalProps} />
          <GameSettingsModal
            isOpen={gameSettingsModal.isOpen}
            onClose={gameSettingsModal.onClose}
            onGameSettingsChanged={onGameSettingsChanged}
            gameName={currentGame.gameName}
            gameSettings={(currentGame as GameSettingsModal.Game).gameSettings}
          />
          <GameHelpModal
            isOpen={gameHelpModal.isOpen}
            onClose={gameHelpModal.onClose}
            gameName={currentGame.gameName}
            gameHelp={(currentGame as GameHelpModal.Game).gameHelp}
          />
        </ComponentWrapper>
      </ColorModeProvider>
    </ThemeProvider>
  )
}
