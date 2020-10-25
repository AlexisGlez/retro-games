import { Character } from '../Character'
import { OBJECT_TYPES, GamePieces } from '../config'

export class PacMan extends Character {
  private hasEatenPowerPill: boolean

  public constructor(startPosition: number, speed: number = 2) {
    super(startPosition, speed)
    this.hasEatenPowerPill = false
  }

  public setHasEatenPowerPill(powerPill: boolean) {
    this.hasEatenPowerPill = powerPill
  }

  public hasPowerPill(): boolean {
    return this.hasEatenPowerPill
  }

  public shouldMove(): boolean {
    if (!this.direction) {
      return false
    }

    return super.shouldMove()
  }

  public getNextMove(
    isMovementValidAvoidingTypes: (pos: number, types: Array<GamePieces>) => boolean,
  ): PacManGame.CharacterMove {
    let position = this.currentPosition + this.direction!.movement

    if (!isMovementValidAvoidingTypes(position, [OBJECT_TYPES.WALL, OBJECT_TYPES.GHOSTLAIR])) {
      position = this.currentPosition
    }

    return { direction: this.direction!, position }
  }

  public canRotate(): boolean {
    return true
  }

  public attributes(): Array<string> {
    return [OBJECT_TYPES.PACMAN]
  }
}
