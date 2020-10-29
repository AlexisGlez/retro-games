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
    playSound('gameStartSound')
    startGameSoundHasPlayed = true
  }
}

function playSound(id: string) {
  const audio = document.getElementById(id) as HTMLAudioElement

  if (audio != null) {
    audio.play()
  }
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
      document.removeEventListener('click', initialSoundCallback)
    }

    document.addEventListener('keydown', initialSoundCallback)
    document.addEventListener('click', initialSoundCallback)

    return resetGlobalVariables
  }, [])

  const runGame = React.useCallback(() => {
    intervalId = setInterval(() => {
      const nextGameState = gameController!.getNextGameState()

      if (nextGameState.latestAction === 'pill-eaten') {
        playSound('pillSound')

        clearTimeout(powerPillTimerId)
        powerPillTimerId = setTimeout(() => {
          gameController!.powerPillTimeExpired()
        }, POWER_PILL_DURATION)
      } else if (nextGameState.latestAction === 'dot-eaten') {
        playSound('munchSound')
      } else if (nextGameState.latestAction === 'ghost-eaten') {
        playSound('eatGhostSound')
      }

      setGameState(nextGameState)

      if (nextGameState.gameStatus === 'ongoing') {
        return
      }

      playSound('deathSound')
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
        <audio id="gameStartSound" key="gameStartSound">
          <source src="/sounds/pacman/game_start.wav" />
        </audio>
        <audio id="pillSound" key="pillSound">
          <source src="/sounds/pacman/pill.wav" />
        </audio>
        <audio id="munchSound" key="munchSound">
          <source src="/sounds/pacman/munch.wav" />
        </audio>
        <audio id="eatGhostSound" key="eatGhostSound">
          <source src="/sounds/pacman/eat_ghost.wav" />
        </audio>
        <audio id="deathSound" key="deathSound">
          <source src="/sounds/pacman/death.wav" />
        </audio>
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
