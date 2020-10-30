import React from 'react'

import { getRowAndColFromElement } from '@app-shared/utils/getRowAndColFromElement'

import styles from './Screen.module.css'

type ScreenProps = {
  onCellInteraction: (row: number, col: number) => void
}

export const Screen: React.FC<ScreenProps> = ({ onCellInteraction }) => {
  const onCellClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const data = getRowAndColFromElement(event.target as HTMLElement)
    onCellInteraction(data.row, data.col)
  }

  return (
    <div className={styles.screen} onClick={onCellClick}>
      Hello 🌎
    </div>
  )
}
