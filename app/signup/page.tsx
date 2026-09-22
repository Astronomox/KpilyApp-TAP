'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Navigation from '../components/Navigation'
import '@/styles/Auth.css'

export default function SignUp() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStepOne = (e) => {
    e.preventDefault()
    if (formData.email && formData.fullName) {
      setStep(2)
    }
  }

  const handleStepTwo = (e) => {
    e.preventDefault()
    if (formData.password === formData.confirmPassword) {
      console.log('Sign up:', formData)
      router.push('/register-success')
    }
  }

  return (
    <div className="signup-page">
      <Navigation />
      
      <div className="signup-container">
        <h1>Create Your KPILY Account</h1>
        
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        <form className="signup-form">
          {step === 1 ? (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

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
                <label>Company Name</label>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your Company"
                />
              </div>

              <button onClick={handleStepOne} className="auth-btn">Continue</button>
            </>
          ) : (
            <>
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

              <div className="form-actions">
                <button type="button" onClick={() => setStep(1)} className="secondary-btn">Back</button>
                <button onClick={handleStepTwo} className="auth-btn">Create Account</button>
              </div>
            </>
          )}
        </form>

        <p className="auth-footer">
          Already have an account? <Link href='/login'>Log in</Link>
        </p>
      </div>
    </div>
  )
}
