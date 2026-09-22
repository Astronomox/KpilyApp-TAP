'use client';

import Link from 'next/link'
import '@/styles/Auth.css'

export default function SuccessRegister() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img src="/assets/success-illustration.png" alt="Success" />
        </div>
        
        <div className="auth-right">
          <div className="auth-box success-box">
            <div className="success-icon">✓</div>
            <h1>Account Created!</h1>
            <p>Your account has been successfully created. You can now log in and start using KPILY.</p>
            
            <Link href='/login' className="auth-btn">Go to Login</Link>
            
            <p className="auth-footer">
              Return to <Link href='/'>Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
