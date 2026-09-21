import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BlogPost from './pages/BlogPost'
import Blog from './pages/Blog'
import Register from './pages/Register'
import SuccessRegister from './pages/SuccessRegister'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'
import PaymentGateway from './pages/PaymentGateway'
import PricingPage from './pages/PricingPage'
import PaymentSuccess from './pages/PaymentSuccess'
import SignUp from './pages/SignUp'
import OnboardCompany from './pages/OnboardCompany'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog-post" element={<BlogPost />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<SuccessRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/onboard" element={<OnboardCompany />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
