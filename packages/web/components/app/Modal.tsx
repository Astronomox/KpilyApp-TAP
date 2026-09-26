'use client'

import { useEffect, useRef } from 'react'
import Icon from './Icon'

// Centred dialog; Esc or the scrim closes it.
export default function Modal({ open, title, onClose, children, width = 520 }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; width?: number }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => { if (open) box.current?.focus() }, [open])
  if (!open) return null
  return (
    <div className="ka-modal" onMouseDown={onClose}>
      <div ref={box} className="ka-modal__box" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <div className="ka-modal__head">
          <h2>{title}</h2>
          <button type="button" className="ka-iconbtn" aria-label="Close" onClick={onClose}><Icon name="close" size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
