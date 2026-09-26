'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon'
import { flatNav, type NavItem } from '@/lib/nav'

// ⌘K palette: filters every page the user can reach; ↑/↓ to move, Enter to go, Esc to close.
export default function CommandPalette({ open, onClose, nav }: { open: boolean; onClose: () => void; nav: NavItem[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const links = useMemo(() => flatNav(nav), [nav])
  const hits = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? links.filter((l) => l.title.toLowerCase().includes(q)) : links
  }, [links, query])

  useEffect(() => { if (open) input.current?.focus() }, [open])

  if (!open) return null

  const go = (item?: NavItem) => {
    if (!item) return
    close()
    router.push(item.path)
  }
  function close() { setQuery(''); setIndex(0); onClose() }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, hits.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); go(hits[index]) }
  }

  return (
    <div className="kp-palette" onMouseDown={close}>
      <div className="kp-palette__box" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKey}>
        <div className="kp-palette__field">
          <Icon name="search" size={20} />
          <input ref={input} value={query} placeholder="Type a command or search..." aria-label="Type a command or search"
            role="combobox" aria-expanded="true" aria-controls="kp-palette-list" aria-activedescendant={hits[index] ? `kp-hit-${index}` : undefined}
            onChange={(e) => { setQuery(e.target.value); setIndex(0) }} />
        </div>
        <div className="kp-palette__group">Links</div>
        <ul id="kp-palette-list" role="listbox" className="kp-palette__list">
          {hits.map((h, i) => (
            <li key={h.path} id={`kp-hit-${i}`} role="option" aria-selected={i === index} className={i === index ? 'is-active' : ''}
              onMouseEnter={() => setIndex(i)} onClick={() => go(h)}>
              <Icon name={h.icon} size={18} gradient />{h.title}
            </li>
          ))}
          {!hits.length && <li className="kp-palette__empty">No results found.</li>}
        </ul>
      </div>
    </div>
  )
}
