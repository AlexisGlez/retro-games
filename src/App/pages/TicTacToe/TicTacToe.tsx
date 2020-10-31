/// <reference path="./TicTacToe.d.ts" />

import React from 'react'
import Head from 'next/head'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
import { constants } from '@app-src/shared/constants'

import { TicTacToeController } from './controller/TicTacToeController'
import { Screen } from './components/Screen'

let gameController: TicTacToeController | undefined

export const TicTacToe: React.FC<TicTacToeGameProps> = ({}) => {
  if (!gameController) {
    gameController = new TicTacToeController()
  }

  const [gameState, setGameState] = React.useState<TicTactToeGame.State>(
    gameController.getGameState(),
  )
  const [isGameOver, setIsGameOver] = React.useState(false)

  React.useEffect(() => {
    return () => {
      gameController = undefined
    }
  }, [])

  const resetGame = React.useCallback(() => {
    gameController = new TicTacToeController()
    setGameState(gameController.getGameState())
    setIsGameOver(false)
  }, [])

  const returnToHome = useReturnToHome()

  const onCellInteraction = React.useCallback(
    (cell: number) => {
      const nextGameState = gameController!.getNextGameState(cell)
      setGameState(nextGameState)
      setIsGameOver(nextGameState.gameStatus !== 'ongoing')
    },
    [gameController],
  )

  return (
    <>
      <Head>
        <title>TicTacToe</title>
      </Head>
      <section>
        <FullScreen>
          {gameController && <Screen onCellInteraction={onCellInteraction} gameState={gameState} />}
        </FullScreen>
        {isGameOver && (
          <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
        )}
      </section>
    </>
  )
}

TicTacToe.displayName = constants.pages.TicTacToe
