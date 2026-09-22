import { useState } from 'react'
import './Auth.css'

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    console.log('Change password:', formData)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img src="/assets/ref-login.jpg" alt="Change password" />
        </div>
        
        <div className="auth-right">
          <div className="auth-box">
            <img src="/assets/logo.png" alt="KPILY" className="auth-logo" />
            <h1>Change Password</h1>
            
            {success && <div className="success-message">Password changed successfully!</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="auth-btn">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
