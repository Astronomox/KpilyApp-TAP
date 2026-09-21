import { Link } from 'react-router-dom'
import './Auth.css'

export default function SuccessRegister() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img src="/public/assets/success-illustration.png" alt="Success" />
        </div>
        
        <div className="auth-right">
          <div className="auth-box success-box">
            <div className="success-icon">✓</div>
            <h1>Account Created!</h1>
            <p>Your account has been successfully created. You can now log in and start using KPILY.</p>
            
            <Link to="/login" className="auth-btn">Go to Login</Link>
            
            <p className="auth-footer">
              Return to <Link to="/">Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
