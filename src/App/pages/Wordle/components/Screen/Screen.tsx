import React from 'react'
import { Button, Box, Flex, Text } from '@chakra-ui/core'

import styles from './Screen.module.css'

type ScreenProps = {
  gameState: WordleGame.State
  keys: {
    topRow: string[]
    middleRow: string[]
    bottomRow: string[]
  }
  onKeyClick: (key: string) => void
}

export const Screen: React.FC<ScreenProps> = ({ keys, gameState, onKeyClick }) => {
  React.useEffect(() => {
    // Add classNames via timeouts to handle animations
    const currentRow = document.querySelector(`#row-${gameState.currentRow - 1}`)?.childNodes

    currentRow?.forEach((cell, index) => {
      setTimeout(() => {
        (cell as any).classList.add(styles.cell)

        const status = (cell as any).getAttribute('data-status') as WordleGame.Cell['status']
        if (status) {
          (cell as any).classList.add(styles.flip)
        }
      }, 500 * index)
    })

    setTimeout(() => {
      Object.keys(gameState.processedLetters).forEach((key) => {
        const currentLetter = document.getElementById(key)

        if (!currentLetter?.classList.contains(styles.cell)) {
          currentLetter?.classList.add(styles.cell)
        }
      })
    }, 2000)

  }, [gameState.currentRow])

  React.useEffect(() => {
    const onKeyBoardPress = (event: KeyboardEvent) => {
      const keyPressed = event.key.toUpperCase() === 'BACKSPACE' ? '«' : event.key.toUpperCase();

      if (keys.topRow.includes(keyPressed) || keys.middleRow.includes(keyPressed) || keys.bottomRow.includes(keyPressed)) {
        onKeyClick(keyPressed)
      }
    }

    document.addEventListener('keydown', onKeyBoardPress, false);

    return () => { document.removeEventListener('keydown', onKeyBoardPress) }
  }, [])

  return (
    <div className={styles.screen}>
      <div className={styles.title}>
        <h1>Wordle</h1>
      </div>
      <Text className={styles.targetWord} padding={gameState.targetWord ? '1rem' : ''}>{gameState.targetWord}</Text>
      <div className={styles.tile}>
        {gameState.game.map((row, rowNum) => (
          <Flex 
            key={rowNum}
            id={`row-${rowNum}`}
            className={rowNum === gameState.currentRow && gameState.errorState === 'not-enough-letters' ? styles.shake : ''}
          >
            {row.map((_, colNum) => (
              <Box
                key={colNum}
                width={62}
                height={62}
                border={gameState.game[rowNum][colNum].letter ? 3 : 1}
                data-col={colNum}
                data-status={gameState.game[rowNum][colNum].status}
                borderStyle="solid"
                margin="2px"
              >
                <p
                  key={`${rowNum}-${colNum}`}
                  data-row={rowNum}
                  data-col={colNum}
                  className={styles.letter}
                >
                  {gameState.game[rowNum][colNum].letter}
                </p>
              </Box>
            ))}
          </Flex>
        ))}
      </div>
      <div className={styles.keyboard}>
        {Object.keys(keys).map((keyName) => (
          <div className={styles.key} key={keyName}>
            {(keys as any)[keyName].map((key: string) => (
              <Button
                key={`${key}-${gameState.processedLetters[key]}`}
                id={key}
                onClick={() => onKeyClick(key)}
                margin="2px"
                data-status={gameState.processedLetters[key]}
                className={styles.letter}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
