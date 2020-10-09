import React from 'react'
import debounce from 'lodash.debounce'

export function useWindowResize(callback: () => void) {
  React.useEffect(() => {
    const handleWindowResize = debounce(callback, 250)

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])
}
