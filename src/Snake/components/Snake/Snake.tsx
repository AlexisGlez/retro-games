import React from 'react'
import debounce from 'lodash.debounce'
import Modal from 'react-responsive-modal'
import { SwipeableOptions, useSwipeable } from 'react-swipeable'

import Screen from '@app-snake/components/Screen'
import GameController, { GameControls } from '@app-snake/GameController'

import styles from './Snake.module.css'

const FRAME_RATE = 10

let gameController: GameController
let intervalId: NodeJS.Timeout

const swiperConfig: SwipeableOptions = {
  onSwiped: (event) => {
    gameController.requestNextSnakeMovement(event.dir)
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
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  React.useEffect(() => {
    const handleWindowResize = debounce(resetGame, 250)

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  })

  const onKeyDownListener = (event: KeyboardEvent) => {
    // If use presses the arrow keys, event.key will have the following values:
    // ArrowUp, ArrowDown, ArrowLeft, or ArrowRight.
    const direction = event.key.replace('Arrow', '')
    gameController.requestNextSnakeMovement(direction as GameControls)
  }

  function runGame() {
    intervalId = setInterval(() => {
      const nextGameState = gameController.getNextGameState()

      if (nextGameState) {
        setGameState(nextGameState)
      } else {
        clearInterval(intervalId)
        setIsModalOpen(true)
      }
    }, 1000 / (FRAME_RATE * gameSpeed))
  }

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDownListener)

    runGame()

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('keydown', onKeyDownListener)
    }
  }, [])

  function resetGame() {
    clearInterval(intervalId)
    gameController = new GameController(cellSize)
    const newGame = gameController.getCurrentGameState()
    setGameState(newGame)
    setIsModalOpen(false)
    runGame()
  }

  const handlers = useSwipeable(swiperConfig)

  return (
    <section>
      <div className={styles.size} {...handlers}>
        <Screen gameState={gameState} gridSize={gameController.gridSize} cellSize={cellSize} />
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
        <h2 className={styles.header}>Game Over!</h2>
        <p className={styles.content}>What do you want to do next?</p>
        <div className={styles.flex}>
          <button className={styles.return} onClick={() => setIsModalOpen(false)}>
            Return to Home
          </button>
          <button className={styles.play} onClick={resetGame}>
            Play Again!
          </button>
        </div>
      </Modal>
    </section>
  )
}

export default Snake
