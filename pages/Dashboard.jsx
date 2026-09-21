import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Pages.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user] = useState({ name: 'John Doe', email: 'john@example.com' })

  const handleLogout = () => {
    navigate('/login')
  }

  const kpis = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+12.5%' },
    { label: 'Active Users', value: '1,234', change: '+8.2%' },
    { label: 'Conversion Rate', value: '3.24%', change: '+2.1%' },
    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.3' }
  ]

  const recentActivity = [
    { action: 'Team member joined', timestamp: '2 hours ago', user: 'Sarah Johnson' },
    { action: 'Goal completed', timestamp: '5 hours ago', goal: 'Q3 Revenue Target' },
    { action: 'Report generated', timestamp: '1 day ago', report: 'Monthly Analytics' },
    { action: 'Integration connected', timestamp: '2 days ago', service: 'Slack' }
  ]

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Welcome back, {user.name}</p>
        </div>
        
        <div className="header-actions">
          <button className="icon-btn">🔔</button>
          <div className="user-menu">
            <img src="/public/assets/logo.png" alt="Avatar" className="avatar" />
            <div className="menu-items">
              <Link to="/change-password">Change Password</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="sidebar">
          <ul>
            <li><Link to="/dashboard" className="active">Dashboard</Link></li>
            <li><Link to="/dashboard">Analytics</Link></li>
            <li><Link to="/dashboard">Team</Link></li>
            <li><Link to="/dashboard">Settings</Link></li>
            <li><Link to="/dashboard">Help</Link></li>
          </ul>
        </nav>

        <main className="dashboard-main">
          <section className="kpi-section">
            <h2>Key Performance Indicators</h2>
            <div className="kpi-grid">
              {kpis.map((kpi, index) => (
                <div key={index} className="kpi-card">
                  <label>{kpi.label}</label>
                  <div className="kpi-value">{kpi.value}</div>
                  <span className="kpi-change positive">{kpi.change}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((item, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-info">
                    <span className="activity-action">{item.action}</span>
                    {item.user && <span className="activity-detail">{item.user}</span>}
                    {item.goal && <span className="activity-detail">{item.goal}</span>}
                    {item.report && <span className="activity-detail">{item.report}</span>}
                    {item.service && <span className="activity-detail">{item.service}</span>}
                  </div>
                  <span className="activity-time">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-card">
                📊 Create Report
              </button>
              <button className="action-card">
                👥 Invite Team Member
              </button>
              <button className="action-card">
                ⚙️ Configure KPIs
              </button>
              <button className="action-card">
                🔗 Add Integration
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
