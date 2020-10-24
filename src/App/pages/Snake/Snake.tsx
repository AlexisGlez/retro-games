/// <reference path="./Snake.d.ts" />

import React from 'react'
import { SwipeableOptions, useSwipeable } from 'react-swipeable'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { constants } from '@app-shared/constants'
import { useWindowResize } from '@app-shared/hooks/useWindowResize'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
import { useArrowKeysListener } from '@app-shared/hooks/useKeyDownListener'

import { Screen } from './components/Screen'
import { SnakeGameController } from './controller/SnakeGameController'

const FRAME_RATE = 10

let gameController: SnakeGameController | undefined
let intervalId: NodeJS.Timeout

const swiperConfig: SwipeableOptions = {
  onSwiped: (event) => {
    gameController!.requestArrowMovement(event.dir)
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
    runGame()

    return () => {
      clearInterval(intervalId)
      gameController = undefined
    }
  }, [])

  useArrowKeysListener(gameController.requestArrowMovement)

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

  useWindowResize(resetGame)

  const returnToHome = useReturnToHome()

  const handlers = useSwipeable(swiperConfig)

  return (
    <section>
      <FullScreen containerProps={handlers}>
        <Screen gameState={gameState} gridSize={gameController.gridSize} cellSize={cellSize} />
      </FullScreen>
      {isGameOver && (
        <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
      )}
    </section>
  )
}

Snake.displayName = constants.pages.snake
