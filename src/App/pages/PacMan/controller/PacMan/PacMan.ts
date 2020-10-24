export class PacMan {
  private startPosition: number
  private currentPosition: number
  private speed: number
  private timer: number
  private direction: PacManGame.PacManDirection | undefined

  public constructor(startPosition: number, speed: number = 5) {
    this.startPosition = startPosition
    this.currentPosition = startPosition
    this.speed = speed
    this.timer = 0
  }

  public shouldMove(): boolean {
    if (!this.direction) {
      return false
    }

    if (this.timer !== this.speed) {
      this.timer += 1
      return false
    }

    this.timer = 0
    return true
  }

  public getStartPosition(): number {
    return this.startPosition
  }

  public getCurrentPosition(): number {
    return this.currentPosition
  }

  public setNextPacManDirection(nextDirection: PacManGame.PacManDirection): void {
    this.direction = nextDirection
  }
}
