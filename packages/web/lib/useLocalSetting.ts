'use client'

import { useEffect, useState } from 'react'

/** A settings value kept in this browser (for options the API has no endpoint for yet). */
export function useLocalSetting<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let stored: T | null = null
    try { const raw = localStorage.getItem(key); if (raw) stored = JSON.parse(raw) as T } catch { /* storage blocked */ }
    queueMicrotask(() => { if (stored !== null) setValue(stored); setLoaded(true) })
  }, [key])
  const save = (next: T) => {
    setValue(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* storage blocked */ }
  }
  return [value, save, loaded] as const
}
