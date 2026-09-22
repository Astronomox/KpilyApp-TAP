'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '@/styles/Auth.css'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    console.log('Register:', formData)
    // After successful registration
    router.push('/register-success')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img src="/assets/ref-login.jpg" alt="Register illustration" />
        </div>
        
        <div className="auth-right">
          <div className="auth-box">
            <img src="/assets/logo.png" alt="KPILY" className="auth-logo" />
            <h1>Create Account</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <label className="checkbox">
                <input 
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                I agree to Terms & Conditions
              </label>

              <button type="submit" className="auth-btn">Create Account</button>
            </form>

            <div className="divider">OR</div>

            <button className="social-btn google">Sign up with Google</button>
            <button className="social-btn microsoft">Sign up with Microsoft</button>

            <p className="auth-footer">
              Already have an account? <Link href='/login'>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
