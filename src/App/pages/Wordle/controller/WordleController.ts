/// <reference path="./WordleController.d.ts" />
import axios, { AxiosRequestConfig } from 'axios'

import defaultWords from './words.json'

const getRandomWordsRequest: AxiosRequestConfig = {
  method: 'GET',
  url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
  params: { count: '20', wordLength: '5' },
  headers: {
    'x-rapidapi-host': 'random-words5.p.rapidapi.com',
    'x-rapidapi-key': '20c359e3aemshb39bc8174e9b5e4p154b57jsn672c5754ee1e',
  },
}

export class WordleController {
  public static keys = {
    topRow: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    middleRow: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    bottomRow: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER', '«'],
  }

  private game: WordleGame.Game = []
  private gameStatus: GameStatus
  private errorState?: WordleGame.ErrorState
  private processedLetters: { [key: string]: WordleGame.Cell['status'] }

  private targetWord: string = ''
  private targetWordChars: { [key: string]: number } = {}
  private wordsList: string[] = []

  private currentRow = 0
  private currentColumn = 0

  public constructor(private difficulty: WordleGameProps['difficulty']) {
    this.generateRandomWords()
    this.initializeBoard()
    this.processedLetters = {}
    this.gameStatus = 'ongoing'
  }

  private async generateRandomWords() {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const response = await axios.request(getRandomWordsRequest)
      this.wordsList = [
        ...defaultWords,
        ...(response.data as string[]).map((word) => word.toLowerCase()),
      ]
    } catch (error) {
      console.error(error)
      this.wordsList = defaultWords
    }

    this.targetWord = this.wordsList[Math.floor(Math.random() * this.wordsList.length)]

    this.targetWordChars = this.targetWord.split('').reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
  }

  private initializeBoard() {
    let numberOfAttempts: number

    if (this.difficulty === 'easy') {
      numberOfAttempts = 10
    } else if (this.difficulty === 'normal') {
      numberOfAttempts = 6
    } else if (this.difficulty === 'hard') {
      numberOfAttempts = 5
    } else {
      numberOfAttempts = 3
    }

    this.game = []
    for (let i = 0; i < numberOfAttempts; i += 1) {
      this.game[i] = []
      for (let j = 0; j < 5; j += 1) {
        this.game[i].push({ letter: '' })
      }
    }
  }

  public getGameState(): WordleGame.State {
    return {
      game: this.game,
      gameStatus: this.gameStatus,
      errorState: this.errorState,
      processedLetters: this.processedLetters,
      currentRow: this.currentRow,
      targetWord: this.gameStatus !== 'ongoing' ? this.targetWord : '',
    }
  }

  public getNextGameState(letter: string): WordleGame.State {
    this.errorState = undefined
    if (letter === 'ENTER') {
      this.handleEnter()
    } else if (letter === '«') {
      this.handleDeleteLetter()
    } else if (this.currentRow < this.game.length && this.currentColumn < this.game[0].length) {
      this.addLetter(letter)
    }

    return this.getGameState()
  }

  private handleEnter() {
    if (this.currentColumn !== this.game[0].length) {
      this.errorState = 'not-enough-letters'
      return
    }

    const currentWord = this.game[this.currentRow]
      .map((cell) => cell.letter)
      .join('')
      .toLowerCase()

    if (!this.wordsList.includes(currentWord)) {
      this.errorState = 'not-word-found'
      return
    }

    this.assignStateToCellsInCurrentRow(currentWord)
    this.currentRow += 1
    this.currentColumn = 0

    if (currentWord === this.targetWord) {
      this.gameStatus = 'win'
    } else if (this.currentRow >= this.game.length) {
      this.gameStatus = 'lose'
    }
  }

  private assignStateToCellsInCurrentRow(currentWord: string) {
    const currentRow = this.game[this.currentRow]

    const targetWordCharsCopy = { ...this.targetWordChars }

    for (let col = 0; col < currentRow.length; col += 1) {
      const currentChar = currentWord.charAt(col)
      const currentCell = currentRow[col]

      if (currentChar === this.targetWord.charAt(col)) {
        currentCell.status = 'correct'
        targetWordCharsCopy[currentChar] -= 1
      }
    }

    for (let col = 0; col < currentRow.length; col += 1) {
      const currentChar = currentWord.charAt(col)
      const currentCell = currentRow[col]

      if (currentCell.status) {
        continue
      }

      if (this.targetWord.includes(currentChar) && targetWordCharsCopy[currentChar] > 0) {
        currentCell.status = 'almost'
        targetWordCharsCopy[currentChar] -= 1
      } else {
        currentCell.status = 'incorrect'
      }
    }

    for (let col = 0; col < currentRow.length; col += 1) {
      const currentCell = currentRow[col]

      if (!this.processedLetters[currentCell.letter]) {
        this.processedLetters[currentCell.letter] = currentCell.status
      } else if (currentCell.status === 'correct') {
        this.processedLetters[currentCell.letter] = 'correct'
      } else if (
        this.processedLetters[currentCell.letter] !== 'correct' &&
        currentCell.status === 'almost'
      ) {
        this.processedLetters[currentCell.letter] = 'almost'
      }
    }
  }

  private handleDeleteLetter() {
    if (this.currentColumn === 0) {
      return
    }

    this.game[this.currentRow][this.currentColumn - 1].letter = ''
    this.currentColumn -= 1
  }

  private addLetter(letter: string) {
    this.game[this.currentRow][this.currentColumn].letter = letter
    this.currentColumn += 1
  }
}
