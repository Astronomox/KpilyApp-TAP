import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Hook to backend here
    console.log({ email, password })
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img src="/assets/ref-login.jpg" alt="Login illustration" />
        </div>
        
        <div className="auth-right">
          <div className="auth-box">
            <img src="/assets/logo.png" alt="KPILY" className="auth-logo" />
            <h1>Log In</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>

              <button type="submit" className="auth-btn">Log In</button>
            </form>

            <div className="divider">OR</div>

            <button className="social-btn google">Continue with Google</button>
            <button className="social-btn microsoft">Continue with Microsoft</button>

            <p className="auth-footer">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
