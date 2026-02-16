# Frontend Development Plan - Full Featured Implementation (Dummy/Mock Mode)

**Status:** Planning Phase  
**Target:** Complete mock frontend ready for backend integration  
**Date Started:** February 15, 2026  

---

## 1. Architecture Overview

### Tech Stack
- **React 19** + TypeScript
- **React Router DOM 7.13.0** - Route management with role-based access
- **Context API** - State management (Auth, Cart, Orders, Theme)
- **Vite 7.3.1** - Build tool
- **SockJS + STOMP.js** - WebSocket communication (through Gateway)
- **Mock API Layer** - JSONServer / Mirage JS for dummy data
- **Cookies** - TableId (5hr expiration) + JWT tokens (when integrated)

### Project Structure
```
src/
├── api/                    # API service layer (mock + real toggleable)
│   ├── auth.ts            # Login, Register, Profile
│   ├── menu.ts            # Menu items, Categories, Inventory
│   ├── cart.ts            # Cart operations
│   ├── orders.ts          # Order CRUD, tracking
│   ├── admin.ts           # Admin staff, menu management
│   ├── kitchen.ts         # Kitchen active orders
│   ├── waiter.ts          # Proxy orders, payments
│   ├── payments.ts        # PayPal integration (mock)
│   ├── chat.ts            # AI Chatbot (mock)
│   └── mockData/          # All dummy data
│
├── components/            # Shared components
│   ├── Navigation.tsx
│   ├── CustomerProtectedRoute.tsx
│   ├── RoleBasedRoute.tsx  # (NEW)
│   └── ...
│
├── pages/                 # Page components by role
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   │
│   ├── customer/          # (NEW) Customer dashboard
│   │   ├── MenuBrowser.tsx
│   │   ├── Cart.tsx
│   │   ├── OrderTracking.tsx
│   │   ├── MyOrders.tsx
│   │   └── ChatBot.tsx
│   │
│   ├── admin/            # (NEW) Admin dashboard
│   │   ├── Dashboard.tsx
│   │   ├── StaffManagement.tsx
│   │   ├── MenuManagement.tsx
│   │   ├── InventoryManagement.tsx
│   │   ├── CategoryManagement.tsx
│   │   └── Analytics.tsx
│   │
│   ├── kitchen/          # (NEW) Kitchen dashboard
│   │   ├── OrderKDS.tsx  # Kitchen Display System
│   │   ├── ActiveOrders.tsx
│   │   └── InventoryView.tsx
│   │
│   └── waiter/           # (NEW) Waiter dashboard
│       ├── Dashboard.tsx
│       ├── ProxyOrdering.tsx
│       ├── ServeOrders.tsx
│       └── CashPayment.tsx
│
├── context/              # State management
│   ├── AuthContext.tsx   # (will update with cookies)
│   ├── CartContext.tsx   # (NEW)
│   ├── OrderContext.tsx  # (NEW)
│   └── WebSocketContext.tsx # (NEW)
│
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   ├── useCart.ts        # (NEW)
│   ├── useOrders.ts      # (NEW)
│   ├── useWebSocket.ts   # (NEW)
│   └── useRole.ts        # (NEW)
│
├── services/             # Business logic
│   ├── websocket.ts      # WebSocket connection handler
│   ├── mockDataGenerator.ts # Generate dummy data (NEW)
│   └── mockApiDelayer.ts # Simulate network delay (NEW)
│
├── types/                # TypeScript interfaces
│   ├── index.ts
│   └── api.ts            # API response types
│
├── utils/
│   ├── cookies.ts
│   ├── jwt.ts
│   └── config.ts         # Environment & mock toggle (NEW)
│
└── App.tsx               # Main app with role-based routing
```

---

## 2. Phase-Based Implementation Plan

### Phase 1: Project Setup & Mock Infrastructure (Week 1)
**Goal:** Create mock API layer and environment configuration

#### 1.1 Environment Configuration
**File:** `src/utils/config.ts`
```typescript
export const CONFIG = {
  // Toggle mock vs real API
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws-waiter',
  MOCK_API_DELAY: 500, // ms - Simulate network latency
};
```

**File:** `.env.development`
```
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws-waiter
```

