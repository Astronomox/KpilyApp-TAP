import type { CSSProperties } from 'react'

// Absolute position in Figma frame coordinates.
export const at = (left: number, top: number, width?: number, height?: number, extra: CSSProperties = {}): CSSProperties =>
  ({ position: 'absolute', left, top, width, height, ...extra })

// Poppins text style: weight, size, line-height, colour.
export const pop = (weight: number, size: number, lineHeight: number | 'normal' = 'normal', color = '#252525', extra: CSSProperties = {}): CSSProperties =>
  ({ fontFamily: 'Poppins, sans-serif', fontWeight: weight, fontSize: size, lineHeight: typeof lineHeight === 'number' ? `${lineHeight}px` : lineHeight, color, margin: 0, ...extra })
