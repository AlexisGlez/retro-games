import React from 'react'

import { GameState, GridSize } from '@app-snake/GameController'
import theme from '@app-shared/theme'

import styles from './Screen.module.css'

interface ScreenProps {
  gameState: GameState
  gridSize: GridSize
  cellSize: number
}

const Screen: React.FC<ScreenProps> = ({ cellSize, gameState, gridSize }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!

    if (canvas.width !== gridSize.width || canvas.height !== gridSize.height) {
      canvas.width = gridSize.width
      canvas.height = gridSize.height
    }

    const animationId = requestAnimationFrame(() => paintGame(context))

    return () => {
      window.cancelAnimationFrame(animationId)
    }
  }, [gameState, cellSize, gridSize])

  const paintGame = (canvasContext: CanvasRenderingContext2D) => {
    // paint background
    canvasContext.fillStyle = theme.colors.gray[800]
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height)

    // paint food
    canvasContext.fillStyle = theme.colors.red[400]
    canvasContext.fillRect(
      gameState.foodPosition.x * cellSize,
      gameState.foodPosition.y * cellSize,
      cellSize,
      cellSize,
    )

    // paint snake
    canvasContext.fillStyle = theme.colors.whiteAlpha[900]
    gameState.snakeBody.forEach((snakePiece) => {
      canvasContext.fillRect(snakePiece.x * cellSize, snakePiece.y * cellSize, cellSize, cellSize)
    })
  }

  return <canvas ref={canvasRef} className={styles.screen} />
}

export default Screen
