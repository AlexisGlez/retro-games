/// <reference path="./Minesweeper.d.ts" />

import React from 'react'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { useRouter } from 'next/router'

import { MinesweeperGameController } from './controller/MinesweeperGameController'

let gameController: MinesweeperGameController | undefined

export const Minesweeper: React.FC<MinesweeperGameProps> = ({ cellSize = 20 }) => {
  if (!gameController) {
    gameController = new MinesweeperGameController(cellSize)
  }

  const [isGameOver, setIsGameOver] = React.useState(false)

  const resetGame = React.useCallback(() => {
    gameController = new MinesweeperGameController(cellSize)
    setIsGameOver(false)
  }, [])

  const router = useRouter()
  const returnToHome = React.useCallback(() => {
    router.back()
  }, [router])

  return (
    <section>
      <div>Hello 🌎</div>
      {isGameOver && (
        <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
      )}
    </section>
  )
}
