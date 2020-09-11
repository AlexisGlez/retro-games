import React from 'react'
import debounce from 'lodash.debounce'

import Screen from 'src/components/Screen'
import GameController, { GameControls } from '@app-src/GameController'

import styles from './Index.module.css'

const FRAME_RATE = 10
const FRAMES_PER_SECOND = 1000 / FRAME_RATE

let gameController = new GameController()

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

  let snakeMovement = gameState.snakeMovement
  const onKeyDownListener = (event: KeyboardEvent) => {
    snakeMovement = gameController.getSnakeDirection(event.key as GameControls)
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

  return (
    <section>
      <div className={styles.size}>
        <Screen gameState={gameState} gridSize={gameController.gridSize} />
      </div>
    </section>
  )
}

export default Index
