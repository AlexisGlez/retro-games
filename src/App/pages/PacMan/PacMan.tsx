/// <reference path="./PacMan.d.ts" />

import React from 'react'
import Head from 'next/head'
import { SwipeableOptions, useSwipeable } from 'react-swipeable'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { constants } from '@app-shared/constants'
import { useWindowResize } from '@app-shared/hooks/useWindowResize'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
import { useArrowKeysListener } from '@app-shared/hooks/useKeyDownListener'

import { Screen } from './components/Screen'
import { PacManController } from './controller/PacManController'

const FRAME_RATE = 10
const POWER_PILL_DURATION = 8000

let gameController: PacManController | undefined
let intervalId: NodeJS.Timeout
let powerPillTimerId: NodeJS.Timeout
let startGameSoundHasPlayed = false

function resetGlobalVariables() {
  clearTimeout(powerPillTimerId)
  clearInterval(intervalId)
  gameController = undefined
}

function playStartGameSound() {
  if (!startGameSoundHasPlayed) {
    playSound('/sounds/pacman/game_start.wav')
    startGameSoundHasPlayed = true
  }
}

function playSound(src: string) {
  const soundEffect = new Audio(src)
  soundEffect.play()
}

const swiperConfig: SwipeableOptions = {
  onSwiped: (event) => {
    playStartGameSound()
    gameController!.requestArrowMovement(event.dir)
  },
  preventDefaultTouchmoveEvent: true,
  trackTouch: true,
  trackMouse: true,
}

export const PacMan: React.FC<PacManGameProps> = ({ gameSpeed = 1, level = 'easy' }) => {
  if (!gameController) {
    gameController = new PacManController(level)
  }

  const [gameState, setGameState] = React.useState(gameController.getGameState())
  const [isGameOver, setIsGameOver] = React.useState(false)

  React.useEffect(() => {
    runGame()

    const initialSoundCallback = () => {
      playStartGameSound()
      document.removeEventListener('keydown', initialSoundCallback)
    }

    document.addEventListener('keydown', initialSoundCallback)

    return resetGlobalVariables
  }, [])

  const runGame = React.useCallback(() => {
    intervalId = setInterval(() => {
      const nextGameState = gameController!.getNextGameState()

      if (nextGameState.latestAction === 'pill-eaten') {
        playSound('/sounds/pacman/pill.wav')

        clearTimeout(powerPillTimerId)
        powerPillTimerId = setTimeout(() => {
          gameController!.powerPillTimeExpired()
        }, POWER_PILL_DURATION)
      } else if (nextGameState.latestAction === 'dot-eaten') {
        playSound('/sounds/pacman/munch.wav')
      } else if (nextGameState.latestAction === 'ghost-eaten') {
        playSound('/sounds/pacman/eat_ghost.wav')
      }

      setGameState(nextGameState)

      if (nextGameState.gameStatus === 'ongoing') {
        return
      }

      playSound('/sounds/pacman/death.wav')
      resetGlobalVariables()
      setIsGameOver(true)
    }, 1000 / (FRAME_RATE * gameSpeed))
  }, [gameController])

  const resetGame = React.useCallback(() => {
    resetGlobalVariables()
    gameController = new PacManController(level)
    setGameState(gameController.getGameState())
    setIsGameOver(false)
    runGame()
  }, [intervalId])

  useWindowResize(resetGame)

  useArrowKeysListener(gameController.requestArrowMovement)

  const returnToHome = useReturnToHome()

  const handlers = useSwipeable(swiperConfig)

  return (
    <>
      <Head>
        <title>PacMan</title>
      </Head>
      <section>
        <FullScreen containerProps={handlers}>
          <Screen gameState={gameState} />
        </FullScreen>
        {isGameOver && (
          <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
        )}
      </section>
    </>
  )
}

PacMan.displayName = constants.pages.pacMan
