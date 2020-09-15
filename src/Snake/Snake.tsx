import React from 'react'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { SwipeableOptions, useSwipeable } from 'react-swipeable'

import Screen from '@app-snake/components/Screen'
import GameController, { GameControls } from '@app-snake/GameController'
import GameOverModal from '@app-shared/components/GameOverModal'

import styles from './Snake.module.css'

const FRAME_RATE = 10

let gameController: GameController | undefined
let intervalId: NodeJS.Timeout

const swiperConfig: SwipeableOptions = {
  onSwiped: (event) => {
    gameController!.requestNextSnakeMovement(event.dir)
  },
  preventDefaultTouchmoveEvent: true,
  trackTouch: true,
  trackMouse: true,
}

type SnakeProps = {
  cellSize?: number
  gameSpeed?: number
}

const Snake: React.FC<SnakeProps> = ({ cellSize = 20, gameSpeed = 1 }) => {
  if (!gameController) {
    gameController = new GameController(cellSize)
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

  const onKeyDownListener = (event: KeyboardEvent) => {
    // If use presses the arrow keys, event.key will have the following values:
    // ArrowUp, ArrowDown, ArrowLeft, or ArrowRight.
    const direction = event.key.replace('Arrow', '')
    gameController!.requestNextSnakeMovement(direction as GameControls)
  }

  function runGame() {
    intervalId = setInterval(() => {
      const nextGameState = gameController!.getNextGameState()

      if (nextGameState) {
        setGameState(nextGameState)
      } else {
        clearInterval(intervalId)
        setIsGameOver(true)
      }
    }, 1000 / (FRAME_RATE * gameSpeed))
  }

  function resetGame() {
    clearInterval(intervalId)
    gameController = new GameController(cellSize)
    const newGame = gameController.getCurrentGameState()
    setGameState(newGame)
    setIsGameOver(false)
    runGame()
  }

  const router = useRouter()
  function returnToHome() {
    setIsGameOver(false)
    router.back()
  }

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

Snake.displayName = 'Snake'

export default Snake
