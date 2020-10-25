import { Character } from '../Character'
import { OBJECT_TYPES, GamePieces, directions } from '../config'

const directionKeys = Object.keys(directions)

export class Ghost extends Character {
  private name: string
  private isScared: boolean

  public constructor(
    name: string,
    startPosition: number,
    startDirection: PacManGame.Direction,
    speed: number = 5,
  ) {
    super(startPosition, speed)
    this.name = name
    this.direction = startDirection
    this.isScared = false
  }

  public getNextMove(
    isMovementValidAvoidingTypes: (pos: number, types: Array<GamePieces>) => boolean,
  ): PacManGame.CharacterMove {
    let direction = this.direction!
    let position = this.currentPosition + direction.movement

    while (!isMovementValidAvoidingTypes(position, [OBJECT_TYPES.WALL, OBJECT_TYPES.GHOST])) {
      const newDirectionKey = directionKeys[Math.floor(Math.random() * directionKeys.length)]
      direction = directions[newDirectionKey as keyof typeof directions]
      position = this.currentPosition + direction.movement
    }

    return { direction, position }
  }

  public canRotate(): boolean {
    return false
  }

  public setIsScared(isScared: boolean) {
    this.isScared = isScared
  }

  public attributes(): Array<string> {
    const attr = [OBJECT_TYPES.GHOST, this.name]

    if (this.isScared) {
      attr.push(OBJECT_TYPES.SCARED)
    }

    return attr
  }
}
