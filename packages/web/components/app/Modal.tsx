'use client'

import { useEffect, useRef } from 'react'
import Icon from './Icon'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Centred dialog; Esc or the scrim closes it. Tab is trapped inside.
export default function Modal({ open, title, onClose, children, width = 520 }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; width?: number }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !box.current) return
    box.current.focus()

    function trap(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !box.current) return
      const els = Array.from(box.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest('[aria-hidden]'))
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    const el = box.current
    el.addEventListener('keydown', trap)
    return () => el.removeEventListener('keydown', trap)
  }, [open])

  if (!open) return null
  return (
    <div className="ka-modal" onMouseDown={onClose}>
      <div ref={box} className="ka-modal__box" role="dialog" aria-modal="true" aria-labelledby="ka-modal-title" tabIndex={-1} style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <div className="ka-modal__head">
          <h2 id="ka-modal-title">{title}</h2>
          <button type="button" className="ka-iconbtn" aria-label="Close" onClick={onClose}><Icon name="close" size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
