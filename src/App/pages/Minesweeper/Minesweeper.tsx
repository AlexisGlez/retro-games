/// <reference path="./Minesweeper.d.ts" />

import React from 'react'

import { GameOverModal } from '@app-shared/components/GameOverModal'
import { FullScreen } from '@app-shared/components/FullScreen'
import { useWindowResize } from '@app-shared/hooks/useWindowResize'
import { useReturnToHome } from '@app-shared/hooks/useReturnToHome'

import { MinesweeperGameController } from './controller/MinesweeperGameController'
import { Screen } from './components/Screen'

let gameController: MinesweeperGameController | undefined

export const Minesweeper: React.FC<MinesweeperGameProps> = ({ cellSize = 150, bombs = 3 }) => {
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
    <section>
      <FullScreen>
        {gameController && (
          <Screen cellSize={cellSize} gameGrid={gameState} onCellInteraction={onCellInteraction} />
        )}
      </FullScreen>
      {isGameOver && (
        <GameOverModal onReturnHomeClick={returnToHome} onPlayAgainClick={resetGame} />
      )}
    </section>
  )
}
