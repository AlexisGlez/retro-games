/// <reference path="./Tetris.d.ts" />

import React from 'react'
import Head from 'next/head'
import { Button, Flex, useToast } from '@chakra-ui/core'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
import { constants } from '@app-src/shared/constants'
import { useWindowResize } from '@app-shared/hooks/useWindowResize'
import { useArrowKeysListener } from '@app-shared/hooks/useKeyDownListener'

import { TetrisController } from './controller/TetrisController'
import { Screen } from './components/Screen'

let gameController: TetrisController | undefined
let intervalId: NodeJS.Timeout
const buttonsSize = '2.5rem'
let wasDownButtonManuallyClicked = false

export const Tetris: React.FC<TetrisGameProps> = ({ difficulty }) => {
  if (!gameController) {
    gameController = new TetrisController(difficulty)
  }

  const toast = useToast()
  const [gameState, setGameState] = React.useState<TetrisGame.State>(gameController.getGameState())
  const [isGameOver, setIsGameOver] = React.useState(false)

  React.useEffect(() => {
    setGameState(gameController!.getGameState())

    return () => {
      gameController = undefined
    }
  }, [])

  const resetGame = React.useCallback(() => {
    clearInterval(intervalId)
    gameController = new TetrisController(difficulty)
    setGameState(gameController.getGameState())
    setIsGameOver(false)
    runGame()
  }, [difficulty])

  useWindowResize(resetGame)

  const returnToHome = useReturnToHome()

  React.useEffect(() => {
    runGame()
  }, [gameState!.gameSpeed])

  React.useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        gameController?.stopMoreSpeed()
      }
    }

    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keyup', onKeyUp)
      clearInterval(intervalId)
      gameController = undefined
    }
  }, [])

  useArrowKeysListener(gameController.requestArrowMovement)

  const runGame = React.useCallback(() => {
    clearInterval(intervalId)

    intervalId = setInterval(() => {
      const nextGameState = gameController!.getNextGameState()

      if (wasDownButtonManuallyClicked) {
        gameController!.stopMoreSpeed()
        wasDownButtonManuallyClicked = false
      }

      if (nextGameState.gameStatus === 'ongoing') {
        setGameState(nextGameState)
      } else {
        toast({
          title: `Great job! This is your score: ${nextGameState.score}. You reached level: ${nextGameState.level}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
        clearInterval(intervalId)
        setIsGameOver(true)
      }
    }, gameState!.gameSpeed / 3)
  }, [gameController, gameState!.gameSpeed])

  return (
    <>
      <Head>
        <title>Tetris</title>
      </Head>
      <section>
        <FullScreen>
          {gameController && gameState.gameWidth && gameState.gameHeight && (
            <>
              <Screen gameState={gameState} />
              <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                position="fixed"
                bottom="10px"
                zIndex={1}
              >
                <Button
                  width={buttonsSize}
                  borderColor="white"
                  borderWidth={1}
                  onClick={() => gameController?.requestArrowMovement('Up')}
                >
                  &#8593;
                </Button>
                <Flex>
                  <Button
                    width={buttonsSize}
                    borderColor="white"
                    borderWidth={1}
                    onClick={() => gameController?.requestArrowMovement('Left')}
                  >
                    &#8592;
                  </Button>
                  <Button
                    width={buttonsSize}
                    borderColor="white"
                    borderWidth={1}
                    onClick={() => {
                      gameController?.requestArrowMovement('Down')
                      wasDownButtonManuallyClicked = true
                    }}
                  >
                    &#8595;
                  </Button>
                  <Button
                    width={buttonsSize}
                    borderColor="white"
                    borderWidth={1}
                    onClick={() => gameController?.requestArrowMovement('Right')}
                  >
                    &#8594;
                  </Button>
                </Flex>
              </Flex>
            </>
          )}
        </FullScreen>
        {isGameOver && (
          <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
        )}
      </section>
    </>
  )
}

Tetris.displayName = constants.pages.Tetris