**File:** `.env.production`
```
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.restaurant.com/api
VITE_WS_URL=wss://api.restaurant.com/ws-waiter
```

#### 1.2 Mock Data Generator
**File:** `src/services/mockDataGenerator.ts`

Create realistic dummy data for:
- **User Profiles** - Customers, Admins, Kitchen staff, Waiters
- **Menu Items** - 20-30 items with categories, pricing, images
- **Orders** - Various statuses (PLACED, PREPARING, READY, SERVED, PAID)
- **Categories** - Appetizers, Mains, Desserts, Beverages
- **Inventory** - Stock levels for each menu item
- **Staff** - Multiple kitchen/waiter accounts

```typescript
// Example structure
export const MOCK_DATA = {
  users: { /* array of 10 test users */ },
  menuItems: { /* 25 items */ },
  categories: { /* 5-6 categories */ },
  orders: { /* 15-20 sample orders */ },
  inventory: { /* stock info */ },
  staff: { /* kitchen + waiter accounts */ },
};
```

#### 1.3 Mock API Delayer
**File:** `src/services/mockApiDelayer.ts`

Utility to wrap mock responses with realistic delay:
```typescript
export async function withDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}
```

#### 1.4 API Service Layer (Mock-enabled)
**Files:**
- `src/api/auth.ts` - Login, Register, Profile (with mock)
- `src/api/menu.ts` - Menu, Categories (with mock)
- `src/api/cart.ts` - Cart CRUD (with mock)
- `src/api/orders.ts` - Order operations (with mock)
- `src/api/admin.ts` - Admin staff/menu (with mock)
- `src/api/kitchen.ts` - Kitchen orders (with mock)
- `src/api/waiter.ts` - Proxy orders, payments (with mock)
- `src/api/payments.ts` - PayPal (mock)
- `src/api/chat.ts` - Chatbot (mock)

**Pattern for all API files:**
```typescript
import { CONFIG } from '../utils/config';
import { withDelay } from '../services/mockApiDelayer';
import { MOCK_DATA } from '../services/mockDataGenerator';

export async function getMenu() {
  if (CONFIG.USE_MOCK_API) {
    return withDelay(MOCK_DATA.menuItems, CONFIG.MOCK_API_DELAY);
  }
  
  const response = await fetch(`${CONFIG.API_BASE_URL}/menu`);
  return response.json();
}
```

#### 1.5 Context API Updates
**Files:**
- `src/context/AuthContext.tsx` - Update with cookie implementation
- `src/context/CartContext.tsx` - (NEW) Cart state management
- `src/context/OrderContext.tsx` - (NEW) Orders state management
- `src/context/WebSocketContext.tsx` - (NEW) WebSocket state

---

### Phase 2: Role-Based Routing & UI Shell (Week 2)

#### 2.1 Role Detection System
**File:** `src/hooks/useRole.ts`
```typescript
export function useRole() {
  const { user } = useAuth();
  return {
    isCustomer: user?.roleId === 1,
    isAdmin: user?.roleId === 2,
    isKitchen: user?.roleId === 3,
    isWaiter: user?.roleId === 4,
    role: user?.roleId,
  };
}
```

#### 2.2 Role-Based Route Guard
**File:** `src/components/RoleBasedRoute.tsx`
```typescript
// Protect routes by role requirement
<Route 
  path="/admin/*" 
  element={<RoleBasedRoute requiredRoles={[2]} component={<AdminDashboard />} />} 
/>
```

#### 2.3 Dashboard Shells
Create placeholder pages for each role:
- `src/pages/customer/Dashboard.tsx` - Customer hub
- `src/pages/admin/Dashboard.tsx` - Admin hub
- `src/pages/kitchen/Dashboard.tsx` - Kitchen hub
- `src/pages/waiter/Dashboard.tsx` - Waiter hub

#### 2.4 Navigation Component
**File:** `src/components/Navigation.tsx`
- Dynamic navbar based on user role
- Links to role-specific dashboards
- User profile dropdown
- Logout

#### 2.5 Update App.tsx
**File:** `src/App.tsx`
- Add role-based routes
- Setup context providers
- Add route middlewares

---

### Phase 3: Customer Feature Implementation (Week 2-3)

#### 3.1 Menu Browser
**File:** `src/pages/customer/MenuBrowser.tsx`
- Display menu items in categories
- Search & filter functionality
- Item details modal (price, ingredients, availability)
- Add to cart button

