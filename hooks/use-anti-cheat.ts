"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { reportViolationAction } from "@/server/actions/simulation"
import type { Violation } from "@/types/simulation"

interface UseAntiCheatOptions {
  attemptId: string
}

interface UseAntiCheat {
  /** Disable detection (call before a legitimate fullscreen exit / finish). */
  disarm: () => void
}

/**
 * Anti-cheat for the simulation pages. Detects forbidden keys and fullscreen
 * exits, voids the attempt + locks the account, then routes to /account-locked.
 * Right-click, copy and paste are silently blocked while mounted.
 */
export function useAntiCheat({ attemptId }: UseAntiCheatOptions): UseAntiCheat {
  const router = useRouter()
  const triggeredRef = React.useRef(false)
  const disarmedRef = React.useRef(false)

  const disarm = React.useCallback(() => {
    disarmedRef.current = true
  }, [])

  const triggerViolation = React.useCallback(
    (type: Violation) => {
      if (triggeredRef.current || disarmedRef.current) return
      triggeredRef.current = true
      void reportViolationAction(attemptId, type).finally(() => {
        if (
          typeof document !== "undefined" &&
          document.fullscreenElement
        ) {
          document.exitFullscreen().catch(() => {})
        }
        router.replace("/account-locked")
      })
    },
    [attemptId, router]
  )

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        triggerViolation("escape_key")
        return
      }
      // Ctrl+Shift+<any> (dev tools, etc.)
      if (event.ctrlKey && event.shiftKey) {
        event.preventDefault()
        triggerViolation("shortcut_key")
      }
    }

    function onFullscreenChange() {
      if (!document.fullscreenElement) {
        triggerViolation("fullscreen_exit")
      }
    }

    function blockSilently(event: Event) {
      event.preventDefault()
    }

    // Capture phase so we see Escape before dialogs consume it.
    document.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("fullscreenchange", onFullscreenChange)
    document.addEventListener("contextmenu", blockSilently)
    document.addEventListener("copy", blockSilently)
    document.addEventListener("paste", blockSilently)

    return () => {
      document.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("fullscreenchange", onFullscreenChange)
      document.removeEventListener("contextmenu", blockSilently)
      document.removeEventListener("copy", blockSilently)
      document.removeEventListener("paste", blockSilently)
    }
  }, [triggerViolation])

  return React.useMemo(() => ({ disarm }), [disarm])
}
