# Restaurant Management System - Frontend

A modern React-based frontend for a restaurant management system with role-based authentication and access control.

## 🚀 Features

- **Authentication System**
  - User login and registration
  - JWT token-based authentication
  - Automatic token refresh
  - Protected routes

- **Role-Based Access Control**
  - Customer role (view menu, place orders)
  - Admin role (manage system)
  - Kitchen role (view and manage orders)

- **Modern Tech Stack**
  - React 19 with TypeScript
  - Vite for fast development
  - Tailwind CSS for styling
  - React Router for navigation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:8080` (or configure in `.env.local`)

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Required Packages**
   ```bash
   npm install react-router-dom
   npm install -D tailwindcss postcss autoprefixer
   ```

3. **Configure Environment**
   - Create/Verify `.env.local` file with:
     ```bash
     VITE_BASE_URL=http://localhost:8080/api/
     ```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client functions
│   │   └── auth.ts       # Authentication API calls
│   ├── components/       # Reusable components
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleProtectedRoute.tsx
│   ├── context/          # React context providers
│   │   └── AuthContext.tsx
│   ├── pages/            # Page components
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── Menu.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── api.ts        # API client with auth
│   │   └── jwt.ts        # JWT token management
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── docs/                 # Documentation
│   ├── api.md
│   ├── design.md
│   └── logics.md
├── .env.local            # Environment variables
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
└── package.json
```

## 🔑 Test Credentials

Use these credentials to test different roles:

| Role     | Email                | Password    |
|----------|---------------------|-------------|
| Customer | customer@test.com   | password123 |
| Admin    | admin@test.com      | admin123    |
| Kitchen  | kitchen@test.com    | kitchen123  |

## 🎨 Pages & Routes

### Public Routes
- `/login` - User login page
- `/register` - User registration page

### Protected Routes
- `/menu` - Menu browsing (all authenticated users)

### Planned Routes
- `/order` - Order management (customers)
- `/profile` - User profile (all users)
- `/admin/*` - Admin dashboard and management (admin only)
- `/kitchen` - Kitchen display system (kitchen staff only)

## 🔐 Authentication Flow

1. **Login**
   - User submits email and password
   - Backend validates and returns JWT tokens
   - Tokens stored in localStorage
   - User profile loaded from API
   - Redirected to appropriate page based on role

2. **Token Refresh**
   - Access token automatically refreshed on 401/403 responses
   - If refresh fails, user redirected to login

3. **Logout**
   - Tokens cleared from localStorage
   - User state reset
   - Redirected to login page

## 🎯 Key Components

### AuthContext
Global authentication state management:
- User profile
- Authentication status
- Table ID (for dine-in customers)
- Login/Logout functions

### ProtectedRoute
Ensures user is authenticated before accessing route.

### RoleProtectedRoute
Ensures user has required role(s) for route access.

## 🌐 API Integration

All API calls go through `fetchWithAuth` utility which:
- Automatically adds authorization headers
- Handles token refresh on 401/403 errors
- Manages error responses
- Parses JSON responses

Example:
```typescript
import { fetchWithAuth } from '../utils/api';

const profile = await fetchWithAuth('profile/me', { method: 'GET' });
```

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Responsive design** with mobile-first approach
- **Custom color scheme** with orange as primary color
- **Dark mode ready** (can be enabled later)

## 🐛 Troubleshooting

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind styles not working
```bash
# Ensure Tailwind is properly configured
npx tailwindcss init -p

# Restart dev server
npm run dev
```

### API connection issues
- Verify backend is running
- Check `.env.local` has correct `VITE_BASE_URL`
- Check browser console for CORS errors

## 📚 Documentation

For detailed documentation, see:
- [API Documentation](docs/api.md) - API endpoints and data structures
- [Design Documentation](docs/design.md) - UI/UX design specifications
- [Logic Documentation](docs/logics.md) - Business logic and architecture

## 🔜 Next Steps

1. ✅ Login & Register pages
2. ⏭️ Menu browsing page
3. ⏭️ Cart functionality
4. ⏭️ Order placement
5. ⏭️ Admin dashboard
6. ⏭️ Kitchen display system

## 📝 License

This project is part of a restaurant management system. All rights reserved.
