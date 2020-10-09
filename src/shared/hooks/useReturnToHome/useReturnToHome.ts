import React from 'react'
import { useRouter } from 'next/router'

export function useReturnToHome() {
  const router = useRouter()

  return React.useCallback(() => {
    router.back()
  }, [router])
}
