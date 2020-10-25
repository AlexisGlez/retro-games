/// <reference path="./PacManController.d.ts" />

import { Character } from './Character'
import { PacMan } from './PacMan'
import { Ghost } from './Ghost'
import {
  levels,
  OBJECT_TYPES,
  OBJECT_TYPES_AND_LEVEL_MATCH,
  GamePieces,
  CELL_SIZE,
  directions,
} from './config'

export class PacManController implements ArrowMovement {
  private dots: number
  private gameBoard: Array<PacManGame.GameBoardPiece>
  private pacMan: PacMan | undefined
  private ghosts: Array<Ghost>
  private score: number
  private latestAction: PacManGame.Actions

  public constructor(level: PacManGame.GameLevels) {
    this.dots = 0
    this.score = 0
    this.gameBoard = []
    this.ghosts = []
    this.latestAction = ''
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
        style: { width: CELL_SIZE, height: CELL_SIZE, transform: '' },
        attributes: [obj],
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
    this.ghosts.push(new Ghost(name, pos, directions.up, Math.floor(Math.random() * 3) + 2))
  }

  public getGameState(): PacManGame.State {
    return { gameBoard: this.gameBoard, score: this.score, gameStatus: 'ongoing', latestAction: '' }
  }

  public getNextGameState(): PacManGame.State {
    this.latestAction = ''

    this.moveCharacter(this.pacMan!)

    let gameStatus = this.checkPacManAndGhostsCollisions()

    this.ghosts.forEach((ghost) => this.moveCharacter(ghost))

    gameStatus = this.checkPacManAndGhostsCollisions()

    this.checkIfPacManAteDot()

    this.checkIfPacManAtePowerPill()

    this.checkIfGhostsAreScared()

    if (this.dots === 0) {
      gameStatus = 'win'
    }

    return {
      gameBoard: this.gameBoard,
      score: this.score,
      gameStatus,
      latestAction: this.latestAction,
    }
  }

  private moveCharacter(character: Character) {
    if (!character.shouldMove()) {
      return
    }

    const nextMove = character.getNextMove(this.isMovementValidAvoidingTypes)

    if (character.canRotate() && nextMove.position !== character.getCurrentPosition()) {
      // Rotate the new character position
      this.gameBoard[
        nextMove.position
      ].style.transform = `rotate(${nextMove.direction.rotation}deg)`

      // Rotate the previous character position back to 0
      this.gameBoard[character.getCurrentPosition()].style.transform = 'rotate(0deg)'
    }

    this.removeAttributesFromPosition(
      character.getCurrentPosition(),
      (attr) => !this.isCharacterAttribute(attr),
    )

    this.gameBoard[nextMove.position].attributes.push(...character.attributes())

    character.setNextCharacterMove(nextMove.position, nextMove.direction)
  }

  private removeAttributesFromPosition(
    pos: number,
    predicate: GamePieces | ((attr: string) => boolean),
  ) {
    this.gameBoard[pos].attributes = this.gameBoard[pos].attributes.filter((attr) => {
      if (typeof predicate === 'string') {
        return attr !== predicate
      }

      return predicate(attr)
    })
  }

  private checkPacManAndGhostsCollisions(): GameStatus {
    const collidedGhost = this.ghosts.find(
      (ghost) => this.pacMan!.getCurrentPosition() === ghost.getCurrentPosition(),
    )

    if (!collidedGhost) {
      return 'ongoing'
    }

    if (this.pacMan!.hasPowerPill()) {
      this.latestAction = 'ghost-eaten'

      this.removeAttributesFromPosition(
        collidedGhost.getCurrentPosition(),
        (attr) => !collidedGhost.attributes().includes(attr),
      )

      collidedGhost.setNextCharacterMove(collidedGhost.getStartPosition())
      this.score += 100

      return 'ongoing'
    }

    this.removeAttributesFromPosition(this.pacMan!.getCurrentPosition(), OBJECT_TYPES.PACMAN)

    this.gameBoard[this.pacMan!.getCurrentPosition()].style.transform = 'rotate(0deg)'

    return 'lose'
  }

  private checkIfPacManAteDot() {
    if (!this.gameBoard[this.pacMan!.getCurrentPosition()].attributes.includes(OBJECT_TYPES.DOT)) {
      return
    }

    this.latestAction = 'dot-eaten'

    this.removeAttributesFromPosition(this.pacMan!.getCurrentPosition(), OBJECT_TYPES.DOT)

    this.dots -= 1

    this.score += 10
  }

  private checkIfPacManAtePowerPill() {
    if (!this.gameBoard[this.pacMan!.getCurrentPosition()].attributes.includes(OBJECT_TYPES.PILL)) {
      return
    }

    this.latestAction = 'pill-eaten'

    this.removeAttributesFromPosition(this.pacMan!.getCurrentPosition(), OBJECT_TYPES.PILL)

    this.pacMan!.setHasEatenPowerPill(true)

    this.score += 50
  }

  public powerPillTimeExpired() {
    this.pacMan!.setHasEatenPowerPill(false)
  }

  private checkIfGhostsAreScared() {
    this.ghosts.forEach((ghost) => ghost.setIsScared(this.pacMan!.hasPowerPill()))
  }

  private isCharacterAttribute(attribute: string): boolean {
    return (
      attribute === OBJECT_TYPES.BLINKY ||
      attribute === OBJECT_TYPES.CLYDE ||
      attribute === OBJECT_TYPES.GHOST ||
      attribute === OBJECT_TYPES.INKY ||
      attribute === OBJECT_TYPES.PACMAN ||
      attribute === OBJECT_TYPES.PINKY ||
      attribute === OBJECT_TYPES.SCARED
    )
  }

  private isMovementValidAvoidingTypes = (pos: number, types: Array<GamePieces>): boolean => {
    for (let i = 0; i < types.length; i += 1) {
      if (this.gameBoard[pos].attributes.includes(types[i])) {
        return false
      }
    }

    return true
  }

  public requestArrowMovement = (pressedControl: ArrowControls): void => {
    const nextDirection: PacManGame.Direction | undefined =
      directions[pressedControl.toLowerCase() as keyof typeof directions]

    if (!nextDirection) {
      return
    }

    const nextPacManPosition = this.pacMan!.getCurrentPosition() + nextDirection.movement

    if (this.gameBoard[nextPacManPosition].attributes.includes(OBJECT_TYPES.WALL)) {
      return
    }

    this.pacMan!.setDirection(nextDirection)
  }
}
