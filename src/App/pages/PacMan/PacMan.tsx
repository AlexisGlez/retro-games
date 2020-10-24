/// <reference path="./PacMan.d.ts" />

import React from 'react'
import { SwipeableOptions, useSwipeable } from 'react-swipeable'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { constants } from '@app-shared/constants'
import { useWindowResize } from '@app-shared/hooks/useWindowResize'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
import { useArrowKeysListener } from '@app-shared/hooks/useKeyDownListener'

import { Screen } from './components/Screen'
import { PacManController } from './controller/PacManController'

// const FRAME_RATE = 10

let gameController: PacManController | undefined
let intervalId: NodeJS.Timeout

const swiperConfig: SwipeableOptions = {
  // onSwiped: (event) => {
  //   gameController!.requestNextSnakeMovement(event.dir)
  // },
  preventDefaultTouchmoveEvent: true,
  trackTouch: true,
  trackMouse: true,
}

export const PacMan: React.FC<PacManGameProps> = ({ level = 'easy' }) => {
  if (!gameController) {
    gameController = new PacManController(level)
  }

  const [gameState, setGameState] = React.useState(gameController.getGameState())
  const [isGameOver, setIsGameOver] = React.useState(false)

  const resetGame = React.useCallback(() => {
    clearInterval(intervalId)
    gameController = new PacManController(level)
    setGameState(gameController.getGameState())
    setIsGameOver(false)
  }, [intervalId])

  useWindowResize(resetGame)

  useArrowKeysListener(gameController.requestArrowMovement)

  const returnToHome = useReturnToHome()

  const handlers = useSwipeable(swiperConfig)

  return (
    <section>
      <FullScreen containerProps={handlers}>
        <Screen gameState={gameState} />
      </FullScreen>
      {isGameOver && (
        <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
      )}
    </section>
  )
}

PacMan.displayName = constants.pages.pacMan
