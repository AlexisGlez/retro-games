import React from 'react'

import { GameState, GridSize } from '@app-src/GameController'

import styles from './Screen.module.css'

interface ScreenProps {
  gameState: GameState
  gridSize: GridSize
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
  }, [props.gameState])

  const paintGame = (canvasContext: CanvasRenderingContext2D) => {
    // paint background
    canvasContext.fillStyle = '#231F20'
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height)

    // paint food
    canvasContext.fillStyle = '#E66916'
    canvasContext.fillRect(
      props.gameState.foodLocation.x * props.gameState.cellSize,
      props.gameState.foodLocation.y * props.gameState.cellSize,
      props.gameState.cellSize,
      props.gameState.cellSize,
    )

    // paint snake
    canvasContext.fillStyle = '#C2C2C2'
    props.gameState.snakeBody.forEach((snakePiece) => {
      canvasContext.fillRect(
        snakePiece.x * props.gameState.cellSize,
        snakePiece.y * props.gameState.cellSize,
        props.gameState.cellSize,
        props.gameState.cellSize,
      )
    })
  }

  return <canvas ref={canvasRef} className={styles.screen} />
}

export default Screen
