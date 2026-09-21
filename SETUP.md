# KPILY React App - Setup Guide

## Project Structure

```
KPILY/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   └── Navigation.css
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ChangePassword.jsx
│   │   ├── SuccessRegister.jsx
│   │   ├── SignUp.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── PricingPage.jsx
│   │   ├── PaymentGateway.jsx
│   │   ├── PaymentSuccess.jsx
│   │   ├── OnboardCompany.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Pages.css
│   │   └── Auth.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
│   └── assets/
│       ├── logo.png
│       ├── logos/
│       ├── landing/
│       ├── iconography/
│       └── decorations/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── SETUP.md (this file)
```

## Installation

### 1. Install Dependencies
```bash
cd KPILY
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```
Output goes to `/dist` folder

## Routes Available

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | LandingPage | Home page with features and CTA |
| `/login` | Login | User login |
| `/register` | Register | New user registration |
| `/sign-up` | SignUp | Multi-step sign up |
| `/forgot-password` | ForgotPassword | Password reset request |
| `/change-password` | ChangePassword | Change existing password |
| `/register-success` | SuccessRegister | Confirmation after signup |
| `/blog` | Blog | Blog listing page |
| `/blog-post` | BlogPost | Individual blog post |
| `/pricing` | PricingPage | Pricing plans |
| `/payment` | PaymentGateway | Payment form |
| `/payment-success` | PaymentSuccess | Payment confirmation |
| `/onboard` | OnboardCompany | Company onboarding wizard |
| `/dashboard` | Dashboard | Main dashboard (protected) |

## Features Implemented

### Authentication Pages
- ✅ Login with email/password
- ✅ Register new account
- ✅ Forgot password flow
- ✅ Change password
- ✅ Multi-step signup
- ✅ Success confirmation pages

### Marketing Pages
- ✅ Landing page with hero, features, testimonials
- ✅ Pricing page with plan cards
- ✅ Blog listing
- ✅ Blog post detail pages

### Onboarding
- ✅ Company setup wizard (3 steps)
- ✅ Payment gateway
- ✅ Payment confirmation

### Dashboard
- ✅ KPI cards with metrics
- ✅ Recent activity feed
- ✅ Quick actions
- ✅ User profile menu
- ✅ Sidebar navigation

## Styling

All pages use a consistent design system:
- **Primary Color**: `#007bff` (Blue)
- **Secondary Color**: `#0056b3` (Dark Blue)
- **Background**: `#f5f7fa` (Light Gray)
- **Text**: `#333` (Dark)
- **Border**: `#ddd` (Light Gray)

CSS files are organized by section:
- `App.css` - Global styles
- `components/Navigation.css` - Navigation bar
- `pages/Auth.css` - Authentication pages
- `pages/Pages.css` - Marketing & dashboard pages

## Backend Integration Points

These form fields are ready to hook to your backend:

### Login Page (`Login.jsx`)
```javascript
const handleSubmit = (e) => {
  // Hook API call here
  // POST /api/auth/login { email, password }
}
```

### Register Page (`Register.jsx`)
```javascript
const handleSubmit = (e) => {
  // Hook API call here
  // POST /api/auth/register { email, password, confirmPassword, agreeTerms }
}
```

### Forgot Password (`ForgotPassword.jsx`)
```javascript
const handleSubmit = (e) => {
  // Hook API call here
  // POST /api/auth/forgot-password { email }
}
```

### Change Password (`ChangePassword.jsx`)
```javascript
const handleSubmit = (e) => {
  // Hook API call here
  // POST /api/auth/change-password { currentPassword, newPassword }
}
```

### Payment (`PaymentGateway.jsx`)
```javascript
const handleSubmit = (e) => {
  // Hook Stripe or payment provider here
  // POST /api/payments/process { cardName, cardNumber, expiry, cvv }
}
```

### Onboarding (`OnboardCompany.jsx`)
```javascript
const handleComplete = () => {
  // Hook API call here
  // POST /api/onboarding/complete { companyName, industry, teamSize, integrations }
}
```

## Environment Variables

Create a `.env` file in the root:
```
VITE_API_URL=http://localhost:5000
VITE_STRIPE_KEY=pk_test_...
```

Access in components:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

## State Management Notes

Currently using React `useState` for form state. For larger state management, consider:
- **Redux** - For complex state
- **Zustand** - For simpler alternative
- **Context API** - For smaller apps

## Protected Routes

To protect dashboard routes, wrap with auth check:
```javascript
// In App.jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## API Schemas Expected

### User Model
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "companyName": "Acme Corp",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### KPI Model
```json
{
  "id": "uuid",
  "label": "Total Revenue",
  "value": "45231.89",
  "change": "+12.5%",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Authentication Flow

1. User navigates to `/login` or `/register`
2. Form submits to API endpoint
3. API returns JWT token
4. Store token in localStorage
5. Include token in subsequent API requests
6. Redirect to `/dashboard` on success
7. Set up token refresh mechanism for expired tokens

## Responsive Design

All pages are mobile-responsive using CSS Grid and Flexbox. Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Performance Optimizations

1. Code splitting via React Router
2. Lazy loading for route components
3. Image optimization (use WebP where possible)
4. CSS minification in production build
5. No unused dependencies

## Next Steps

1. **Connect to Backend**: Update form handlers with API calls
2. **Add Authentication Guard**: Protect private routes
3. **Setup Error Handling**: Add toast notifications
4. **Add Form Validation**: Use libraries like `react-hook-form`
5. **Setup Analytics**: Add tracking (Google Analytics, Mixpanel)
6. **Add Testing**: Set up Jest + React Testing Library

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- --port 3001
```

### Assets not loading
Make sure `public/` folder is in project root and Vite config points to it

### Route not working
Check that route is defined in `App.jsx` and component path is correct

### Styling issues
Clear browser cache (Ctrl+Shift+Del) or hard refresh (Ctrl+Shift+R)

## Support

For questions about this React setup, check:
- Vite docs: https://vitejs.dev
- React Router: https://reactrouter.com
- React docs: https://react.dev
