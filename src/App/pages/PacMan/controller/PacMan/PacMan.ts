export class PacMan {
  private startPosition: number
  private speed: number
  private timer: number

  public constructor(startPosition: number, speed: number = 5) {
    this.startPosition = startPosition
    this.speed = speed
    this.timer = 0
  }

  public shouldMove(): boolean {
    return false
  }
}
