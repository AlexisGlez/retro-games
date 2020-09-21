import { constants } from '@app-shared/constants'

type PagesConfig = {
  [constants.pages.home]: HomeData
  [constants.pages.snake]: SnakeGame
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
    },
  },
  [constants.pages.snake]: {
    cellSize: 20,
    gameSpeed: 1,
  },
}

type GamesSettings = {
  [constants.pages.snake]: Array<GameSetting>
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
}

type GamesHelp = {
  [constants.pages.snake]: GameHelpModal.GameHelp
}

export const gamesHelp: GamesHelp = {
  [constants.pages.snake]: {
    description:
      'The player controls a snake that is really hungry. The objective is to eat as many pieces of food as possible.',
    gameOver: 'The player loses when the snake runs into the screen border, or itself.',
    controls:
      'The player can move the snake up, down, left, or right with the arrow keys or by swiping those directions within the screen.',
  },
}
