'use client'

import { useRef, useState } from 'react'
import Icon from './Icon'

// Figma "Upload File(s)" / "Add Link(s)" buttons (Appeal Feedback, Add Goal).
// Only file names are kept: there is no upload endpoint for these records yet.

export default function Evidence({ files, links, onChange }: { files: string[]; links: string[]; onChange: (v: { files: string[]; links: string[] }) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [adding, setAdding] = useState(false)
  const [link, setLink] = useState('')

  function addLink(e: React.FormEvent) {
    e.preventDefault()
    const url = link.trim()
    if (!url) return
    onChange({ files, links: [...links, /^https?:\/\//.test(url) ? url : `https://${url}`] })
    setLink(''); setAdding(false)
  }

  return (
    <div className="ka-evidence">
      <button type="button" className="ka-evidence__btn" onClick={() => input.current?.click()}><Icon name="upload" size={26} />Upload File(s)</button>
      <input ref={input} type="file" multiple hidden onChange={(e) => { const names = Array.from(e.target.files ?? []).map((f) => f.name); e.target.value = ''; onChange({ files: [...files, ...names], links }) }} />
      {adding ? (
        <form className="ka-evidence__link" onSubmit={addLink}>
          <input autoFocus type="text" inputMode="url" placeholder="https://" aria-label="Link" value={link} onChange={(e) => setLink(e.target.value)} />
          <button type="submit" className="ka-btn ka-btn--sm">Add</button>
        </form>
      ) : <button type="button" className="ka-evidence__btn" onClick={() => setAdding(true)}><Icon name="link" size={26} />Add Link(s)</button>}
      {(files.length > 0 || links.length > 0) && (
        <ul className="ka-evidence__list">
          {files.map((f, i) => <li key={`f${i}`}><Icon name="folder" size={16} />{f}<button type="button" aria-label={`Remove ${f}`} onClick={() => onChange({ files: files.filter((_, j) => j !== i), links })}>×</button></li>)}
          {links.map((l, i) => <li key={`l${i}`}><Icon name="link" size={16} /><a href={l} target="_blank" rel="noreferrer">{l}</a><button type="button" aria-label={`Remove ${l}`} onClick={() => onChange({ files, links: links.filter((_, j) => j !== i) })}>×</button></li>)}
        </ul>
      )}
    </div>
  )
}
