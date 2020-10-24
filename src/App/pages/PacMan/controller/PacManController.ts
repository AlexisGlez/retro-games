/// <reference path="./PacManController.d.ts" />

import { PacMan } from './PacMan'
import { Ghost } from './Ghost'
import { levels, OBJECT_TYPES, OBJECT_TYPES_AND_LEVEL_MATCH } from './config'

const CELL_SIZE = 20

export class PacManController implements ArrowMovement {
  private dots: number
  private gameBoard: Array<PacManGame.GameBoardPiece>
  private pacMan: PacMan | undefined
  private ghosts: Array<Ghost>

  public constructor(level: PacManGame.GameLevels) {
    this.dots = 0
    this.gameBoard = []
    this.ghosts = []
    this.createGameBoard(levels[level])
  }

  private createGameBoard(level: Array<number>): void {
    let obj: typeof OBJECT_TYPES_AND_LEVEL_MATCH[number]
    let gamePiece: PacManGame.GameBoardPiece

    level.forEach((piece, index) => {
      obj = OBJECT_TYPES_AND_LEVEL_MATCH[piece]

      if (!obj) {
        throw Error('Invalid PacMan level provided.')
      }

      gamePiece = {
        type: obj,
        style: { width: CELL_SIZE, height: CELL_SIZE },
        attributes: [],
      }

      if (obj === OBJECT_TYPES.PACMAN) {
        if (this.pacMan) {
          throw Error('More than one PacMan found in the level.')
        }

        this.pacMan = new PacMan(index)
      } else if (
        obj === OBJECT_TYPES.BLINKY ||
        obj === OBJECT_TYPES.CLYDE ||
        obj === OBJECT_TYPES.INKY ||
        obj === OBJECT_TYPES.PINKY
      ) {
        gamePiece.attributes.push(OBJECT_TYPES.GHOST)
        this.addGhost(obj, index)
      } else if (obj === OBJECT_TYPES.DOT) {
        this.dots += 1
      }

      this.gameBoard.push(gamePiece)
    })
  }

  private addGhost(name: string, pos: number) {
    this.ghosts.push(new Ghost(name, pos, Math.floor(Math.random() * 3) + 2))
  }

  public getGameState(): PacManGame.State {
    return { gameBoard: this.gameBoard }
  }

  public requestArrowMovement = (pressedControl: ArrowControls): void => {
    let nextDirection: PacManGame.PacManDirection | undefined

    if (pressedControl === 'Left') {
      nextDirection = { movement: -1, rotation: 180 }
    } else if (pressedControl === 'Right') {
      nextDirection = { movement: 1, rotation: 0 }
    } else if (pressedControl === 'Up') {
      nextDirection = { movement: -CELL_SIZE, rotation: 270 }
    } else if (pressedControl === 'Down') {
      nextDirection = { movement: CELL_SIZE, rotation: 90 }
    }

    if (!nextDirection) {
      return
    }

    const nextPacManPosition = this.pacMan!.getCurrentPosition() + nextDirection.movement

    if (this.gameBoard[nextPacManPosition].type === OBJECT_TYPES.WALL) {
      return
    }

    this.pacMan!.setNextPacManDirection(nextDirection)
  }
}
