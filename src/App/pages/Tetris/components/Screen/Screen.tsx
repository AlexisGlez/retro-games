import React from 'react'
import { Box } from '@chakra-ui/core'

import styles from './Screen.module.css'

type ScreenProps = {
  gameState: TetrisGame.State
}

const Cell = React.memo(({ shape }: { shape: TetrisGame.TetrominoesShapes }) => (
  <Box data-tetrominoe-type={shape} />
))

export const Screen: React.FC<ScreenProps> = ({ gameState }) => {
  return (
    <Box
      className={styles.screen}
      gridTemplateColumns={`repeat(${gameState.gameWidth}, ${gameState.cellSize}px)`}
      gridTemplateRows={`repeat(${gameState.gameHeight}, ${gameState.cellSize}px)`}
    >
      {gameState.game.map((row) => row.map((cell, i) => <Cell key={i} shape={cell[0]} />))}
    </Box>
  )
}
