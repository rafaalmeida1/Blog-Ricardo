"use client"

import { useEffect } from "react"
import NProgress from "nprogress"

export function useNProgress() {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      speed: 500,
      minimum: 0.1,
    })
  }, [])

  const start = () => NProgress.start()
  const done = () => NProgress.done()

  return { start, done }
}
