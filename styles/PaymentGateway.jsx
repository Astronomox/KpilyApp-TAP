import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

export default function PaymentGateway() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Processing payment:', formData)
    navigate('/payment-success')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="payment-summary">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span>Professional Plan (Annual)</span>
              <span>$1,188</span>
            </div>
            <div className="summary-item">
              <span>Discount (10%)</span>
              <span>-$118.80</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>$1,069.20</span>
            </div>
          </div>
        </div>
        
        <div className="auth-right">
          <div className="auth-box">
            <h1>Payment Details</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name on Card</label>
                <input 
                  type="text" 
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="text" 
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn">Complete Payment</button>
            </form>

            <p className="payment-notice">
              Your payment information is secure and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
