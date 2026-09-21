# API Integration Guide

## Quick Start

Each page form is ready for backend integration. Here's how to hook them up.

## Authentication Service

Create `src/services/authService.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error('Login failed')
    const data = await response.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  },

  register: async (email, password, fullName, companyName) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, companyName })
    })
    if (!response.ok) throw new Error('Registration failed')
    return response.json()
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!response.ok) throw new Error('Request failed')
    return response.json()
  },

  changePassword: async (currentPassword, newPassword) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    })
    if (!response.ok) throw new Error('Password change failed')
    return response.json()
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}
```

## Using in Components

### Login Page Example

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await authService.login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // ... existing JSX ...
    {error && <div className="error-message">{error}</div>}
    // ... rest of form ...
  )
}
```

## API Endpoints Expected

### Authentication
```
POST /api/auth/register
  Request: { email, password, fullName, companyName }
  Response: { user: {...}, token: "jwt..." }

POST /api/auth/login
  Request: { email, password }
  Response: { user: {...}, token: "jwt..." }

POST /api/auth/forgot-password
  Request: { email }
  Response: { message: "Reset link sent" }

POST /api/auth/reset-password
  Request: { token, newPassword }
  Response: { message: "Password reset" }

POST /api/auth/change-password
  Request: { currentPassword, newPassword }
  Response: { message: "Password changed" }
  Headers: Authorization: Bearer <token>
```

### Payments
```
POST /api/payments/create-intent
  Request: { amount, currency }
  Response: { clientSecret: "..." }
  Headers: Authorization: Bearer <token>

POST /api/payments/process
  Request: { cardToken, amount }
  Response: { orderId: "...", status: "success" }
  Headers: Authorization: Bearer <token>
```

### Onboarding
```
POST /api/onboarding/complete
  Request: { companyName, industry, teamSize, integrations }
  Response: { workspace: {...} }
  Headers: Authorization: Bearer <token>
```

### Dashboard
```
GET /api/kpis
  Response: [{ label, value, change }, ...]
  Headers: Authorization: Bearer <token>

GET /api/activity
  Response: [{ action, timestamp, user }, ...]
  Headers: Authorization: Bearer <token>
```

## Error Handling

Create `src/hooks/useAPI.js`:

```javascript
import { useState } from 'react'

export const useAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = async (fn) => {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { call, loading, error }
}
```

Usage:
```javascript
const { call, loading, error } = useAPI()

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    await call(() => authService.login(email, password))
    navigate('/dashboard')
  } catch (err) {
    // error is already set
  }
}
```

## Authentication Guard

Create `src/components/ProtectedRoute.jsx`:

```javascript
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
```

Use in App.jsx:
```javascript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Token Management

Add to `src/services/tokenService.js`:

```javascript
export const tokenService = {
  get: () => localStorage.getItem('token'),
  
  set: (token) => {
    localStorage.setItem('token', token)
  },
  
  remove: () => {
    localStorage.removeItem('token')
  },
  
  isExpired: () => {
    const token = localStorage.getItem('token')
    if (!token) return true
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}
```

## API Request Interceptor

Create `src/services/apiClient.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const apiClient = {
  get: async (path) => {
    const response = await fetch(`${API_URL}${path}`, {
      headers: getHeaders()
    })
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    if (!response.ok) throw new Error('API Error')
    return response.json()
  },

  post: async (path, data) => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    if (!response.ok) throw new Error('API Error')
    return response.json()
  }
}
```

## Example: Connecting Dashboard to API

```javascript
// pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { apiClient } from '../services/apiClient'

export default function Dashboard() {
  const [kpis, setKpis] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpisData, activityData] = await Promise.all([
          apiClient.get('/api/kpis'),
          apiClient.get('/api/activity')
        ])
        setKpis(kpisData)
        setActivity(activityData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  // ... rest of component using kpis and activity
}
```

## Stripe Integration (Optional)

```bash
npm install @stripe/react-stripe-js @stripe/js
```

```javascript
// pages/PaymentGateway.jsx
import { loadStripe } from '@stripe/js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripe = loadStripe('YOUR_PUBLISHABLE_KEY')

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()

  const handlePayment = async (e) => {
    e.preventDefault()
    
    const { token } = await stripe.createToken(elements.getElement(CardElement))
    
    // Send token to backend
    const response = await fetch('/api/payments/process', {
      method: 'POST',
      body: JSON.stringify({ token: token.id, amount: 10069 })
    })
  }

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <button type="submit">Pay</button>
    </form>
  )
}
```

## Testing API Calls

Mock data for development:

```javascript
// src/mock/data.js
export const mockUser = {
  id: '123',
  email: 'user@example.com',
  fullName: 'John Doe',
  companyName: 'Acme Corp'
}

export const mockKpis = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+12.5%' },
  { label: 'Active Users', value: '1,234', change: '+8.2%' }
]
```

Use in development with a toggle:
```javascript
const USE_MOCK = import.meta.env.DEV

const getKpis = async () => {
  return USE_MOCK ? mockKpis : await apiClient.get('/api/kpis')
}
```
