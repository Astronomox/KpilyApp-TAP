// Client for the live KPILY API (Postman: documenter.getpostman.com/view/938562/2s93ecupat).
// Every request body is wrapped as { data: {...} }; every response is
// { result: { status, message, details }, content } where status 0 = success.

export const API_BASE = (process.env.NEXT_PUBLIC_KPILY_API_BASE || 'https://kpapis-cac9fhczeadxbvhm.uksouth-01.azurewebsites.net').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  code: string
  httpStatus: number
  constructor(message: string, code: string, status: number, httpStatus: number) {
    super(message)
    this.code = code
    this.status = status
    this.httpStatus = httpStatus
  }
}

type Envelope<T> = { result?: { message?: string; status?: number; details?: unknown }; content?: T }

const FRIENDLY: Record<string, string> = {
  ACCESS_DENIED_ERROR: 'Your session has expired. Please log in again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
}

type Options = { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; data?: unknown; form?: FormData; auth?: boolean }

export async function request<T>(path: string, { method = 'GET', data, form, auth = false }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (!form && data !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getSession()?.token
    if (!token) throw new ApiError(FRIENDLY.ACCESS_DENIED_ERROR, 'NO_SESSION', -1, 401)
    headers.Authorization = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, { method, headers, body: form ?? (data !== undefined ? JSON.stringify({ data }) : undefined) })
  } catch {
    throw new ApiError('We could not reach KPILY. Check your connection and try again.', 'NETWORK_ERROR', -1, 0)
  }

  let body: Envelope<T> | null = null
  try { body = await res.json() } catch { /* non-JSON error page */ }

  const result = body?.result
  if (!res.ok || !result || result.status !== 0) {
    const code = result?.message || `HTTP_${res.status}`
    const details = typeof result?.details === 'string' ? result.details : ''
    if (res.status === 401) clearSession()
    throw new ApiError(details || FRIENDLY[code] || `Request failed (${res.status})`, code, result?.status ?? -1, res.status)
  }
  return body!.content as T
}

// ---------- Session ----------

export type Profile = {
  fullname: string
  email: string
  username: string
  orgID: string | null
  teamID: string | null
  gender?: string
  privilege: number
  type: number
  point: number
  organization?: Record<string, unknown>
  [key: string]: unknown
}
export type Session = { token: string; profile: Profile; redirectToPlanPage?: boolean }

const KEY = 'kpily.session'

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch { return null }
}

function saveSession(s: Session, remember: boolean) {
  try {
    clearSession()
    ;(remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(s))
  } catch { /* storage blocked: session lives for this page only */ }
}

export function clearSession() {
  try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY) } catch { /* ignore */ }
}

// ---------- Account ----------

export async function login(email: string, password: string, remember = false): Promise<Session> {
  const content = await request<Session>('/v1/auth', { method: 'POST', data: { username: email.trim(), password } })
  saveSession(content, remember)
  return content
}

export async function logout() {
  try { await request('/v1/logout', { method: 'POST', auth: true }) } finally { clearSession() }
}

export const getSelf = () => request<{ user: Profile }>('/v1/get-self', { auth: true }).then((c) => c.user)

/** Step 1 of registration: emails a verification link to a work address. */
export const requestVerification = (email: string) =>
  request<unknown>('/v1/mail-verify', { method: 'POST', data: { email: email.trim() } })

export type Invitation = { email: string; hash: string; team: string | null; fullname: string | null; privilege: number; isNew: boolean; orgID: string | null }

/** Step 2: the code from the emailed link. */
export const verifyInvitation = (code: string) =>
  request<{ invitation: Invitation }>(`/v1/mail-verify/${encodeURIComponent(code)}`).then((c) => c.invitation)

export type OnboardInput = {
  verification: string; email: string; firstName: string; lastName: string; gender: string; phone: string; password: string
  companyName?: string; employeeBand?: string; industry?: string; country?: string; state?: string; companyWebsite?: string; logo?: File | null
}

/** Step 3: completes a new organisation (or invited member) registration. */
export function onboard(input: OnboardInput) {
  const form = new FormData()
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null || v === '') continue
    form.append(k, v instanceof File ? v : String(v))
  }
  return request<unknown>('/v1/org/onboard', { method: 'POST', form })
}

export const startPasswordReset = (email: string) =>
  request<unknown>('/v1/reset-password/1', { method: 'POST', data: { email: email.trim() } })

export const finishPasswordReset = (code: string, password: string) =>
  request<unknown>('/v1/reset-password/2', { method: 'POST', data: { code, password } })

export const updatePassword = (password: string) =>
  request<unknown>('/v1/update-password', { method: 'PUT', data: { password }, auth: true })

// ---------- Plans ----------

export type Plan = { id: string; planName: string; maxEmployee: number; minEmployee: number; costPerMonth: number; costPerYear: number; details: string }

export const getPlans = () => request<{ plans: Plan[] }>('/v1/get-plans').then((c) => c.plans)
