export interface User {
  id: string
  name: string
  email: string
  privilege?: number
  accountType?: number
  title?: string
}

export interface Session {
  token: string
  user: User
}

export interface Credentials {
  email: string
  password: string
}

export interface Task {
  id: string
  name: string
  description: string
  assignee: string
  dueDate: string
  goal: string
  reward: number
  status: 'In progress' | 'Assigned' | 'Completed'
  priority: 'High' | 'Medium' | 'Low'
  comments: number
  kpi: number
}

export interface TaskFilters {
  status?: string
  [key: string]: any
}

export interface Dashboard {
  points: number
  level: number
  pointsToNext: number
  projectCompletion: number
  taskCompletion: number
  currentReward: string
  nextReward: string
  tasksDue: number
  activeProjects: number
  notifications: number
  performanceDelta: string
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: number
  initials: string
  title: string
  meta: string
  tone: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  email: string
  avatar: string
}

export interface Comment {
  id?: string
  taskId?: string
  content?: string
  createdAt?: string
  [key: string]: any
}

const API_BASE = process.env.NEXT_PUBLIC_KPILY_API_BASE || 'https://kpily-api.azurewebsites.net'
const MODE = process.env.NEXT_PUBLIC_KPILY_API_MODE || 'mock'

export const isMockMode = MODE !== 'real'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  token?: string
  formData?: boolean
}

interface ApiResponse<T = any> {
  result?: {
    status: number
    message?: string
    details?: any
  }
  content?: T
  [key: string]: any
}

function unwrap<T = any>(payload: ApiResponse<T>): T {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid API response')
  if (payload.result && payload.result.status !== 0) {
    const error = new Error(payload.result.message || 'KPILY request failed') as Error & { code?: number; details?: any }
    error.code = payload.result.status
    error.details = payload.result.details
    throw error
  }
  return (payload.content ?? payload) as T
}

async function request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, formData = false } = options
  const headers: HeadersInit = {}
  
  if (!formData) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData 
      ? body 
      : body 
        ? JSON.stringify({ data: body }) 
        : undefined
  })
  
  const payload: ApiResponse<T> = await response.json()
  
  if (!response.ok) {
    throw new Error(payload?.result?.message || `Request failed (${response.status})`)
  }
  
  return unwrap<T>(payload)
}

export async function login(credentials: Credentials): Promise<Session> {
  if (isMockMode) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Enter your email and password')
    }
    const session: Session = {
      token: 'mock-session-token',
      user: {
        id: '013c29557ab2',
        name: 'Elias Akin',
        email: credentials.email,
        privilege: 100,
        accountType: 1,
        title: 'Performance Lead'
      }
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kpily-session', JSON.stringify(session))
    }
    return session
  }
  
  const content = await request<{ token?: string; accessToken?: string; user?: User; account?: User }>('/v1/auth', {
    method: 'POST',
    body: { username: credentials.email, password: credentials.password }
  })
  
  const session: Session = {
    token: content.token || content.accessToken || '',
    user: content.user || content.account || { id: '', name: '', email: '' }
  }
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('kpily-session', JSON.stringify(session))
  }
  
  return session
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  
  try {
    return JSON.parse(sessionStorage.getItem('kpily-session') || 'null')
  } catch {
    return null
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('kpily-session')
  }
}

export async function getDashboard(token?: string): Promise<Dashboard> {
  if (isMockMode) return dashboardFixture
  return request<Dashboard>('/v1/get-dashboard', { token })
}

export async function getTasks(token?: string, filters: TaskFilters = {}): Promise<Task[]> {
  if (isMockMode) {
    return taskFixtures.filter((task) => !filters.status || task.status === filters.status)
  }
  return request<Task[]>('/v1/org/get-task', { method: 'POST', body: filters, token })
}

export async function getTask(token?: string, id?: string): Promise<Task> {
  if (isMockMode) {
    return taskFixtures.find((task) => task.id === id) || taskFixtures[0]
  }
  return request<Task>(`/v1/org/get-task/${id}`, { token })
}

