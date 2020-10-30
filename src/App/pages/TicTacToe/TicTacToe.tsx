/// <reference path="./TicTacToe.d.ts" />

import React from 'react'
import Head from 'next/head'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'
// import { constants } from '@app-src/shared/constants'

import { TicTacToeController } from './controller/TicTacToeController'
import { Screen } from './components/Screen'

let gameController: TicTacToeController | undefined

export const TicTacToe: React.FC<TicTacToeGameProps> = ({}) => {
  const [, setGameState] = React.useState<{}>({})
  const [isGameOver, setIsGameOver] = React.useState(false)

  React.useEffect(() => {
    gameController = new TicTacToeController()
    setGameState({})

    return () => {
      gameController = undefined
    }
  }, [])

  const resetGame = React.useCallback(() => {
    gameController = new TicTacToeController()
    setGameState({})
    setIsGameOver(false)
  }, [])

  const returnToHome = useReturnToHome()

  const onCellInteraction = React.useCallback(
    (row: number, col: number) => {
      // TODO
      console.log(row, col)
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
          {gameController && <Screen onCellInteraction={onCellInteraction} />}
        </FullScreen>
        {isGameOver && (
          <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
        )}
      </section>
    </>
  )
}

// TODO:
// TicTacToe.displayName = constants.pages.ticTacToe
