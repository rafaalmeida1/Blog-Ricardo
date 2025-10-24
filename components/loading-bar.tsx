"use client"

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useNProgress } from "@/hooks/use-nprogress"
import "nprogress/nprogress.css"

function LoadingBarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { done } = useNProgress()

  useEffect(() => {
    done()
  }, [pathname, searchParams, done])

  return null
}

export function LoadingBar() {
  return (
    <Suspense fallback={null}>
      <LoadingBarContent />
    </Suspense>
  )
}
