'use client'

import { useState } from 'react'
import Icon from '@/components/app/Icon'
import { useProfile } from '@/components/app/ProfileContext'
import '@/styles/Support.css'

const EMAIL = 'support@kpily.com'
const PHONE = '+2349024429918'

export default function ContactUs() {
  const { profile } = useProfile()
  const [topic, setTopic] = useState('General question')
  const [message, setMessage] = useState('')
  const body = `${message}\n\n${profile?.fullname ?? ''} (${profile?.email ?? ''})`
  return (
    <div className="ka-help">
      <div className="ka-pagehead"><div><h1>Contact Us</h1><p>We are available via email or WhatsApp to chat.</p></div></div>
      <div className="ka-help__contact">
        <a className="ka-card ka-help__card" href={`mailto:${EMAIL}`}><h2>Email <Icon name="mail" size={28} /></h2><p>{EMAIL}</p></a>
        <a className="ka-card ka-help__card" href={`https://wa.me/${PHONE.replace('+', '')}`} target="_blank" rel="noreferrer"><h2>WhatsApp <Icon name="chat" size={28} /></h2><p>+234 09024429918</p></a>
      </div>
      <form className="ka-card ka-help__sec" onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`[KPILY] ${topic}`)}&body=${encodeURIComponent(body)}` }}>
        <h2>Send us a message</h2>
        <label className="ka-field">Topic<select value={topic} onChange={(e) => setTopic(e.target.value)}>{['General question', 'Billing', 'Report a problem', 'Feature request'].map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="ka-field">Message<textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" /></label>
        <p className="ka-muted">This opens your email app with the message ready to send.</p>
        <div className="ka-actions"><button type="submit" className="ka-btn">Send message</button></div>
      </form>
    </div>
  )
}
