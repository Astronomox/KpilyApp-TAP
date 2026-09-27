// Client for the live KPILY API (Postman: documenter.getpostman.com/view/938562/2s93ecupat).
// Every request body is wrapped as { data: {...} }; every response is
// { result: { status, message, details }, content } where status 0 = success.

import { envelopeSchema, sessionSchema } from './schemas'

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
  try {
    const parsed = envelopeSchema.safeParse(await res.json())
    if (parsed.success) body = parsed.data as Envelope<T>
  } catch { /* non-JSON error page */ }

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
/** Presence flag read by proxy.ts to guard /dashboard before any page loads (the token stays in storage). */
export const SESSION_COOKIE = 'kpily_signed_in'
const setCookie = (on: boolean) => {
  try { document.cookie = `${SESSION_COOKIE}=${on ? '1' : ''}; path=/; SameSite=Lax${on ? '' : '; Max-Age=0'}` } catch { /* no document */ }
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = sessionSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) { clearSession(); return null }
    if (!document.cookie.includes(`${SESSION_COOKIE}=1`)) setCookie(true)
    return parsed.data as Session
  } catch { return null }
}

function saveSession(s: Session, remember: boolean) {
  try {
    clearSession()
    ;(remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(s))
    setCookie(true)
  } catch { /* storage blocked: session lives for this page only */ }
}

export function clearSession() {
  try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY) } catch { /* ignore */ }
  setCookie(false)
}

// ---------- Account ----------

