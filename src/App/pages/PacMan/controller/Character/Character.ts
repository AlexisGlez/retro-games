import { GamePieces } from '../config'

export abstract class Character {
  protected startPosition: number
  protected currentPosition: number
  protected speed: number
  protected timer: number
  protected direction: PacManGame.Direction | undefined

  constructor(startPosition: number, speed: number = 5) {
    this.startPosition = startPosition
    this.currentPosition = startPosition
    this.speed = speed
    this.timer = 0
  }

  public getStartPosition(): number {
    return this.startPosition
  }

  public getCurrentPosition(): number {
    return this.currentPosition
  }

  public setNextCharacterMove(pos: number, dir?: PacManGame.Direction) {
    this.currentPosition = pos

    if (dir) {
      this.direction = dir
    }
  }

  public setDirection(nextDirection: PacManGame.Direction): void {
    this.direction = nextDirection
  }

  public shouldMove(): boolean {
    if (this.timer !== this.speed) {
      this.timer += 1
      return false
    }

    this.timer = 0
    return true
  }

  public abstract getNextMove(
    isMovementValidAvoidingTypes: (pos: number, types: Array<GamePieces>) => boolean,
  ): PacManGame.CharacterMove
  public abstract canRotate(): boolean
  public abstract attributes(): Array<string>
}
