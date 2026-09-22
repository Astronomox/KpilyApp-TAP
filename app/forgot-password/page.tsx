'use client';

import { Link } from 'react-router-dom'
import { useState } from 'react'
import '@/styles/Auth.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Reset password for:', email)
    setSubmitted(true)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img src="/assets/ref-login.jpg" alt="Password reset" />
        </div>
        
        <div className="auth-right">
          <div className="auth-box">
            <img src="/assets/logo.png" alt="KPILY" className="auth-logo" />
            <h1>Reset Password</h1>
            
            {!submitted ? (
              <>
                <p className="auth-subtitle">Enter your email to receive reset instructions</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <button type="submit" className="auth-btn">Send Reset Link</button>
                </form>
              </>
            ) : (
              <div className="success-message">
                <p>Check your email for password reset instructions</p>
              </div>
            )}

            <p className="auth-footer">
              Remember your password? <Link href='/login'>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
