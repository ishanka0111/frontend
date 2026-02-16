# Frontend Structure - Complete Reference

## ✅ Active Folder Structure

This project follows the architecture defined in `docs/design.md`:

```
frontend/
├── docs/                           # Documentation
│   ├── api.md                     # API endpoints & dummy data
│   ├── design.md                  # UI/UX specifications
│   └── logics.md                  # Business logic & architecture
│
├── src/
│   ├── api/                       # API client functions
│   │   └── auth.ts               # Authentication API calls (with mock support)
│   │
│   ├── components/                # Reusable UI components
│   │   ├── ProtectedRoute.tsx    # Authentication guard
│   │   └── RoleProtectedRoute.tsx # Role-based guard
│   │
│   ├── config/                    # Configuration files
│   │   ├── api.ts                # API endpoints & config
│   │   └── routes.ts             # Route definitions
│   │
│   ├── context/                   # React Context providers
│   │   └── AuthContext.tsx       # Global auth state
│   │
│   ├── pages/                     # Page components by feature
│   │   ├── admin/                # Admin dashboard & management
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── auth/                 # Login, Register, Profile
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── errors/               # Error pages (404, 401)
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── UnauthorizedPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── kitchen/              # Kitchen display system
│   │   │   ├── KitchenPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── menu/                 # Customer menu browsing
│   │   │   ├── MenuPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── order/                # Order management
│   │       ├── OrdersPage.tsx
│   │       └── index.ts
│   │
│   ├── services/                  # Business logic & mock data
│   │   └── mockApi.ts            # Mock API for testing without backend
│   │
│   ├── types/                     # TypeScript type definitions
│   │   └── index.ts              # All type definitions
│   │
│   ├── utils/                     # Helper functions
│   │   ├── api.ts                # HTTP client with auth
│   │   └── jwt.ts                # JWT token management
│   │
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles (Tailwind)
│
├── .env.local                     # Environment variables
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite configuration
```

## 🎯 Current Implementation Status

### ✅ Fully Implemented
- **Authentication System**
  - Login page (`/login`)
  - Register page (`/register`)
  - JWT token management
  - Auto token refresh
  - Mock API support

- **Route Protection**
  - `ProtectedRoute` - Auth required
  - `RoleProtectedRoute` - Role-based access
  - Unauthorized page (`/unauthorized`)
  - 404 Not Found page

- **Global State**
  - `AuthContext` - User authentication
  - Table ID persistence
  - User profile management

### 🔨 Placeholder Pages (Ready for Development)
- **Menu Page** (`/menu`) - Customer menu browsing
- **Orders Page** (`/order`) - Order history & tracking
- **Profile Page** (`/profile`) - User profile management
- **Admin Dashboard** (`/admin/dashboard`) - Admin panel
- **Kitchen Display** (`/kitchen`) - Kitchen order queue

## 🔄 Mock API vs Real Backend

The app supports running in **two modes**:

### Mode 1: Mock API (No Backend Needed) - DEFAULT
```bash
# .env.local
VITE_USE_MOCK_API=true
```

**Benefits:**
- ✅ Test frontend without backend
- ✅ Instant dummy data
- ✅ All CRUD operations simulated
- ✅ Network delays simulated

**Mock Users:**
| Email              | Password    | Role     |
|-------------------|-------------|----------|
| customer@test.com | password123 | Customer |
| admin@test.com    | admin123    | Admin    |
| kitchen@test.com  | kitchen123  | Kitchen  |

### Mode 2: Real Backend
```bash
# .env.local
VITE_USE_MOCK_API=false
VITE_BASE_URL=http://localhost:8080/api/
```

Simply change the environment variable to connect to real backend!

## 📱 Available Routes

| Route                | Access Level      | Component         |
|---------------------|-------------------|-------------------|
| `/login`            | Public            | Login             |
| `/register`         | Public            | Register          |
| `/menu`             | All Auth Users    | MenuPage          |
| `/order`            | Customer, Admin   | OrdersPage        |
| `/profile`          | All Auth Users    | ProfilePage       |
| `/admin/dashboard`  | Admin Only        | AdminDashboard    |
| `/kitchen`          | Kitchen Only      | KitchenPage       |
| `/unauthorized`     | Public            | UnauthorizedPage  |
| `/404`              | Public            | NotFoundPage      |

## 🚀 Running the App

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

App runs at: **http://localhost:5173**

### 3. Test with Mock Data
The app is pre-configured to use mock API. Just login with test credentials!

## 🔧 Configuration Files

### API Configuration (`src/config/api.ts`)
Centralized API endpoints and settings.

### Route Configuration (`src/config/routes.ts`)
All route definitions with access control.

### Environment Variables (`.env.local`)
- `VITE_USE_MOCK_API` - Toggle mock/real API
- `VITE_BASE_URL` - Backend API URL

## 📦 Key Dependencies

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "tailwindcss": "^3.4.17",
  "typescript": "~5.9.3",
  "vite": "^7.3.1"
}
```

## 🎨 Design System

- **Primary Color:** Orange (#f97316)
- **CSS Framework:** Tailwind CSS
- **Font:** System fonts
- **Icons:** Emoji (for now)

## 🔜 Next Development Steps

1. **Enhance Menu Page**
   - Fetch menu items (mock or API)
   - Display menu cards with images
   - Add to cart functionality
   - Category filtering

2. **Shopping Cart**
   - Cart context
   - Cart sidebar/modal
   - Quantity management
   - Special instructions

3. **Order System**
   - Place orders
   - View order history
   - Real-time status updates

4. **Admin Features**
   - Menu item CRUD
   - Order management
   - User management
   - Statistics dashboard

5. **Kitchen System**
   - Order queue display
   - Status updates
   - Timer tracking

## 📝 Notes

- All placeholder pages are functional and navigable
- Route protection is fully implemented
- Mock API simulates network delays for realistic testing
- Type safety enforced throughout with TypeScript
- Ready for backend integration - just toggle `VITE_USE_MOCK_API=false`

## 🐛 Troubleshooting

**Issue:** Mock API not working
- Check `.env.local` has `VITE_USE_MOCK_API=true`
- Restart dev server after changing env vars

**Issue:** Route not found
- Verify route matches `src/config/routes.ts`
- Check route is added in `App.tsx`

**Issue:** Unauthorized access
- Verify user role matches required roles
- Check `RoleProtectedRoute` configuration

---

**Last Updated:** February 14, 2026
