import React from 'react'

import { getRowAndColFromElement } from '@app-shared/utils/getRowAndColFromElement'

import styles from './Screen.module.css'

type ScreenProps = {
  onCellInteraction: (row: number, col: number) => void
  gameState: TicTactToeGame.State
}

export const Screen: React.FC<ScreenProps> = ({ onCellInteraction, gameState }) => {
  const onCellClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const data = getRowAndColFromElement(event.target as HTMLElement)
    onCellInteraction(data.row, data.col)
  }

  return (
    <div className={styles.screen} onClick={onCellClick}>
      {gameState.game.map((value, index) => (
        <button key={`${index}`} data-row={index} data-col={index} className={styles.button}>
          {value}
        </button>
      ))}
      {gameState.winName && <div className={styles[gameState.winName]} />}
    </div>
  )
}
