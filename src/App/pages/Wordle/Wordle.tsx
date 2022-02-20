/// <reference path="./Wordle.d.ts" />

import React from 'react'
import Head from 'next/head'
import { useToast } from '@chakra-ui/core'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
import { constants } from '@app-src/shared/constants'

import { WordleController } from './controller/WordleController'
import { Screen } from './components/Screen'

let gameController: WordleController | undefined

export const Wordle: React.FC<WordleGameProps> = ({ difficulty }) => {
  if (!gameController) {
    gameController = new WordleController(difficulty)
  }

  const toast = useToast()
  const [gameState, setGameState] = React.useState<WordleGame.State>(gameController.getGameState())
  const [isGameOver, setIsGameOver] = React.useState(false)

  React.useEffect(() => {
    return () => {
      gameController = undefined
    }
  }, [])

  const resetGame = React.useCallback(() => {
    gameController = new WordleController(difficulty)
    setGameState(gameController.getGameState())
    setIsGameOver(false)
  }, [difficulty])

  const returnToHome = useReturnToHome()

  const onKeyClick = React.useCallback((key: string) => {
    const nextGameState = gameController!.getNextGameState(key)
    setGameState(nextGameState)

    if (nextGameState.errorState) {
      toast({
        title:
          nextGameState.errorState === 'not-enough-letters'
            ? 'Not enough letters'
            : 'Not word in list',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'top',
      })
    }
  
    const timeoutId = setTimeout(() => {
      setIsGameOver(nextGameState.gameStatus !== 'ongoing')
    }, 4000)

    return () => { clearTimeout(timeoutId) }
  }, [])

  return (
    <>
      <Head>
        <title>Wordle</title>
      </Head>
      <section>
        <FullScreen>
          {gameController && (
            <Screen keys={WordleController.keys} gameState={gameState} onKeyClick={onKeyClick} />
          )}
        </FullScreen>
        {isGameOver && (
          <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
        )}
      </section>
    </>
  )
}

Wordle.displayName = constants.pages.Wordle
