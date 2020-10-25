import React from 'react'

import styles from './Screen.module.css'

type ScreenProps = {
  gameState: PacManGame.State
}

export const Screen: React.FC<ScreenProps> = ({ gameState }) => {
  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.game}>
          {gameState.gameBoard.map((piece, index) => (
            <div
              key={index}
              className={`
                ${styles.square}
                ${piece.attributes.map((attr) => styles[attr]).join(' ')}
              `}
              style={{ ...piece.style }}
            />
          ))}
        </div>
        <div className={styles.score}>{gameState.score}</div>
      </div>
    </div>
  )
}
