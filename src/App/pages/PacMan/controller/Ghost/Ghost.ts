export class Ghost {
  private name: string
  private startPosition: number
  private speed: number
  private timer: number

  public constructor(name: string, startPosition: number, speed: number = 5) {
    this.name = name
    this.startPosition = startPosition
    this.speed = speed
    this.timer = 0
  }

  public shouldMove(): boolean {
    if (this.timer === this.speed) {
      this.timer = 0
      return true
    }

    this.timer += 1
    return false
  }
}