export async function createTask(token: string, task: Partial<Task>): Promise<Task> {
  if (isMockMode) {
    return {
      ...task,
      id: `task-${Date.now()}`,
      status: 'Assigned'
    } as Task
  }
  
  const form = new FormData()
  Object.entries(task).forEach(([key, value]) => {
    if (value !== undefined) {
      form.append(key, value as string | Blob)
    }
  })
  
  return request<Task>('/v1/org/create-task', { method: 'POST', body: form, token, formData: true })
}

export async function completeTask(token: string, id: string, point: number): Promise<Task> {
  if (isMockMode) {
    return { id, status: 'Completed', point } as Task
  }
  return request<Task>('/v1/org/complete-task', { method: 'PUT', body: { taskID: id, point }, token })
}

export async function addComment(token: string, comment: Comment): Promise<Comment> {
  if (isMockMode) {
    return { ...comment, id: `comment-${Date.now()}`, createdAt: new Date().toISOString() }
  }
  
  const form = new FormData()
  Object.entries(comment).forEach(([key, value]) => {
    if (value !== undefined) {
      form.append(key, value as string | Blob)
    }
  })
  
  return request<Comment>('/v1/org/submit-comment', { method: 'POST', body: form, token, formData: true })
}

export const dashboardFixture: Dashboard = {
  points: 1240,
  level: 8,
  pointsToNext: 260,
  projectCompletion: 72,
  taskCompletion: 84,
  currentReward: 'Growth Champion',
  nextReward: 'Team Catalyst',
  tasksDue: 6,
  activeProjects: 4,
  notifications: 5,
  performanceDelta: '+12.8%',
  recentActivity: [
    { id: 1, initials: 'SA', title: 'Sarah accepted a task', meta: 'Launch the Q4 campaign · 12 min ago', tone: 'mint' },
    { id: 2, initials: 'MK', title: 'You received feedback', meta: 'Great progress on the onboarding flow · 1 hr ago', tone: 'blue' },
    { id: 3, initials: 'EA', title: 'Task completed', meta: 'Finalize KPI reporting · 3 hrs ago', tone: 'violet' }
  ]
}

export const taskFixtures: Task[] = [
  {
    id: 'task-1',
    name: 'Finalize KPI reporting',
    description: 'Prepare the monthly performance report and share the key outcomes with the organization.',
    assignee: 'Elias Akin',
    dueDate: 'Today, 4:00 PM',
    goal: 'Monthly',
    reward: 80,
    status: 'In progress',
    priority: 'High',
    comments: 4,
    kpi: 88
  },
  {
    id: 'task-2',
    name: 'Review onboarding feedback',
    description: 'Review recent comments from new teammates and identify the three highest-impact improvements.',
    assignee: 'Sarah Johnson',
    dueDate: 'Tomorrow',
    goal: 'Quarterly',
    reward: 55,
    status: 'Assigned',
    priority: 'Medium',
    comments: 2,
    kpi: 64
  },
  {
    id: 'task-3',
    name: 'Prepare team catch-up',
    description: 'Create the agenda and invite the team to the next performance catch-up event.',
    assignee: 'Elias Akin',
    dueDate: 'Sep 25',
    goal: 'Monthly',
    reward: 40,
    status: 'Completed',
    priority: 'Low',
    comments: 8,
    kpi: 100
  }
]

export const teamFixtures: TeamMember[] = [
  { id: '013c29557ab2', name: 'Elias Akin', title: 'Performance Lead', email: 'elias@kpily.com', avatar: '/kpily/avatar-03.png' },
  { id: '028d401a21dc', name: 'Sarah Johnson', title: 'Growth Manager', email: 'sarah@kpily.com', avatar: '/kpily/avatar-01.png' },
  { id: '028d401a21dd', name: 'Michael Kim', title: 'Product Designer', email: 'michael@kpily.com', avatar: '/kpily/avatar-05.png' }
]

export default { login, getSession, clearSession, getDashboard, getTasks, getTask, createTask, completeTask, addComment }
