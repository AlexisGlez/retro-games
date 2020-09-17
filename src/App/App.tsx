import React from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider, CSSReset, ColorModeProvider, useDisclosure } from '@chakra-ui/core'

import theme from '@app-shared/theme'
import GameOptionsContext from '@app-shared/contexts/GameOptionsContext'
import GameSettingsModal, {
  GameSettings,
  GameSettingsUpdates,
  Game,
} from './components/GameSettingsModal'

type ChildrenOnlyProp = { children: React.ReactNode }

// TODO: Move pagesProps & getGamesSettings to config file.
// TODO: Add Pages Names as constants and use those constants as the keys for the configs

const pagesProps = {
  Home: {
    games: {
      snake: {
        gameName: 'Snake',
        gamePageName: 'snake',
        imageName: 'snake_demo',
        imageAlt: 'Snake Game',
      },
    },
  },
  Snake: {
    cellSize: 20,
    gameSpeed: 1,
  },
}

function getGamesSettings(): { [key: string]: Array<GameSettings> } {
  return {
    Snake: [
      {
        propertyName: 'cellSize',
        displayName: 'Cell Size',
        type: 'number',
        helperText: 'The size of each cell in the board, the food, and snake',
        currentValue: pagesProps.Snake.cellSize,
        step: 1,
        min: 1,
        max: 100,
      },
      {
        propertyName: 'gameSpeed',
        displayName: 'Game Speed',
        helperText: "The snake's speed (use with caution)",
        type: 'number',
        currentValue: pagesProps.Snake.gameSpeed,
        step: 1,
        min: 1,
        max: 9,
      },
    ],
  }
}

function App({ Component, pageProps }: AppProps) {
  const gameSettingsModal = useDisclosure(false)
  const [currentGame, setCurrentGame] = React.useState<Game>({
    gameName: '',
    gameSettings: [],
  })

  const gameOptions = {
    onGameSettingsClick: (gameName: string) => {
      setCurrentGame({
        gameName,
        gameSettings: getGamesSettings()[gameName],
      })

      gameSettingsModal.onOpen()
    },
    onGameHelpClick: (gameName: string) => {
      console.log('onGameHelpClick', gameName)
    },
  }

  const onGameSettingsChanged = (gameSettings: GameSettingsUpdates) => {
    const game = pagesProps[gameSettings.gameName as keyof typeof pagesProps] as any
    gameSettings.gameSettings.forEach((setting) => {
      game[setting.propertyName] = setting.newValue
    })
  }

  const Wrappers = {
    Home: ({ children }: ChildrenOnlyProp) => (
      <GameOptionsContext.Provider value={gameOptions}>{children}</GameOptionsContext.Provider>
    ),
  }

  const ComponentWrapper =
    Wrappers[Component.displayName as keyof typeof Wrappers] ||
    (({ children }: ChildrenOnlyProp) => <>{children}</>)

  const additionalProps = pagesProps[Component.displayName as keyof typeof pagesProps] || {}

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
