import React from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider, CSSReset, ColorModeProvider, useDisclosure } from '@chakra-ui/core'

import theme from '@app-shared/theme'
import GameOptionsContext from '@app-shared/contexts/GameOptionsContext'

import GameSettingsModal, {
  GameSettingsUpdates,
  Game,
  GameSettings,
} from './components/GameSettingsModal'
import { pagesConfig, gamesSettings } from './config'

type ChildrenOnlyProp = { children: React.ReactNode }

// TODO: Move type definitions to index.d.ts

function App({ Component, pageProps }: AppProps) {
  const [currentPagesConfig, setCurrentPagesConfig] = React.useState(pagesConfig)
  const [currentGamesSettings, setCurrentGamesSettings] = React.useState(gamesSettings)
  const gameSettingsModal = useDisclosure(false)
  const [currentGame, setCurrentGame] = React.useState<Game>({
    gameName: '',
    gameSettings: [],
  })

  const gameOptions = {
    onGameSettingsClick: (gameName: string) => {
      setCurrentGame({
        gameName,
        gameSettings: currentGamesSettings[gameName] as Array<GameSettings>,
      })

      gameSettingsModal.onOpen()
    },
    onGameHelpClick: (gameName: string) => {
      console.log('onGameHelpClick', gameName)
    },
  }

  const onGameSettingsChanged = (gameSettings: GameSettingsUpdates) => {
    const newSettings = gameSettings.gameSettings.reduce((acc, curr) => {
      acc[curr.propertyName] = curr.newValue
      return acc
    }, {} as any)

    setCurrentPagesConfig((prevState) => ({
      ...prevState,
      [gameSettings.gameName]: {
        ...prevState[gameSettings.gameName],
        ...newSettings,
      },
    }))

    setCurrentGamesSettings((prevState) => ({
      ...prevState,
      [gameSettings.gameName]: prevState[gameSettings.gameName].map((settings) => ({
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

  const additionalProps = currentPagesConfig[Component.displayName || ''] || {}

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

export default App
