import React from 'react'

export function useKeyDownListener(callback: (this: Document, ev: KeyboardEvent) => any) {
  React.useEffect(() => {
    document.addEventListener('keydown', callback)

    return () => {
      document.removeEventListener('keydown', callback)
    }
  }, [callback])
}

export function useArrowKeysListener(callback: (direction: ArrowControls) => void) {
  const arrowListener = React.useCallback(
    (event: KeyboardEvent) => {
      // If use presses the arrow keys, event.key will have the following values:
      // ArrowUp, ArrowDown, ArrowLeft, or ArrowRight.
      const direction = event.key.replace('Arrow', '')
      callback(direction as ArrowControls)
    },
    [callback],
  )

  useKeyDownListener(arrowListener)
}
