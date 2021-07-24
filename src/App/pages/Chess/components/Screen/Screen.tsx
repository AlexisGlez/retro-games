import React from 'react'

import { getRowAndColFromElement } from '@app-shared/utils/getRowAndColFromElement'

import styles from './Screen.module.css'

type ScreenProps = {
  onCellInteraction: (row: number, col: number) => void
  gameState: ChessGame.State
}

export const Screen: React.FC<ScreenProps> = ({ onCellInteraction, gameState }) => {
  const onCellClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const data = getRowAndColFromElement(event.target as HTMLElement)
    onCellInteraction(data.row, data.col)
  }

  return (
    <div className={styles.screen} onClick={onCellClick}>
      {gameState.game.map((row, rowNum) =>
        row.map((col, colNum) => (
          <button
            key={`${rowNum}-${colNum}`}
            data-row={rowNum}
            data-col={colNum}
            style={{ backgroundImage: `url(${col.imageUrl})` }}
            className={styles.button}
          ></button>
        )),
      )}
    </div>
  )
}
