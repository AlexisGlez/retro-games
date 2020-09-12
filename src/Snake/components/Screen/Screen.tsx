import React from 'react'

import { GameState, GridSize } from '@app-snake/GameController'

import styles from './Screen.module.css'

interface ScreenProps {
  gameState: GameState
  gridSize: GridSize
  cellSize: number
}

const Screen: React.FC<ScreenProps> = (props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!

    if (canvas.width !== props.gridSize.width || canvas.height !== props.gridSize.height) {
      canvas.width = props.gridSize.width
      canvas.height = props.gridSize.height
    }

    const animationId = requestAnimationFrame(() => paintGame(context))

    return () => {
      window.cancelAnimationFrame(animationId)
    }
  }, [props.gameState, props.cellSize, props.gridSize])

  const paintGame = (canvasContext: CanvasRenderingContext2D) => {
    // paint background
    canvasContext.fillStyle = '#231F20'
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height)

    // paint food
    canvasContext.fillStyle = '#E66916'
    canvasContext.fillRect(
      props.gameState.foodPosition.x * props.cellSize,
      props.gameState.foodPosition.y * props.cellSize,
      props.cellSize,
      props.cellSize,
    )

    // paint snake
    canvasContext.fillStyle = '#C2C2C2'
    props.gameState.snakeBody.forEach((snakePiece) => {
      canvasContext.fillRect(
        snakePiece.x * props.cellSize,
        snakePiece.y * props.cellSize,
        props.cellSize,
        props.cellSize,
      )
    })
  }

  return <canvas ref={canvasRef} className={styles.screen} />
}

export default Screen
