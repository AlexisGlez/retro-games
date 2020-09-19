import { isServer } from '@app-shared/utils/isServer'

export function getGridSize(): GridSize {
  if (isServer()) {
    return { width: 1, height: 1 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}
