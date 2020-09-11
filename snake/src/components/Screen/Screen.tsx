import React from "react"

import { GameState } from '@app-src/GameController'

interface ScreenProps {
  gameState: GameState;
}

const Screen: React.FC<ScreenProps> = (props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!

    canvas.width = 600
    canvas.height = 600

    const animationId = requestAnimationFrame(() => paintGame(context))

    return () => { window.cancelAnimationFrame(animationId) }
  }, [props.gameState])

  const paintGame = (canvasContext: CanvasRenderingContext2D) => {
    const size = canvasContext.canvas.width / props.gameState.cellSize

    // paint background
    canvasContext.fillStyle = '#231F20'
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height)

    // paint food
    canvasContext.fillStyle = '#E66916'
    canvasContext.fillRect(props.gameState.foodLocation.x * size, props.gameState.foodLocation.y * size, size, size)

    // paint snake
    canvasContext.fillStyle = '#C2C2C2'
    props.gameState.snakeBody.forEach(snakePiece => {
      canvasContext.fillRect(snakePiece.x * size, snakePiece.y * size, size, size)
    })
  }

  return <canvas ref={canvasRef} />
}

export default Screen
