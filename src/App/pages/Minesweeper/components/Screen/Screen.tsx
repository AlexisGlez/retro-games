import React from 'react'

import styles from './Screen.module.css'

type ScreenProps = {
  cellSize: number
  gameGrid: Array<Array<MinesweeperGame.CellData>>
  onCellInteraction: (action: MinesweeperGame.Action, row: number, col: number) => void
}

export const Screen: React.FC<ScreenProps> = ({ cellSize, gameGrid, onCellInteraction }) => {
  const triggerGameStateChange = (element: HTMLElement, action: MinesweeperGame.Action) => {
    const dataRow = element.getAttribute('data-row')
    const dataCol = element.getAttribute('data-col')

    if (dataRow == null || dataCol == null) {
      return
    }

    const row = parseInt(dataRow)
    const col = parseInt(dataCol)

    if (Number.isNaN(row) || Number.isNaN(col)) {
      return
    }

    onCellInteraction(action, row, col)
  }

  const onCellClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    triggerGameStateChange(event.target as HTMLElement, 'click')
  }

  const onCellRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    triggerGameStateChange(event.target as HTMLElement, 'flag')
  }

  return (
    <div className={styles.screen} onClick={onCellClick} onContextMenu={onCellRightClick}>
      {gameGrid.map((row, rowNum) =>
        row.map((cell, colNum) => (
          <button
            key={`${rowNum - colNum}`}
            data-row={rowNum}
            data-col={colNum}
            data-cell-state={cell.state}
            className={styles.button}
            style={{ width: cellSize, height: cellSize }}
          >
            {cell.state === 'clicked' ? cell.value : ''}
            {cell.state === 'flagged' ? '🚩' : ''}
          </button>
        )),
      )}
    </div>
  )
}
