export const pagesConfig: PagesConfig = {
  Home: {
    games: {
      Snake: {
        gameName: 'Snake',
        gamePageName: 'snake',
        imageName: 'snake_demo',
        imageAlt: 'Snake Game',
      },
      PacMan: {
        gameName: 'PacMan',
        gamePageName: 'pacman',
        imageName: 'pacman_demo',
        imageAlt: 'PacMan Game',
      },
      Minesweeper: {
        gameName: 'Minesweeper',
        gamePageName: 'minesweeper',
        imageName: 'minesweeper_demo',
        imageAlt: 'Minesweeper Game',
      },
      TicTacToe: {
        gameName: 'TicTacToe',
        gamePageName: 'tic-tac-toe',
        imageName: 'tictactoe_demo',
        imageAlt: 'TicTacToe Game',
      },
      Chess: {
        gameName: 'Chess',
        gamePageName: 'chess',
        imageName: 'chess_demo',
        imageAlt: 'Chess Game',
      },
    },
  },
  Snake: {
    cellSize: 20,
    gameSpeed: 1,
  },
  PacMan: {
    level: 'easy',
    gameSpeed: 1,
  },
  Minesweeper: {
    bombs: 3,
  },
  TicTacToe: {
    oponent: 'player',
  },
  Chess: {
    oponent: 'player',
  },
}

export const gamesSettings: GamesSettings = {
  Snake: [
    {
      propertyName: 'cellSize',
      displayName: 'Cell Size',
      type: 'number',
      helperText: 'The size of each cell in the board, the food, and snake',
      currentValue: pagesConfig.Snake.cellSize,
      step: 1,
      min: 1,
      max: 100,
    },
    {
      propertyName: 'gameSpeed',
      displayName: 'Game Speed',
      helperText: "The snake's speed (use with caution)",
      type: 'number',
      currentValue: pagesConfig.Snake.gameSpeed,
      step: 1,
      min: 1,
      max: 9,
    },
  ],
  PacMan: [
    {
      propertyName: 'level',
      displayName: 'Level',
      type: 'string',
      helperText: 'The PacMan level to play',
      currentValue: pagesConfig.PacMan.level,
      options: ['easy'],
    },
    {
      propertyName: 'gameSpeed',
      displayName: 'Game Speed',
      helperText: "The PacMan's speed (use with caution)",
      type: 'number',
      currentValue: pagesConfig.PacMan.gameSpeed,
      step: 1,
      min: 1,
      max: 9,
    },
  ],
  Minesweeper: [
    {
      propertyName: 'bombs',
      displayName: 'Bombs Amount',
      type: 'number',
      helperText: 'The number of bombs to be placed in the game',
      currentValue: pagesConfig.Minesweeper.bombs,
      step: 1,
      min: 3,
      max: 150,
    },
  ],
  TicTacToe: [
    {
      propertyName: 'oponent',
      displayName: 'Oponent',
      type: 'string',
      helperText: 'Who are you playing with?',
      currentValue: pagesConfig.TicTacToe.oponent,
      options: ['player'],
    },
  ],
  Chess: [
    {
      propertyName: 'oponent',
      displayName: 'Oponent',
      type: 'string',
      helperText: 'Who are you playing with?',
      currentValue: pagesConfig.Chess.oponent,
      options: ['player'],
    },
  ],
}

export const gamesHelp: GamesHelp = {
  Snake: {
    description:
      'The player controls a snake that is really hungry. The objective is to eat as many pieces of food as possible.',
    gameOver: 'The player loses when the snake runs into the screen border, or itself.',
    controls:
      'The player can move the snake up, down, left, or right with the arrow keys or by swiping those directions within the screen.',
  },
  PacMan: {
    description:
      'The player controls PacMan, who must eat all the dots inside an enclosed maze while avoiding some colored ghosts. Eating large flashing dots called "power pills" causes the ghosts to turn blue, allowing PacMan to eat them for bonus points.',
    gameOver:
      'The player loses if a ghost eats PacMan. The player wins is PacMan eats all the dots in the maze.',
    controls:
      'The player can move PacMan up, down, left, or right with the arrow keys or by swiping those directions within the screen.',
  },
  Minesweeper: {
    description:
      'The objective of the game is to clear a rectangular board containing hidden bombs without detonating any of them, with help from clues about the number of neighboring mines in each field.',
    gameOver:
      'The player loses if a bomb is clicked. The player wins by placing all the flags on the bombs cells.',
    controls: 'Click on a cell to reveal it. To put a flag, right click on the cell.',
  },
  TicTacToe: {
    description: 'Two players, X and O, take turns to mark the spaces in a 3×3 grid.',
    gameOver:
      'The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.',
    controls:
      'Click on an empty cell to mark it as yours! The current player is automatically handle by me. We start with the player "X"',
  },
  Chess: {
    description: 'Two players take turns to conquer.',
    gameOver: 'The player who is able to do a check mate is the winner. Currently, the game does not identify check mate or tie, but if there are no any available movements (if an user cannot move its pieces anymore), means that the game is over.',
    controls: 'Click on a piece and then click on the cell where you want your piece to be moved. If nothing happens, the movement was invalid and you need to repeat the process.',
  },
}