**Components Needed:**
- `MenuCategory.tsx` - Category card
- `MenuItem.tsx` - Individual menu item card
- `ItemDetailModal.tsx` - Full item details

#### 3.2 Shopping Cart
**File:** `src/pages/customer/Cart.tsx`
- Display cart items with quantity
- Update/Remove item buttons
- Cart total calculation
- Proceed to checkout button

**Hooks Needed:**
- `useCart()` - Access cart state

#### 3.3 Checkout & Order Placement
**File:** `src/pages/customer/Checkout.tsx` (NEW)
- Order summary
- Table ID display (from QR)
- Payment method selection
- Place order button
- Confirmation with order ID

#### 3.4 Order Tracking
**File:** `src/pages/customer/OrderTracking.tsx`
- Real-time order status (PLACED → PREPARING → READY → SERVED)
- Estimated time
- Order details (items, total)
- Mark as served button (once order is ready)

#### 3.5 My Orders History
**File:** `src/pages/customer/MyOrders.tsx`
- List all customer's past orders
- Filter by status (completed, cancelled)
- Re-order functionality

#### 3.6 AI Chatbot
**File:** `src/pages/customer/ChatBot.tsx`
- Chat interface
- Mock responses about menu items
- Question suggestions

---

### Phase 4: Admin Feature Implementation (Week 3)

#### 4.1 Admin Dashboard
**File:** `src/pages/admin/Dashboard.tsx`
- Stats cards (total orders today, revenue, active customers)
- Quick action buttons
- Recently placed orders feed

#### 4.2 Staff Management
**File:** `src/pages/admin/StaffManagement.tsx`
- Create new staff (Kitchen, Waiter)
- List all staff with roles
- Edit staff details
- Deactivate/remove staff

**API Calls:** `POST /api/admin/staff`, `GET /api/admin/staff`, `PUT /api/admin/staff/{id}`, `DELETE /api/admin/staff/{id}`

#### 4.3 Menu Management
**File:** `src/pages/admin/MenuManagement.tsx`
- Create menu items (name, price, description, image)
- Edit menu items
- Delete items
- Toggle availability
- Bulk actions

**API Calls:** `POST /api/admin/menu`, `PUT /api/admin/menu/{id}`, `DELETE /api/admin/menu/{id}`

#### 4.4 Category Management
**File:** `src/pages/admin/CategoryManagement.tsx`
- Create categories
- Edit categories
- Delete categories
- Reorder categories

#### 4.5 Inventory Management
**File:** `src/pages/admin/InventoryManagement.tsx`
- View stock levels
- Adjust stock manually
- Set low-stock alerts
- View inventory history

**API Calls:** `GET /api/inventory`, `PUT /api/inventory/{itemId}`

#### 4.6 Analytics Dashboard
**File:** `src/pages/admin/Analytics.tsx`
- Total orders (daily/weekly/monthly)
- Revenue charts
- Popular items
- Customer growth
- Peak hours

---

### Phase 5: Kitchen Feature Implementation (Week 4)

#### 5.1 Kitchen Display System (KDS)
**File:** `src/pages/kitchen/OrderKDS.tsx`
- Large display of active orders
- Color-coded by status
- Order details: items, table number, timing
- Sound/visual alerts for new orders
- Tap to mark as ready

#### 5.2 Active Orders Management
**File:** `src/pages/kitchen/ActiveOrders.tsx`
- List view of all active orders
- Status update dropdown (PLACED → PREPARING → READY)
- Filter by status
- Search by order ID/table

**API Calls:** `GET /api/orders/active`, `PATCH /api/orders/{id}/status`

#### 5.3 Inventory View
**File:** `src/pages/kitchen/InventoryView.tsx`
- Real-time stock levels
- Update stock when items are prepared
- Low stock warnings
- Item usage tracking

**Hooks:** `useInventory()` (NEW)

#### 5.4 WebSocket Integration
**File:** `src/services/websocket.ts`
- Connect to `ws://localhost:8080/ws-waiter` (mock: direct to service)
- Subscribe to `/topic/orders` (STOMP)
- Listen for order ready events
- Sound alerts

---

### Phase 6: Waiter Feature Implementation (Week 4)

