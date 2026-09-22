import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

export default function OnboardCompany() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    teamSize: '',
    integrations: []
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        integrations: checked 
          ? [...prev.integrations, value]
          : prev.integrations.filter(i => i !== value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleComplete = () => {
    console.log('Onboard data:', formData)
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="onboard-container">
        <div className="onboard-left">
          <div className="step-tracker">
            <h2>Setup Progress</h2>
            <div className="steps">
              <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                <span>1</span>
                <label>Company Info</label>
              </div>
              <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                <span>2</span>
                <label>Team Details</label>
              </div>
              <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                <span>3</span>
                <label>Integrations</label>
              </div>
            </div>
          </div>
        </div>

        <div className="onboard-right">
          <div className="auth-box">
            <h1>Setup Your Workspace</h1>

            {step === 1 && (
              <>
                <div className="form-group">
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Industry</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} required>
                    <option value="">Select an industry</option>
                    <option value="tech">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label>Team Size</label>
                  <select name="teamSize" value={formData.teamSize} onChange={handleChange} required>
                    <option value="">Select team size</option>
                    <option value="1-10">1-10 people</option>
                    <option value="11-50">11-50 people</option>
                    <option value="51-100">51-100 people</option>
                    <option value="100+">100+ people</option>
                  </select>
                </div>

                <p className="info-text">
                  We'll help you invite your team members in the next step.
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <p className="info-text">
                  Connect your favorite tools to sync data automatically.
                </p>
                
                <div className="checkbox-group">
                  <label className="checkbox">
                    <input 
                      type="checkbox"
                      value="slack"
                      checked={formData.integrations.includes('slack')}
                      onChange={handleChange}
                    />
                    Slack
                  </label>
                  <label className="checkbox">
                    <input 
                      type="checkbox"
                      value="github"
                      checked={formData.integrations.includes('github')}
                      onChange={handleChange}
                    />
                    GitHub
                  </label>
                  <label className="checkbox">
                    <input 
                      type="checkbox"
                      value="jira"
                      checked={formData.integrations.includes('jira')}
                      onChange={handleChange}
                    />
                    Jira
                  </label>
                  <label className="checkbox">
                    <input 
                      type="checkbox"
                      value="google-drive"
                      checked={formData.integrations.includes('google-drive')}
                      onChange={handleChange}
                    />
                    Google Drive
                  </label>
                </div>
              </>
            )}

            <div className="form-actions">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="secondary-btn">
                  Back
                </button>
              )}
              {step < 3 ? (
                <button onClick={handleNext} className="auth-btn">Next</button>
              ) : (
                <button onClick={handleComplete} className="auth-btn">Complete Setup</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
