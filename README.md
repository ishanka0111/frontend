# Restaurant Management System - Frontend

A modern React-based frontend for a restaurant management system with role-based authentication, mock API support, and comprehensive routing.

## 🚀 Quick Start (No Backend Required!)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at http://localhost:5173
# 4. Login with test credentials (see below)
```

The app runs with **mock API by default** - no backend needed for testing!

## 🎯 Features

### ✅ Implemented
- **Authentication System**
  - Login & Register pages
  - JWT token management
  - Auto token refresh
  - Protected routes
  - **Mock API mode** for development without backend

- **Role-Based Access Control**
  - Customer (view menu, place orders)
  - Admin (full system access)
  - Kitchen (order management)

- **Complete Routing**
  - Menu browsing
  - Order management
  - User profile
  - Admin dashboard
  - Kitchen display
  - Error pages (404, Unauthorized)

- **Modern UI/UX**
  - Tailwind CSS styling
  - Responsive design
  - Loading states
  - Error handling

## 🔑 Test Credentials

| Role     | Email              | Password    |
|----------|-------------------|-------------|
| Customer | customer@test.com | password123 |
| Admin    | admin@test.com    | admin123    |
| Kitchen  | kitchen@test.com  | kitchen123  |

## 🔄 Mock API vs Real Backend

### Current Mode: Mock API (Default)
```env
# .env.local
VITE_USE_MOCK_API=true
```

**Benefits:**
- ✅ No backend required
- ✅ Instant testing
- ✅ Realistic network delays
- ✅ Full feature testing

### Switch to Real Backend
```env
# .env.local
VITE_USE_MOCK_API=false
VITE_BASE_URL=http://localhost:8080/api/
```

Just toggle the environment variable!

## 📁 Project Structure

Following the architecture from `docs/design.md`:

```
src/
├── api/              # API client functions
├── components/       # Reusable UI components
├── config/           # Configuration (routes, API)
├── context/          # React Context providers
├── pages/            # Page components by feature
│   ├── admin/       # Admin dashboard
│   ├── auth/        # Login, Register, Profile
│   ├── errors/      # 404, Unauthorized
│   ├── kitchen/     # Kitchen display
│   ├── menu/        # Menu browsing
│   └── order/       # Order management
├── services/         # Mock API & business logic
├── types/            # TypeScript definitions
└── utils/            # Helper functions
```

See [STRUCTURE.md](STRUCTURE.md) for detailed documentation.

## 🛠️ Available Scripts

| Command           | Description                    |
|------------------|--------------------------------|
| `npm run dev`    | Start development server       |
| `npm run build`  | Build for production           |
| `npm run preview`| Preview production build       |
| `npm run lint`   | Run ESLint                     |

## 📱 Available Routes

| Route                | Access        | Status      |
|---------------------|---------------|-------------|
| `/login`            | Public        | ✅ Complete |
| `/register`         | Public        | ✅ Complete |
| `/menu`             | Auth Required | 🔨 Placeholder |
| `/order`            | Auth Required | 🔨 Placeholder |
| `/profile`          | Auth Required | 🔨 Placeholder |
| `/admin/dashboard`  | Admin Only    | 🔨 Placeholder |
| `/kitchen`          | Kitchen Only  | 🔨 Placeholder |

## 🎨 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Context API** - State management

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [SETUP.md](SETUP.md) - Detailed setup instructions
- [STRUCTURE.md](STRUCTURE.md) - Complete structure reference
- [docs/api.md](docs/api.md) - API documentation
- [docs/design.md](docs/design.md) - Design specifications
- [docs/logics.md](docs/logics.md) - Business logic

## 🔜 Development Roadmap

1. ✅ Login & Register functionality
2. ✅ Mock API implementation
3. ✅ Route structure & protection
4. ⏭️ Menu browsing with items
5. ⏭️ Shopping cart system
6. ⏭️ Order placement
7. ⏭️ Admin dashboard features
8. ⏭️ Kitchen display system
9. ⏭️ Real-time order updates

## 🐛 Troubleshooting

### Mock API not working?
- Verify `.env.local` has `VITE_USE_MOCK_API=true`
- Restart dev server after changing env variables

### Port 5173 in use?
```bash
npm run dev -- --port 3000
```

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 💡 Tips

- **Hot Module Replacement** - Changes appear instantly
- **TypeScript** - Full autocomplete support
- **ESLint** - Code quality enforcement
- **Tailwind IntelliSense** - Install VS Code extension

## 📄 License

Restaurant Management System - All rights reserved
