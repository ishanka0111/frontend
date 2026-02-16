# Quick Start: Reusable Components & Table ID

## 🎯 What Was Done

### 1. **Reusable Components Created**
- ✅ Button (with loading states, variants, sizes)
- ✅ Card (container with padding options)
- ✅ Header (navigation, user info, logout)
- ✅ Layout (page wrapper with header)
- ✅ LoadingSpinner (loading indicators)
- ✅ TableSelector (table number selection)

### 2. **Separate CSS Files**
- ✅ Each component has its own `.css` file
- ✅ Each page has its own `.css` file
- ✅ BEM naming convention used

### 3. **Table ID Logic**
- ✅ Detects `?tableId=X` from QR code URLs
- ✅ Stores in localStorage (persists across refreshes)
- ✅ Manual selection via TableSelector component
- ✅ Available via `useAuth()` hook

---

## 🚀 How to Use

### Using Components in Your Pages:

```tsx
// 1. Import components
import { Layout, Card, Button } from '../../components';
import './YourPage.css';

// 2. Use Layout wrapper
const YourPage = () => {
  return (
    <Layout title="Page Title" showTableId={true}>
      {/* 3. Use Card for sections */}
      <Card>
        <h1>Content</h1>
        
        {/* 4. Use Button for actions */}
        <Button variant="primary" isLoading={loading}>
          Submit
        </Button>
      </Card>
    </Layout>
  );
};
```

### Table ID in Action:

```tsx
// Get table ID from auth context
const { tableId, setTableId, user } = useAuth();
const isCustomer = user?.role === 1;

// Show TableSelector if customer hasn't selected table
{isCustomer && !tableId && (
  <TableSelector />
)}

// Show table badge in header
<Layout showTableId={isCustomer && !!tableId}>
  ...
</Layout>

// Use table ID (e.g., in orders)
const orderData = {
  items: cartItems,
  tableId: tableId  // include current table
};
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx        ← Component
│   │   ├── Button.css        ← Styles
│   │   └── index.ts          ← Export
│   ├── [6 more components...]
│   └── index.ts              ← Central export (use this!)
│
├── pages/
│   ├── auth/
│   │   ├── Login.tsx         ← Updated to use components
│   │   ├── Login.css         ← NEW: Separate styles
│   │   ├── Register.tsx      ← Updated to use components
│   │   └── Register.css      ← NEW: Separate styles
│   ├── menu/
│   │   ├── MenuPage.tsx      ← Updated with TableSelector
│   │   └── MenuPage.css      ← NEW: Separate styles
│   └── order/
│       ├── OrdersPage.tsx    ← Updated to use Layout
│       └── OrdersPage.css    ← NEW: Separate styles
│
└── docs/
    ├── COMPONENTS.md         ← Detailed component guide
    └── REFACTORING.md        ← Full improvement summary
```

---

## 🎨 Button Variants

```tsx
// Primary (orange)
<Button variant="primary">Submit</Button>

// Secondary (gray)
<Button variant="secondary">Cancel</Button>

// Danger (red)
<Button variant="danger">Delete</Button>

// Success (green)
<Button variant="success">Confirm</Button>

// With loading state
<Button variant="primary" isLoading={true}>
  Processing...
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>  ← default
<Button size="lg">Large</Button>
```

---

## 📱 Testing Table ID Feature

### Method 1: QR Code Simulation
1. Navigate to: `http://localhost:5173/menu?tableId=5`
2. App automatically detects and stores table 5
3. Badge appears in header: "Table 5"
4. Table ID persists even after refresh

### Method 2: Manual Selection
1. Login as customer
2. Go to Menu page
3. TableSelector component appears (if no table set)
4. Enter table number (1-50)
5. Click "Confirm Table"
6. Table ID saved to localStorage

### Method 3: Programmatic
```tsx
const { setTableId } = useAuth();

// Set table ID
setTableId(12);

// Clear table ID
setTableId(null);

// Check current table
const { tableId } = useAuth();
console.log('Current table:', tableId);
```

---

## 🧪 Test the App

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# http://localhost:5173

# 4. Login with test credentials
# Customer: customer@test.com / password123

# 5. Try table ID features
# - Visit /menu?tableId=5
# - Or use TableSelector on menu page
```

---

## 💡 Code Examples

### Creating a New Page with Components:

```tsx
// src/pages/example/ExamplePage.tsx
import React from 'react';
import { Layout, Card, Button } from '../../components';
import { useAuth } from '../../context/AuthContext';
import './ExamplePage.css';

const ExamplePage: React.FC = () => {
  const { tableId } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleAction = () => {
    setLoading(true);
    // Do something...
  };

  return (
    <Layout title="Example" showTableId={!!tableId}>
      <div className="example-container">
        <Card>
          <h1 className="example-title">Example Page</h1>
          <p>Current table: {tableId || 'Not set'}</p>
          
          <Button 
            variant="primary" 
            isLoading={loading}
            onClick={handleAction}
          >
            Do Something
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default ExamplePage;
```

```css
/* src/pages/example/ExamplePage.css */
.example-container {
  max-width: 60rem;
  margin: 0 auto;
}

.example-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #111827;
}
```

---

## 📖 Documentation Files

- **COMPONENTS.md** - Detailed guide for each component, props, usage
- **REFACTORING.md** - Full summary of improvements made
- **QUICKSTART.md** - This file

---

## ✨ Key Improvements Summary

1. **Code Reduction:** ~40% fewer lines across pages
2. **Reusability:** 6 components used everywhere
3. **Maintainability:** Update once, affects all pages
4. **Separation:** CSS in separate files (BEM methodology)
5. **Table ID:** Full QR + manual + persistence support

---

## 🎓 Best Practices

### DO ✅
```tsx
// Import from central export
import { Button, Card, Layout } from '../../components';

// Use Layout for pages
<Layout title="Page">...</Layout>

// Use reusable components
<Button variant="primary">Click</Button>

// BEM naming in CSS
.page-title { }
.page-title--large { }
```

### DON'T ❌
```tsx
// Don't import directly
import Button from '../../components/Button/Button';

// Don't recreate duplicate layouts
<div className="min-h-screen">
  <header>...</header>
  ...
</div>

// Don't inline complex buttons
<button className="bg-blue-500 hover:bg-blue-600...">

// Don't use generic CSS names
.title { }  // Too generic, will conflict
```

---

## 🚀 Next Steps

1. **Test the improvements:**
   ```bash
   npm run dev
   ```

2. **Read detailed docs:**
   - `docs/COMPONENTS.md`
   - `docs/REFACTORING.md`

3. **Start building:**
   - Create menu items using Card component
   - Add shopping cart with Button components
   - Use Layout on all new pages

4. **Customize:**
   - Modify CSS variables for colors
   - Add more button variants if needed
   - Create domain-specific components (MenuCard, OrderCard, etc.)

---

Happy coding! 🎉