export async function login(email: string, password: string, remember = false): Promise<Session> {
  const content = sessionSchema.parse(await request<unknown>('/v1/auth', { method: 'POST', data: { username: email.trim(), password } })) as Session
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

// ---------- App shell ----------

export type Notification = { id: string; owner: string; transDate: number; message: string; orgID: string; read: boolean; action: number; actionID: string | null }
export const getNotifications = () => request<{ notifications: Notification[] }>('/v1/get-notification', { auth: true }).then((c) => c.notifications || [])

export type Member = { id: string; fullname: string; email: string; team: string | null; point: number; privilege: number; designation: string | null; status: number; profilePicture: string | null; externalID?: string }
/** Members of a team; '-' = the whole organisation. */
export const getMembers = (team = '-') => request<{ users: Member[] }>(`/v1/get-member/${team}`, { auth: true }).then((c) => c.users || [])

export type LoginSession = { id: string; username: string; dateCreated: number; ip: string; useragent: string; active: boolean }
export const getActiveSessions = () => request<{ logins: LoginSession[] }>('/v1/get-active-session', { auth: true }).then((c) => c.logins || [])

/** Revokes every signed-in session, or just one when an id is given. */
export const endSession = (sessionID: string) => request<unknown>(`/v1/logout/${sessionID}`, { method: 'POST', auth: true })

export const updateProfile = (data: { fullname?: string; phone?: string; gender?: string }) =>
  request<unknown>('/v1/update-profile', { method: 'PUT', data, auth: true })

export function uploadProfileImage(file: File) {
  const form = new FormData()
  form.append('file', file)
  return request<unknown>('/v1/org/upload-image', { method: 'POST', form, auth: true })
}

// ---------- Overview ----------

export type Rate = { title: string | null; value: number; lastMonthValue: number; difference: number | string; increase: boolean }
export type Dashboard = {
  taskCompletionRate: Rate; positiveFeedback: Rate; responseRate: Rate; feedBackRate: Rate; improvementRate: Rate; recognitionRate: Rate
  pointsThisYear: { month: number; value: number }[]
  teamProgress: { teamName: string | null; teamID: string; workInProgress: number; completed: number; awaitingApproval: number }[]
}
export const getDashboard = () => request<Dashboard>('/v1/get-dashboard', { auth: true })

export type Team = { id: string; teamName: string; teamLeader?: string; color?: string; reportsTo?: string; members?: number; [key: string]: unknown }
export const getTeams = () => request<{ teams: Team[] }>('/v1/org/get-team/-', { auth: true }).then((c) => c.teams || [])

// ---------- Tasks ----------

export const TASK_STATUS = ['New', 'Accepted', 'Reviewed', 'Completed', 'Submitted'] as const
export type Task = {
  id: string; name: string; details: string; dueDate: number; goal: number; assignee: string; createdBy: string
  reward: number; finalReward: number; status: number; replies: number; teamID: string; teamName: string | null; dateCreated: string
  contributors: unknown[]; attachment: unknown
}
/** The API stores due dates in seconds, but some older tasks hold milliseconds. */
export const dueMs = (t: { dueDate: number }) => (t.dueDate > 1e12 ? t.dueDate : t.dueDate * 1000)

export const getTasks = () => request<{ data: Task[] }>('/v1/org/get-task', { method: 'POST', data: {}, auth: true }).then((c) => c.data || [])

export type TaskInput = { name: string; details: string; dueDate: Date; goal: number; assignee: string; reward: number; files?: File[] }
function taskForm(t: TaskInput & { id?: string }) {
  const form = new FormData()
  if (t.id) form.append('id', t.id)
  form.append('name', t.name)
  form.append('details', t.details)
  form.append('dueDate', String(Math.floor(t.dueDate.getTime() / 1000)))
  form.append('goal', String(t.goal))
  form.append('assignee', t.assignee)
  form.append('reward', String(t.reward))
  for (const f of t.files || []) form.append('files', f)
  return form
}
export const createTask = (t: TaskInput) => request<unknown>('/v1/org/create-task', { method: 'POST', form: taskForm(t), auth: true })
export const updateTask = (id: string, t: TaskInput) => request<unknown>('/v1/org/update-task', { method: 'PUT', form: taskForm({ ...t, id }), auth: true })
export const deleteTask = (id: string) => request<unknown>(`/v1/org/task/${id}`, { method: 'DELETE', auth: true })
export const acceptTask = (taskID: string) => request<unknown>('/v1/org/accept-task', { method: 'PUT', data: { taskID }, auth: true })
export const submitTask = (taskID: string) => request<unknown>('/v1/org/submit-task', { method: 'PUT', data: { taskID }, auth: true })
export const completeTask = (taskID: string, point: number) => request<unknown>('/v1/org/complete-task', { method: 'PUT', data: { taskID, point }, auth: true })
export function reviewTask(taskID: string, message: string) {
  const form = new FormData()
  form.append('taskID', taskID)
  form.append('message', message)
  return request<unknown>('/v1/org/review-task', { method: 'PUT', form, auth: true })
}

// ---------- Calendar ----------

export type Person = { id: string; fullname: string | null; username: string }
export type CalEvent = {
  id: string; name: string; details: string; time: number; endTime?: number; organizer?: Person; attendees: Person[]
  phyicalLocation: string | null; onlineLocation: string | null
}
export type EventInput = { name: string; details: string; time: number; endTime?: number; attendees: Person[]; phyicalLocation?: string; onlineLocation?: string }

export const getEvents = () => request<CalEvent[]>('/v1/org/get-event/-', { auth: true }).then((c) => c || [])
export const createEvent = (e: EventInput) => request<unknown>('/v1/org/create-event', { method: 'POST', data: e, auth: true })
export const updateEvent = (id: string, e: EventInput) => request<unknown>('/v1/org/update-event', { method: 'PUT', data: { ...e, id }, auth: true })

// ---------- Staff & teams ----------

export type InviteInput = { email: string; fullname: string; team?: string; privilege: number; designation?: string }
export const inviteUser = (data: InviteInput) => request<unknown>('/v1/invite-user', { method: 'POST', data, auth: true })
/** 1 = active, 0 = pending, -1 = archived, -2 = deleted. */
export const changeUserStatus = (username: string, status: number) => request<unknown>('/v1/change-user-status', { method: 'POST', data: { username, status }, auth: true })
export const changeUserPrivilege = (data: { username: string; team?: string; privilege: number; designation?: string }) =>
  request<unknown>('/v1/org/change-user-privilege', { method: 'POST', data, auth: true })

export type TeamInput = { teamName: string; teamLeader: string; color: string; reportsTo: string }
export const createTeam = (data: TeamInput) => request<unknown>('/v1/org/create-team', { method: 'POST', data, auth: true })
export const updateTeam = (id: string, data: TeamInput) => request<unknown>('/v1/org/update-team', { method: 'PUT', data: { ...data, id }, auth: true })

// ---------- Organisation ----------

export type Organization = {
  id: string; compnayName?: string; companyName?: string; companyWebsite?: string; mailDomain?: string; country?: string; state?: string
  employeeBand?: string[] | string; industry?: string; logoURL?: string | null; currentPlan?: string | null; planExpiry?: number
}
/** Company name (the API spells the field "compnayName"). */
export const orgName = (o?: Organization | null) => o?.companyName || o?.compnayName || ''

export const updateOrg = (data: { companyName: string; companyWebsite?: string; mailDomain: string; industry: string; country: string; state: string; employeeBand?: string }) =>
  request<unknown>('/v1/org/update', { method: 'PUT', data, auth: true })

export function uploadOrgLogo(file: File) {
  const form = new FormData()
  form.append('file', file)
  return request<unknown>('/v1/org/upload-org-image', { method: 'POST', form, auth: true })
}

/** Keeps the stored session in step with profile edits made in the app. */
export function updateStoredProfile(patch: Partial<Profile>) {
  try {
    for (const store of [localStorage, sessionStorage]) {
      const raw = store.getItem(KEY)
      if (!raw) continue
      const s = JSON.parse(raw) as Session
      store.setItem(KEY, JSON.stringify({ ...s, profile: { ...s.profile, ...patch } }))
    }
  } catch { /* storage blocked */ }
}

// ---------- Subscription ----------

export type Subscription = { id?: string; planID: string; planName?: string; accounts: number; subscriptionType: number; status?: number; startDate?: number; endDate?: number; amount?: number; [key: string]: unknown }
export const getSubscriptions = () => request<{ subscription: Subscription[] }>('/v1/org/get-subscription', { auth: true }).then((c) => c.subscription || [])
/** subscriptionType: 1 = monthly, 2 = yearly. */
export const subscribe = (planID: string, accounts: number, subscriptionType: number) =>
  request<unknown>('/v1/org/subscribe', { method: 'POST', data: { planID, accounts, subscriptionType }, auth: true })

/** Checks a password without replacing the stored session. */
export const verifyPassword = (email: string, password: string) =>
  request<Session>('/v1/auth', { method: 'POST', data: { username: email.trim(), password } }).then(() => true)
