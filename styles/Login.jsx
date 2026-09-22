import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../lib/api'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(event) { event.preventDefault(); setError(''); setLoading(true); try { await login({ email, password }); navigate('/dashboard') } catch (err) { setError(err.message || 'Unable to log in') } finally { setLoading(false) } }
  return <div className="auth-page"><div className="auth-container"><div className="auth-left"><img src="/assets/ref-login.jpg" alt="Login illustration" /></div><div className="auth-right"><div className="auth-box"><img src="/assets/logo.png" alt="KPILY" className="auth-logo" /><h1>Log In</h1><p style={{ color: '#748890', fontSize: 12, lineHeight: 1.6 }}>Enter your workspace credentials to continue.</p><form onSubmit={handleSubmit}><div className="form-group"><label>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div><div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div><Link to="/forgot-password" className="forgot-link">Forgot password?</Link>{error && <p role="alert" style={{ color: '#b65a50', fontSize: 11 }}>{error}</p>}<button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Signing in…' : 'Log In'}</button></form><div className="divider">OR</div><button className="social-btn google">Continue with Google</button><button className="social-btn microsoft">Continue with Microsoft</button><p className="auth-footer">Don't have an account? <Link to="/register">Sign up</Link></p></div></div></div></div>
}
