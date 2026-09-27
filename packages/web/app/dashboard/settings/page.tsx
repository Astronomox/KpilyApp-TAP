'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import Avatar from '@/components/app/Avatar'
import Icon from '@/components/app/Icon'
import Modal from '@/components/app/Modal'
import { useProfile } from '@/components/app/ProfileContext'
import {
  API_BASE, clearSession, endSession, getActiveSessions, getSelf, logout, orgName, updateOrg, updatePassword, updateProfile,
  updateStoredProfile, uploadOrgLogo, uploadProfileImage, verifyPassword, type Organization,
} from '@/lib/kpily'
import { changePasswordSchema, check, orgSchema, profileFormSchema } from '@/lib/schemas'
import '@/styles/Settings.css'

const INDUSTRIES = ['Technology', 'Financial Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Law & Compliance', 'Media', 'Logistics', 'Other']
const fileUrl = (alias: unknown) => (typeof alias === 'string' && alias ? (alias.startsWith('http') ? alias : `${API_BASE}/v1/file/get/${alias}`) : null)
const pretty = (s?: string) => (s || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const formValues = (form: HTMLFormElement) => { const out: Record<string, string> = {}; new FormData(form).forEach((v, k) => { out[k] = String(v) }); return out }

type Status = { busy?: boolean; error?: string; ok?: string }

function Row({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="ka-set__row">
      <div className="ka-set__label"><h2>{title}</h2>{hint && <p>{hint}</p>}</div>
      <div className="ka-set__body">{children}</div>
    </section>
  )
}

function Upload({ label, onFile, busy }: { label: string; onFile: (f: File) => void; busy?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  return (
    <button type="button" className={`ka-drop ${drag ? 'is-drag' : ''}`} disabled={busy} aria-label={label}
      onClick={() => input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f) }}>
      <Icon name="upload" size={22} />
      <span className="ka-drop__cta">{busy ? 'Uploading…' : 'Click to upload'}</span>
      <small>(SVG, PNG, JPG, or GIF (max 800x400px))</small>
      <input ref={input} type="file" accept="image/svg+xml,image/png,image/jpeg,image/gif" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFile(f) }} />
    </button>
  )
}

function Note({ s }: { s: Status }) {
  if (s.error) return <p role="alert" className="ka-error">{s.error}</p>
  if (s.ok) return <p role="status" className="ka-ok">{s.ok}</p>
  return null
}

