import React from 'react'
import debounce from 'lodash.debounce'
import { SwipeableOptions, useSwipeable } from 'react-swipeable'

import Screen from 'src/components/Screen'
import GameController, { GameControls, CELL_SIZE, Coordinate } from '@app-src/GameController'

import styles from './Index.module.css'

const FRAME_RATE = 10
const FRAMES_PER_SECOND = 1000 / FRAME_RATE

let gameController = new GameController()
let snakeMovement: Coordinate

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

  React.useEffect(() => {
    const handleWindowResize = debounce(() => {
      gameController = new GameController()
      setGameState(gameController.getCurrentGameState())
    }, 250)

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  })

  snakeMovement = gameState.snakeMovement
  const onKeyDownListener = (event: KeyboardEvent) => {
    // If use presses the arrow keys, event.key will have the following values:
    // ArrowUp, ArrowDown, ArrowLeft, or ArrowRight.
    const direction = event.key.replace('Arrow', '')
    snakeMovement = gameController.getSnakeMovement(direction as GameControls)
  }

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDownListener)

    const intervalId = setInterval(() => {
      const nextGameState = gameController.getNextGameState(snakeMovement)

      if (nextGameState) {
        setGameState(nextGameState)
      } else {
        clearInterval(intervalId)
      }
    }, FRAMES_PER_SECOND)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const handlers = useSwipeable(swiperConfig)

  return (
    <section>
      <div className={styles.size} {...handlers}>
        <Screen gameState={gameState} gridSize={gameController.gridSize} cellSize={CELL_SIZE} />
      </div>
    </section>
  )
}

export default Index
