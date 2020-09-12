import React from 'react'
import debounce from 'lodash.debounce'
import { SwipeableOptions, useSwipeable } from 'react-swipeable'
import Modal from 'react-responsive-modal'

import Screen from 'src/components/Screen'
import GameController, { GameControls, CELL_SIZE, Coordinate } from '@app-src/GameController'

import styles from './Index.module.css'

const FRAME_RATE = 10
const FRAMES_PER_SECOND = 1000 / FRAME_RATE

let gameController = new GameController()
let snakeMovement: Coordinate
let intervalId: NodeJS.Timeout

const swiperConfig: SwipeableOptions = {
  onSwiped: (event) => {
    snakeMovement = gameController.getSnakeMovement(event.dir)
  },
  preventDefaultTouchmoveEvent: true,
  trackTouch: true,
  trackMouse: true,
}

const Index: React.FC = () => {
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
    snakeMovement = gameController.getSnakeMovement(direction as GameControls)
  }

  function runGame() {
    intervalId = setInterval(() => {
      const nextGameState = gameController.getNextGameState(
        snakeMovement ? snakeMovement : gameState.snakeMovement,
      )

      if (nextGameState) {
        setGameState(nextGameState)
      } else {
        clearInterval(intervalId)
        setIsModalOpen(true)
      }
    }, FRAMES_PER_SECOND)
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
    gameController = new GameController()
    const newGame = gameController.getCurrentGameState()
    snakeMovement = newGame.snakeMovement
    setGameState(newGame)
    setIsModalOpen(false)
    runGame()
  }

  const handlers = useSwipeable(swiperConfig)

  return (
    <section>
      <div className={styles.size} {...handlers}>
        <Screen gameState={gameState} gridSize={gameController.gridSize} cellSize={CELL_SIZE} />
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

export default Index
