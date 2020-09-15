import React from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'

import theme from '@app-shared/theme'
import GameOptionsContext from '@app-shared/contexts/GameOptionsContext'

type ChildrenOnlyProp = { children: React.ReactNode }

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
    cellSize: undefined,
    gameSpeed: undefined,
  },
}

function App({ Component, pageProps }: AppProps) {
  const gameOptions = {
    onGameSettingsClick: (gameName: string) => {
      console.log('onGameSettingsClick', gameName)
    },
    onGameHelpClick: (gameName: string) => {
      console.log('onGameHelpClick', gameName)
    },
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
        </ComponentWrapper>
      </ColorModeProvider>
    </ThemeProvider>
  )
}

export default App
