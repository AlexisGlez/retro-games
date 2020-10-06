/// <reference path="./GridGameController.d.ts" />

import { getGridSize } from '@app-shared/utils'

export abstract class GridGameController {
  public readonly gridSize: GridSize = getGridSize()

  protected widthLimit: number
  protected heightLimit: number

  public constructor(cellSize: number) {
    this.widthLimit = Math.floor(this.gridSize.width / cellSize)
    this.heightLimit = Math.floor(this.gridSize.height / cellSize)
  }
}
