const API_BASE = import.meta.env.VITE_KPILY_API_BASE || 'https://kpily-api.azurewebsites.net'
const MODE = import.meta.env.VITE_KPILY_API_MODE || 'mock'

export const isMockMode = MODE !== 'real'

function unwrap(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid API response')
  if (payload.result && payload.result.status !== 0) {
    const error = new Error(payload.result.message || 'KPILY request failed')
    error.code = payload.result.status
    error.details = payload.result.details
    throw error
  }
  return payload.content ?? payload
}

async function request(path, { method = 'GET', body, token, formData = false } = {}) {
  const headers = {}
  if (!formData) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_BASE}${path}`, { method, headers, body: formData ? body : body ? JSON.stringify({ data: body }) : undefined })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload?.result?.message || `Request failed (${response.status})`)
  return unwrap(payload)
}

export async function login(credentials) {
  if (isMockMode) {
    if (!credentials.email || !credentials.password) throw new Error('Enter your email and password')
    const session = { token: 'mock-session-token', user: { id: '013c29557ab2', name: 'Elias Akin', email: credentials.email, privilege: 100, accountType: 1, title: 'Performance Lead' } }
    sessionStorage.setItem('kpily-session', JSON.stringify(session))
    return session
  }
  const content = await request('/v1/auth', { method: 'POST', body: { username: credentials.email, password: credentials.password } })
  const session = { token: content.token || content.accessToken, user: content.user || content.account || content }
  sessionStorage.setItem('kpily-session', JSON.stringify(session))
  return session
}

export function getSession() {
  try { return JSON.parse(sessionStorage.getItem('kpily-session') || 'null') } catch { return null }
}

export function clearSession() { sessionStorage.removeItem('kpily-session') }

export async function getDashboard(token) {
  if (isMockMode) return dashboardFixture
  return request('/v1/get-dashboard', { token })
}

export async function getTasks(token, filters = {}) {
  if (isMockMode) return taskFixtures.filter((task) => !filters.status || task.status === filters.status)
  return request('/v1/org/get-task', { method: 'POST', body: filters, token })
}

export async function getTask(token, id) {
  if (isMockMode) return taskFixtures.find((task) => task.id === id) || taskFixtures[0]
  return request(`/v1/org/get-task/${id}`, { token })
}

export async function createTask(token, task) {
  if (isMockMode) return { ...task, id: `task-${Date.now()}`, status: 'Assigned' }
  const form = new FormData()
  Object.entries(task).forEach(([key, value]) => value !== undefined && form.append(key, value))
  return request('/v1/org/create-task', { method: 'POST', body: form, token, formData: true })
}

export async function completeTask(token, id, point) {
  if (isMockMode) return { id, status: 'Completed', point }
  return request('/v1/org/complete-task', { method: 'PUT', body: { taskID: id, point }, token })
}

export async function addComment(token, comment) {
  if (isMockMode) return { ...comment, id: `comment-${Date.now()}`, createdAt: new Date().toISOString() }
  const form = new FormData()
  Object.entries(comment).forEach(([key, value]) => value !== undefined && form.append(key, value))
  return request('/v1/org/submit-comment', { method: 'POST', body: form, token, formData: true })
}

export const dashboardFixture = {
  points: 1240, level: 8, pointsToNext: 260, projectCompletion: 72, taskCompletion: 84, currentReward: 'Growth Champion', nextReward: 'Team Catalyst',
  tasksDue: 6, activeProjects: 4, notifications: 5, performanceDelta: '+12.8%',
  recentActivity: [
    { id: 1, initials: 'SA', title: 'Sarah accepted a task', meta: 'Launch the Q4 campaign · 12 min ago', tone: 'mint' },
    { id: 2, initials: 'MK', title: 'You received feedback', meta: 'Great progress on the onboarding flow · 1 hr ago', tone: 'blue' },
    { id: 3, initials: 'EA', title: 'Task completed', meta: 'Finalize KPI reporting · 3 hrs ago', tone: 'violet' },
  ],
}

export const taskFixtures = [
  { id: 'task-1', name: 'Finalize KPI reporting', description: 'Prepare the monthly performance report and share the key outcomes with the organization.', assignee: 'Elias Akin', dueDate: 'Today, 4:00 PM', goal: 'Monthly', reward: 80, status: 'In progress', priority: 'High', comments: 4, kpi: 88 },
  { id: 'task-2', name: 'Review onboarding feedback', description: 'Review recent comments from new teammates and identify the three highest-impact improvements.', assignee: 'Sarah Johnson', dueDate: 'Tomorrow', goal: 'Quarterly', reward: 55, status: 'Assigned', priority: 'Medium', comments: 2, kpi: 64 },
  { id: 'task-3', name: 'Prepare team catch-up', description: 'Create the agenda and invite the team to the next performance catch-up event.', assignee: 'Elias Akin', dueDate: 'Sep 25', goal: 'Monthly', reward: 40, status: 'Completed', priority: 'Low', comments: 8, kpi: 100 },
]

export const teamFixtures = [
  { id: '013c29557ab2', name: 'Elias Akin', title: 'Performance Lead', email: 'elias@kpily.com', avatar: '/kpily/avatar-03.png' },
  { id: '028d401a21dc', name: 'Sarah Johnson', title: 'Growth Manager', email: 'sarah@kpily.com', avatar: '/kpily/avatar-01.png' },
  { id: '028d401a21dd', name: 'Michael Kim', title: 'Product Designer', email: 'michael@kpily.com', avatar: '/kpily/avatar-05.png' },
]

export default { login, getSession, clearSession, getDashboard, getTasks, getTask, createTask, completeTask, addComment }