export default function Settings() {
  const router = useRouter()
  const { profile, setProfile } = useProfile()
  const org = profile?.organization as Organization | undefined
  const isAdmin = (profile?.privilege ?? 0) >= 50
  const [st, setSt] = useState<Record<string, Status>>({})
  const [confirmAll, setConfirmAll] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })

  async function act(key: string, fn: () => Promise<unknown>, ok: string) {
    setSt((s) => ({ ...s, [key]: { busy: true } }))
    try { await fn(); setSt((s) => ({ ...s, [key]: { ok } })) } catch (e) { setSt((s) => ({ ...s, [key]: { error: e instanceof Error ? e.message : String(e) } })) }
  }
  const refresh = async () => { const me = await getSelf(); if (profile) { setProfile({ ...profile, ...me }); updateStoredProfile(me) } }

  function saveCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = formValues(e.currentTarget)
    act('company', async () => {
      await updateOrg(check(orgSchema, f))
      const organization = { ...org, companyName: f.companyName.trim(), companyWebsite: f.companyWebsite.trim(), mailDomain: f.mailDomain.trim(), industry: f.industry.trim(), country: f.country.trim(), state: f.state.trim() }
      if (profile) setProfile({ ...profile, organization })
      updateStoredProfile({ organization })
    }, 'Company details saved.')
  }

  function saveName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = formValues(e.currentTarget)
    act('name', async () => { await updateProfile(check(profileFormSchema, { fullname: f.fullname, phone: f.phone.trim() ? `${f.code}${f.phone.trim().replace(/^0/, '')}` : '', gender: f.gender })); await refresh() }, 'Profile saved.')
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault()
    const valid = changePasswordSchema.safeParse(pw)
    if (!valid.success) return setSt((s) => ({ ...s, pw: { error: valid.error.issues[0].message } }))
    act('pw', async () => {
      try { await verifyPassword(profile?.email ?? '', pw.current) } catch { throw new Error('Your current password is incorrect.') }
      await updatePassword(pw.next)
      setPw({ current: '', next: '', confirm: '' })
    }, 'Password updated.')
  }

  async function signOut(all: boolean) {
    setLeaving(true)
    if (all) {
      const sessions = await getActiveSessions().catch(() => [])
      await Promise.allSettled(sessions.map((s) => endSession(s.id)))
      clearSession()
    } else await logout().catch(() => {})
    router.replace('/login')
  }

  const phone = String(profile?.phone ?? '')
  const code = phone.match(/^\+\d{1,3}/)?.[0] ?? '+234'
  const local = phone.replace(/^\+\d{1,3}/, '')

  return (
    <div className="ka-set">
      <div className="ka-pagehead"><div><h1>Settings</h1><p>Update your details and photo here</p></div></div>

      {isAdmin && (
        <Row title="Company Name">
          <form onSubmit={saveCompany} key={org?.id}>
            <div className="ka-row2">
              <label className="ka-field">Company Name<input name="companyName" required defaultValue={orgName(org)} /></label>
              <label className="ka-field">Company Website<input name="companyWebsite" type="url" defaultValue={org?.companyWebsite ?? ''} placeholder="https://" /></label>
              <label className="ka-field">Mail Domain<input name="mailDomain" required defaultValue={org?.mailDomain ?? ''} /></label>
              <label className="ka-field">Industry<input name="industry" list="ka-industries" defaultValue={pretty(org?.industry)} /><datalist id="ka-industries">{INDUSTRIES.map((i) => <option key={i} value={i} />)}</datalist></label>
              <label className="ka-field">Country<input name="country" defaultValue={pretty(org?.country)} /></label>
              <label className="ka-field">State<input name="state" defaultValue={pretty(org?.state)} /></label>
            </div>
            <Note s={st.company ?? {}} />
            <button type="submit" className="ka-btn ka-btn--sm" disabled={st.company?.busy}>{st.company?.busy ? 'Saving…' : 'Save'}</button>
          </form>
        </Row>
      )}

      {isAdmin && (
        <Row title="Company Logo" hint="Upload your company logo here">
          <div className="ka-set__media">
            {fileUrl(org?.logoURL) && <img className="ka-set__logo" src={fileUrl(org?.logoURL)!} alt="Current company logo" />}
            <Upload label="Upload company logo" busy={st.logo?.busy} onFile={(f) => act('logo', () => uploadOrgLogo(f), 'Logo uploaded.')} />
          </div>
          <Note s={st.logo ?? {}} />
        </Row>
      )}

      <Row title="Full Name">
        <form onSubmit={saveName} key={profile?.fullname}>
          <div className="ka-row2">
            <label className="ka-field">Full name<input name="fullname" required defaultValue={profile?.fullname} /></label>
            <div className="ka-field"><span>Phone</span>
              <div className="ka-phone">
                <select name="code" aria-label="Country code" defaultValue={code}>{['+234', '+233', '+254', '+27', '+1', '+44'].map((c) => <option key={c}>{c}</option>)}{!['+234', '+233', '+254', '+27', '+1', '+44'].includes(code) && <option>{code}</option>}</select>
                <input name="phone" type="tel" aria-label="Phone number" defaultValue={local} placeholder="Phone" />
              </div>
            </div>
            <label className="ka-field">Gender<select name="gender" defaultValue={pretty(profile?.gender) || 'Male'}><option>Male</option><option>Female</option><option value="other">Prefer not to say</option></select></label>
            <div className="ka-set__inline"><button type="submit" className="ka-btn ka-btn--sm" disabled={st.name?.busy}>{st.name?.busy ? 'Saving…' : 'Save'}</button></div>
          </div>
          <Note s={st.name ?? {}} />
        </form>
      </Row>

      <Row title="Profile Picture" hint="Upload your photo here">
        <div className="ka-set__media">
          <Avatar name={profile?.fullname} src={fileUrl(profile?.profile)} size={140} />
          <Upload label="Upload profile picture" busy={st.photo?.busy} onFile={(f) => act('photo', async () => { await uploadProfileImage(f); await refresh() }, 'Photo updated.')} />
        </div>
        <Note s={st.photo ?? {}} />
      </Row>

      <Row title="Personal Email"><input className="ka-set__ro" value={profile?.email ?? ''} readOnly aria-label="Personal email" /></Row>
      <Row title="Language"><select className="ka-set__ro" aria-label="Language" defaultValue="en" disabled title="More languages coming soon"><option value="en">English</option></select></Row>
      <Row title="Verification Status"><span className="ka-set__ro ka-set__verified">Active <Icon name="check" size={16} /></span></Row>

      <Row title="Password" hint="Enter your current password to change your account">
        <form onSubmit={savePassword}>
          <div className="ka-row2">
            <label className="ka-field">Current Password<input type="password" autoComplete="current-password" required placeholder="Enter current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></label>
            <label className="ka-field">New Password<input type="password" autoComplete="new-password" required placeholder="Enter new password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></label>
            <label className="ka-field">Confirm new password<input type="password" autoComplete="new-password" required placeholder="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></label>
            <div className="ka-set__inline"><button type="submit" className="ka-btn ka-btn--sm" disabled={st.pw?.busy || !pw.current || !pw.next || !pw.confirm}>{st.pw?.busy ? 'Saving…' : 'Save'}</button></div>
          </div>
          <Note s={st.pw ?? {}} />
        </form>
      </Row>

      <Row title="Log Out">
        <div className="ka-set__btns">
          <button type="button" className="ka-btn" disabled={leaving} onClick={() => signOut(false)}>Logout</button>
          <button type="button" className="ka-btn ka-btn--outline" disabled={leaving} onClick={() => setConfirmAll(true)}>Logout all devices</button>
        </div>
      </Row>

      <Modal open={confirmAll} title="Logout all devices" onClose={() => setConfirmAll(false)} width={420}>
        <p>You will be signed out everywhere, including this browser.</p>
        <div className="ka-actions">
          <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setConfirmAll(false)}>Cancel</button>
          <button type="button" className="ka-btn ka-btn--danger" disabled={leaving} onClick={() => signOut(true)}>{leaving ? 'Logging out…' : 'Log out everywhere'}</button>
        </div>
      </Modal>
    </div>
  )
}
