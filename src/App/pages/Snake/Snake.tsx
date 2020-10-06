/// <reference path="./Snake.d.ts" />

import React from 'react'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { SwipeableOptions, useSwipeable } from 'react-swipeable'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { constants } from '@app-shared/constants'

import { Screen } from './components/Screen'
import { SnakeGameController } from './controller/SnakeGameController'

import styles from './Snake.module.css'

const FRAME_RATE = 10

let gameController: SnakeGameController | undefined
let intervalId: NodeJS.Timeout

const swiperConfig: SwipeableOptions = {
  onSwiped: (event) => {
    gameController!.requestNextSnakeMovement(event.dir)
  },
  preventDefaultTouchmoveEvent: true,
  trackTouch: true,
  trackMouse: true,
}

export const Snake: React.FC<SnakeGameProps> = ({ cellSize = 20, gameSpeed = 1 }) => {
  if (!gameController) {
    gameController = new SnakeGameController(cellSize)
  }

  const [gameState, setGameState] = React.useState(gameController.getCurrentGameState())
  const [isGameOver, setIsGameOver] = React.useState(false)

  React.useEffect(() => {
    const handleWindowResize = debounce(resetGame, 250)

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDownListener)

    runGame()

    return () => {
      clearInterval(intervalId)
      gameController = undefined
      document.removeEventListener('keydown', onKeyDownListener)
    }
  }, [])

  const onKeyDownListener = React.useCallback(
    (event: KeyboardEvent) => {
      // If use presses the arrow keys, event.key will have the following values:
      // ArrowUp, ArrowDown, ArrowLeft, or ArrowRight.
      const direction = event.key.replace('Arrow', '')
      gameController!.requestNextSnakeMovement(direction as SnakeGame.Controls)
    },
    [gameController],
  )

  const runGame = React.useCallback(() => {
    intervalId = setInterval(() => {
      const nextGameState = gameController!.getNextGameState()

      if (nextGameState) {
        setGameState(nextGameState)
      } else {
        clearInterval(intervalId)
        setIsGameOver(true)
      }
    }, 1000 / (FRAME_RATE * gameSpeed))
  }, [gameController])

  const resetGame = React.useCallback(() => {
    clearInterval(intervalId)
    gameController = new SnakeGameController(cellSize)
    const newGame = gameController.getCurrentGameState()
    setGameState(newGame)
    setIsGameOver(false)
    runGame()
  }, [intervalId])

  const router = useRouter()
  const returnToHome = React.useCallback(() => {
    router.back()
  }, [router])

  const handlers = useSwipeable(swiperConfig)

  return (
    <section>
      <div className={styles.size} {...handlers}>
        <Screen gameState={gameState} gridSize={gameController.gridSize} cellSize={cellSize} />
      </div>
      {isGameOver && (
        <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
      )}
    </section>
  )
}

Snake.displayName = constants.pages.snake
