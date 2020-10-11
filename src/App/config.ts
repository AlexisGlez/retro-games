import { constants } from '@app-shared/constants'

type PagesConfig = {
  [constants.pages.home]: HomeData
  [constants.pages.snake]: SnakeGameProps
  [constants.pages.minesweeper]: MinesweeperGameProps
}

export const pagesConfig: PagesConfig = {
  [constants.pages.home]: {
    games: {
      [constants.pages.snake]: {
        gameName: 'Snake',
        gamePageName: 'snake',
        imageName: 'snake_demo',
        imageAlt: 'Snake Game',
      },
      [constants.pages.minesweeper]: {
        gameName: 'Minesweeper',
        gamePageName: 'minesweeper',
        imageName: 'minesweeper_demo',
        imageAlt: 'Minesweeper Game',
      },
    },
  },
  [constants.pages.snake]: {
    cellSize: 20,
    gameSpeed: 1,
  },
  [constants.pages.minesweeper]: {
    bombs: 3,
  },
}

type GamesSettings = {
  [constants.pages.snake]: Array<GameSetting>
  [constants.pages.minesweeper]: Array<GameSetting>
}

export const gamesSettings: GamesSettings = {
  [constants.pages.snake]: [
    {
      propertyName: 'cellSize',
      displayName: 'Cell Size',
      type: 'number',
      helperText: 'The size of each cell in the board, the food, and snake',
      currentValue: pagesConfig[constants.pages.snake].cellSize,
      step: 1,
      min: 1,
      max: 100,
    },
    {
      propertyName: 'gameSpeed',
      displayName: 'Game Speed',
      helperText: "The snake's speed (use with caution)",
      type: 'number',
      currentValue: pagesConfig[constants.pages.snake].gameSpeed,
      step: 1,
      min: 1,
      max: 9,
    },
  ],
  [constants.pages.minesweeper]: [
    {
      propertyName: 'bombs',
      displayName: 'Bombs Amount',
      type: 'number',
      helperText: 'The number of bombs to be placed in the game',
      currentValue: pagesConfig[constants.pages.minesweeper].bombs,
      step: 1,
      min: 3,
      max: 150,
    },
  ]
}

type GamesHelp = {
  [constants.pages.snake]: GameHelpModal.GameHelp
  [constants.pages.minesweeper]: GameHelpModal.GameHelp
}

export const gamesHelp: GamesHelp = {
  [constants.pages.snake]: {
    description:
      'The player controls a snake that is really hungry. The objective is to eat as many pieces of food as possible.',
    gameOver: 'The player loses when the snake runs into the screen border, or itself.',
    controls:
      'The player can move the snake up, down, left, or right with the arrow keys or by swiping those directions within the screen.',
  },
  [constants.pages.minesweeper]: {
    description: 'The objective of the game is to clear a rectangular board containing hidden bombs without detonating any of them, with help from clues about the number of neighboring mines in each field.',
    gameOver: 'The player loses if a bomb is clicked. The player wins by placing all the flags on the bombs cells.',
    controls: 'Click on a cell to reveal it. To put a flag, right click on the cell.',
  }
}
