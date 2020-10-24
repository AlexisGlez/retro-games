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
                ${styles.square} ${styles[piece.type]}
                ${piece.attributes.map((attr) => styles[attr]).join(' ')}
              `}
              style={piece.style}
            />
          ))}
        </div>
        <div className={styles.score}></div>
      </div>
    </div>
  )
}
