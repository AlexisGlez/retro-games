/// <reference path="./Chess.d.ts" />

import React from 'react'
import Head from 'next/head'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
import { constants } from '@app-src/shared/constants'

import { ChessController } from './controller/ChessController'
import { Screen } from './components/Screen'

let gameController: ChessController | undefined
let moveFrom: ChessGame.Move | null

export const Chess: React.FC<ChessGameProps> = ({}) => {
  if (!gameController) {
    gameController = new ChessController()
  }

  const [gameState, setGameState] = React.useState<ChessGame.State>(gameController.getGameState())
  const [isGameOver, setIsGameOver] = React.useState(false)

  React.useEffect(() => {
    return () => {
      gameController = undefined
    }
  }, [])

  const resetGame = React.useCallback(() => {
    gameController = new ChessController()
    setGameState(gameController.getGameState())
    setIsGameOver(false)
  }, [])

  const returnToHome = useReturnToHome()

  const onCellInteraction = React.useCallback(
    (row: number, col: number) => {
      if (!moveFrom) {
        if (!gameController!.isCurrentPlayerPieceAtPos({ row, col })) {
          return
        }

        moveFrom = { row, col }
        return
      }

      const nextGameState = gameController!.getNextGameState(moveFrom, { row, col })
      moveFrom = null
      setGameState(nextGameState)
      setIsGameOver(nextGameState.gameStatus !== 'ongoing')
    },
    [gameController],
  )

  return (
    <>
      <Head>
        <title>Chess</title>
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

Chess.displayName = constants.pages.Chess
