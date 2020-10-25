/// <reference path="./Minesweeper.d.ts" />

import React from 'react'
import Head from 'next/head'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { useWindowResize } from '@app-shared/hooks/useWindowResize'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
import { constants } from '@app-src/shared/constants'

import { MinesweeperGameController } from './controller/MinesweeperGameController'
import { Screen } from './components/Screen'

let gameController: MinesweeperGameController | undefined

function calculateCellSize(bombs: number): number {
  if (bombs <= 5) {
    return 150
  }

  if (bombs <= 10) {
    return 120
  }

  if (bombs <= 20) {
    return 90
  }

  if (bombs <= 35) {
    return 70
  }

  if (bombs <= 50) {
    return 60
  }

  if (bombs <= 70) {
    return 50
  }

  if (bombs <= 120) {
    return 40
  }

  return 30
}

export const Minesweeper: React.FC<MinesweeperGameProps> = ({ bombs = 3 }) => {
  const cellSize = calculateCellSize(bombs)

  const [gameState, setGameState] = React.useState<Array<Array<MinesweeperGame.CellData>>>([])
  const [isGameOver, setIsGameOver] = React.useState(false)

  React.useEffect(() => {
    gameController = new MinesweeperGameController(cellSize, bombs)
    setGameState(gameController.getGameGrid())

    return () => {
      gameController = undefined
    }
  }, [])

  const resetGame = React.useCallback(() => {
    gameController = new MinesweeperGameController(cellSize, bombs)
    setGameState(gameController.getGameGrid())
    setIsGameOver(false)
  }, [])

  useWindowResize(resetGame)

  const returnToHome = useReturnToHome()

  const onCellInteraction = React.useCallback(
    (action: MinesweeperGame.Action, row: number, col: number) => {
      const nextGameState = gameController!.getNextGameState(action, row, col)
      setGameState([...nextGameState.game])
      setIsGameOver(nextGameState.gameStatus !== 'ongoing')
    },
    [gameController],
  )

  return (
    <>
      <Head>
        <title>Minesweeper</title>
      </Head>
      <section>
        <FullScreen>
          {gameController && (
            <Screen
              cellSize={cellSize}
              gameGrid={gameState}
              onCellInteraction={onCellInteraction}
            />
          )}
        </FullScreen>
        {isGameOver && (
          <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
        )}
      </section>
    </>
  )
}

Minesweeper.displayName = constants.pages.minesweeper
