import { Link } from 'react-router-dom'
import './Auth.css'

export default function PaymentSuccess() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img src="/public/assets/success-illustration.png" alt="Payment success" />
        </div>
        
        <div className="auth-right">
          <div className="auth-box success-box">
            <div className="success-icon">✓</div>
            <h1>Payment Successful</h1>
            <p>Your subscription has been activated. You can now access all features of your plan.</p>
            
            <div className="receipt">
              <h3>Order Confirmation</h3>
              <div className="receipt-item">
                <span>Order ID:</span>
                <span>#KPL-2024-001234</span>
              </div>
              <div className="receipt-item">
                <span>Plan:</span>
                <span>Professional (Annual)</span>
              </div>
              <div className="receipt-item">
                <span>Amount:</span>
                <span>$1,069.20</span>
              </div>
            </div>

            <Link to="/dashboard" className="auth-btn">Go to Dashboard</Link>
            
            <p className="auth-footer">
              Check your email for a receipt and confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