#### 6.1 Waiter Dashboard
**File:** `src/pages/waiter/Dashboard.tsx`
- List of tables with current orders
- Pending service requests
- Quick stats

#### 6.2 Proxy Ordering (Walk-ins)
**File:** `src/pages/waiter/ProxyOrdering.tsx`
- Create order without customer login
- Select items from menu
- Assign to walk-in table/counter
- Place order

**API Calls:** `POST /api/orders/proxy`

#### 6.3 Serve Orders
**File:** `src/pages/waiter/ServeOrders.tsx`
- List of ready orders (READY status)
- Confirm delivery
- Mark as SERVED

#### 6.4 Cash Payment Processing
**File:** `src/pages/waiter/CashPayment.tsx`
- Input payment amount
- Verify order total
- Complete payment
- Print receipt (mock)

**API Calls:** `PATCH /api/orders/{id}/pay`

#### 6.5 WebSocket Notifications
- Real-time order ready notifications
- Incoming order alerts
- Message push from kitchen

---

### Phase 7: Advanced Features (Week 5)

#### 7.1 WebSocket Real-time Updates
**File:** `src/services/websocket.ts`

Setup STOMP subscription:
```typescript
export class WebSocketService {
  private stompClient: any;
  
  connect(onOrderReady: (order) => void) {
    const socket = new SockJS('ws://localhost:8080/ws-waiter');
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/orders', (message) => {
        const order = JSON.parse(message.body);
        onOrderReady(order);
      });
    });
  }
  
  disconnect() {
    this.stompClient.disconnect();
  }
}
```

#### 7.2 PayPal Integration (Mock)
**File:** `src/api/payments.ts`
- Mock PayPal approval flow
- Return test URLs
- No real payment processing in mock mode

#### 7.3 Push Notifications
- Sound alerts for new orders (Kitchen)
- Desktop notifications (Waiter)
- Browser notifications for order updates

#### 7.4 Image Upload
- Support for menu item images
- Staff profile pictures
- Use mock URLs for now

---

### Phase 8: Testing & Refinement (Week 5-6)

#### 8.1 Mock Data Variations
- Create multiple test scenarios
- Different order statuses
- Various menu items
- Staff with different permissions

#### 8.2 Error Handling
- Network error simulations
- Invalid request handling
- Timeout scenarios

#### 8.3 UI/UX Polish
- Loading states
- Empty states
- Error messages
- Success notifications (Toast)

#### 8.4 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop views

#### 8.5 Performance
- Lazy load pages
- Images optimization
- Bundle size check

---

## 3. API Endpoint Mock Coverage

| Endpoint | Method | Role | Feature | Mock Status |
|----------|--------|------|---------|-------------|
| `/api/auth/register` | POST | Public | Customer signup | 🟢 Implement |
| `/api/auth/login` | POST | Public | Login | 🟢 Implement |
| `/api/auth/refresh` | POST | Auth | Token refresh | 🟢 Implement |
| `/api/auth/profile` | GET | Auth | User profile | 🟢 Implement |
| `/api/menu` | GET | Public | Get menu items | 🟢 Implement |
| `/api/menu/categories` | GET | Public | Get categories | 🟢 Implement |
| `/api/inventory` | GET | Kitchen/Admin | View stock | 🟢 Implement |
| `/api/inventory/{id}` | PUT | Kitchen/Admin | Update stock | 🟢 Implement |
| `/api/cart/items` | GET/POST | Customer | Cart operations | 🟢 Implement |
| `/api/cart/items/{id}` | PUT/DELETE | Customer | Update/remove | 🟢 Implement |
| `/api/orders` | POST | Customer | Place order | 🟢 Implement |
| `/api/orders/table` | GET | Customer | Track by table | 🟢 Implement |
| `/api/orders/{id}` | GET | Auth | Order details | 🟢 Implement |
| `/api/orders/{id}/status` | PATCH | Kitchen | Update status | 🟢 Implement |
| `/api/orders/{id}/pay` | PATCH | Waiter | Process payment | 🟢 Implement |
| `/api/orders/active` | GET | Kitchen | Active orders | 🟢 Implement |
| `/api/orders/proxy` | POST | Waiter | Walk-in order | 🟢 Implement |
| `/api/admin/staff` | POST/GET/PUT/DELETE | Admin | Staff management | 🟢 Implement |
| `/api/admin/menu` | POST/PUT/DELETE | Admin | Menu CRUD | 🟢 Implement |
| `/api/chat/ask` | POST | Public | Chatbot | 🟢 Implement |
| `/api/payments/create` | POST | Customer | PayPal (mock) | 🟢 Implement |
| `/ws-waiter` | WS | Staff | WebSocket | 🟡 After Phase 3 |

