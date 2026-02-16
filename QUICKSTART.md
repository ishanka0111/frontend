# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React & React DOM
- React Router DOM
- Tailwind CSS
- TypeScript
- Vite

### Step 2: Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### Step 3: Login
Open your browser and navigate to the login page. Use these test credentials:

**Customer Account:**
- Email: `customer@test.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`

**Kitchen Account:**
- Email: `kitchen@test.com`
- Password: `kitchen123`

---

## 📂 What's Included

✅ **Login Page** - User authentication with JWT tokens
✅ **Register Page** - New user registration
✅ **Menu Page** - Protected route example (placeholder)
✅ **Auth Context** - Global authentication state
✅ **Protected Routes** - Route guards for authentication
✅ **Role-Based Access** - Different routes for different user roles
✅ **Tailwind CSS** - Modern, utility-first styling
✅ **TypeScript** - Full type safety

---

## 🔧 Configuration

### Environment Variables
The project uses a `.env.local` file for configuration:

```bash
VITE_BASE_URL=http://localhost:8080/api/
```

**Note:** Make sure your backend API is running on port 8080, or update this URL accordingly.

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🏗️ Project Structure

```
src/
├── api/              # API functions (auth, menu, etc.)
├── components/       # Reusable React components
│   ├── ProtectedRoute.tsx
│   └── RoleProtectedRoute.tsx
├── context/          # React Context providers
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   └── Menu.tsx
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   ├── api.ts       # API client with auth
│   └── jwt.ts       # JWT token management
├── App.tsx          # Main app with routing
└── main.tsx         # Entry point
```

---

## 🎯 Current Features

### Authentication System
- ✅ Login with email/password
- ✅ Register new users
- ✅ JWT token storage
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ Role-based access control

### User Interface
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

---

## 🔜 Next Development Steps

To continue building the application, you can:

1. **Build Menu Page**
   - Fetch menu items from API
   - Display menu cards
   - Add to cart functionality

2. **Create Cart System**
   - Shopping cart context
   - Cart sidebar
   - Quantity management

3. **Order Management**
   - Place orders
   - View order history
   - Order status tracking

4. **Admin Dashboard**
   - Manage menu items
   - View all orders
   - User management

5. **Kitchen Display**
   - View pending orders
   - Update order status
   - Real-time updates

---

## 🐛 Troubleshooting

### Port already in use
If port 5173 is already in use:
```bash
# Kill the process using port 5173 (Windows)
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind styles not working
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm run dev
```

---

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)

---

## ✨ Tips

- **Hot Module Replacement (HMR)** is enabled - your changes will appear instantly
- **TypeScript** provides autocomplete and type checking
- **ESLint** helps maintain code quality
- **Tailwind CSS** IntelliSense extension is recommended for VS Code

---

**Happy Coding! 🎉**
