/// <reference path="./App.d.ts" />

import React from 'react'
import type { AppProps } from 'next/app'
import { ChakraProvider, ColorModeScript, useDisclosure } from '@chakra-ui/core'

import { theme } from '@app-shared/theme'
import { GameOptionsContext } from '@app-shared/contexts/GameOptionsContext'

import { GameSettingsModal } from './components/GameSettingsModal'
import { GameHelpModal } from './components/GameHelpModal'
import { pagesConfig, gamesSettings, gamesHelp } from './config'

type CurrentGame = GameSettingsModal.Game | GameHelpModal.Game

const gameOptions: GameOptionsContext = {}

export function App({ Component, pageProps }: AppProps) {
  const [currentPagesConfig, setCurrentPagesConfig] = React.useState(pagesConfig)
  const [currentGamesSettings, setCurrentGamesSettings] = React.useState(gamesSettings)

  const gameSettingsModal = useDisclosure({ defaultIsOpen: false })
  const gameHelpModal = useDisclosure({ defaultIsOpen: false })

  const [currentGame, setCurrentGame] = React.useState<CurrentGame>({
    gameName: '',
    gameSettings: [],
    gameHelp: {
      description: '',
      controls: '',
      gameOver: '',
    },
  })

  gameOptions.onGameSettingsClick = (gameName: string) => {
    setCurrentGame((prevState) => ({
      ...prevState,
      gameName,
      gameSettings: currentGamesSettings[gameName as GameNames] as Array<GameSetting>,
    }))

    gameSettingsModal.onOpen()
  }

  gameOptions.onGameHelpClick = (gameName: string) => {
    setCurrentGame((prevState) => ({
      ...prevState,
      gameName,
      gameHelp: gamesHelp[gameName as GameNames],
    }))

    gameHelpModal.onOpen()
  }

  const onGameSettingsChanged = React.useCallback(
    (gameSettings: GameSettingsModal.GameSettingsUpdates) => {
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
    },
    [setCurrentPagesConfig, setCurrentGamesSettings],
  )

  const Wrappers = React.useMemo(
    () => ({
      Home: ({ children }: ChildrenOnlyProp) => (
        <GameOptionsContext.Provider value={gameOptions}>{children}</GameOptionsContext.Provider>
      ),
    }),
    [],
  )

  const ComponentWrapper = React.useMemo(
    () =>
      Wrappers[Component.displayName as keyof typeof Wrappers] ||
      (({ children }: ChildrenOnlyProp) => <>{children}</>),
    [Wrappers],
  )

  const additionalProps = currentPagesConfig[Component.displayName as PageNames] || {}

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
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
    </ChakraProvider>
  )
}
