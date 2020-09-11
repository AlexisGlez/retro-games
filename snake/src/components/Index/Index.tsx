import React from 'react'

import Screen from 'src/components/Screen'
import GameController from '@app-src/GameController'

import styles from './Index.module.css'

const FRAME_RATE = 10
const FRAMES_PER_SECOND = 1000 / FRAME_RATE

const gameController = new GameController()

const Index: React.FC = () => {
  const [gameState, setGameState] = React.useState(gameController.getCurrentGameState())

  let snakeMovement = gameState.snakeMovement
  const onKeyDownListener = (event: KeyboardEvent) => {
    snakeMovement = gameController.getSnakeDirection(event.keyCode)
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

    return () => { clearInterval(intervalId) }
  }, [])

  return (
    <section>
      <div className={styles.size}>
        <Screen gameState={gameState} />
      </div>
    </section>
  );
}

export default Index