---

## 4. Testing Accounts (Mock)

```typescript
// All passwords: "password123"

CUSTOMER:
Email: customer@test.com
ID: 001
Role: CUSTOMER (1)
TableId: From QR scan

ADMIN:
Email: admin@test.com
ID: 101
Role: ADMIN (2)

KITCHEN:
Email: kitchen@test.com
ID: 201
Role: KITCHEN (3)

WAITER:
Email: waiter@test.com
ID: 301
Role: WAITER (4)
```

---

## 5. Mock Data Seeding Strategy

```typescript
// src/services/mockDataGenerator.ts

export function seedMockData() {
  // Run once on app load (dev only)
  if (!localStorage.getItem('MOCK_DATA_SEEDED')) {
    localStorage.setItem('MOCK_DATA', JSON.stringify(MOCK_DATA));
    localStorage.setItem('MOCK_DATA_SEEDED', 'true');
  }
}
```

Alternatively, use browser IndexedDB for larger datasets.

---

## 6. Backend Integration Checklist (For Later)

Once backend is ready, follow these steps:

- [ ] Update `.env.production` with real API URLs
- [ ] Set `VITE_USE_MOCK_API=false`
- [ ] Test each API endpoint
- [ ] Replace all `CONFIG.USE_MOCK_API` branches with real calls
- [ ] Update error handling for real API errors
- [ ] Test WebSocket connection to real Gateway
- [ ] Update cookie domain/secure flags for production
- [ ] Load test with real data
- [ ] Performance optimization
- [ ] Security audit

---

## 7. Dependencies to Install

```bash
npm install stompjs sockjs-client  # WebSocket
npm install @paypal/react-paypal-js  # PayPal (optional for now)
npm install axios  # HTTP client (alternative to fetch)
npm install zustand  # Alternative state management (optional)
npm install react-hot-toast  # Notifications
npm install react-icons  # Icons
npm install recharts  # Charts for analytics
npm install date-fns  # Date utilities
```

---

## 8. Project Timeline

| Phase | Duration | Deliverables |
|-------|----------|---------------|
| 1 | 3-4 days | Mock API layer, Environment config, Data generators |
| 2 | 3-4 days | Role-based routing, Dashboard shells, Navigation |
| 3 | 5-6 days | Customer features (Menu, Cart, Orders, Chat) |
| 4 | 5-6 days | Admin dashboard (Staff, Menu, Inventory, Analytics) |
| 5 | 4-5 days | Kitchen KDS, Order management, WebSocket |
| 6 | 4-5 days | Waiter dashboard, Proxy orders, Payments |
| 7 | 3-4 days | WebSocket integration, PayPal, Notifications |
| 8 | 5-6 days | Testing, Bug fixes, Polish, Optimization |
| **Total** | **33-40 days** | **Production-ready mock frontend** |

---

## 9. Success Criteria

✅ All 4 role dashboards fully functional with mock data  
✅ Can toggle between mock and real API with one config change  
✅ WebSocket connection established (gateway route)  
✅ All 21+ API endpoints have mock implementations  
✅ Real-time order updates working  
✅ Responsive on mobile/tablet/desktop  
✅ Zero console errors  
✅ Loading times < 3 seconds per page  
✅ Ready for backend integration  

---

## 10. Notes

- **No Database Required** - All data stored in localStorage/IndexedDB
- **No Backend Needed** - Fully functional demo regardless
- **Easy to Switch** - One config change to use real API
- **Well-Structured** - Clear separation of concerns for easy Backend integration

At any point during development, you can connect to the real backend by:
1. Setting `VITE_USE_MOCK_API=false`
2. Updating API URLs in `.env`
3. Removing mock data logic from API calls

---

**Ready to start Phase 1? I can help you implement the mock API layer and environment configuration.**
