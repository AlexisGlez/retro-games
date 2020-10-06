/// <reference path="./MinesweeperGameController.d.ts" />

import { GridGameController } from '@app-shared/controllers/GridGameController'

export class MinesweeperGameController extends GridGameController {
  public constructor(cellSize: number) {
    super(cellSize)
  }
}
