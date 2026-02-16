# Updated User Stories & Implementation Status
## Restaurant Management System - Current Frontend Status

**Document Version:** 2.0  
**Last Updated:** February 16, 2026  
**Purpose:** Updated user stories reflecting all implemented features including waiter roles, cashier operations, and admin capabilities

---

## Table of Contents

1. [Overview of Completed Features](#1-overview-of-completed-features)
2. [Customer Stories (Role 1)](#2-customer-stories-role-1)
3. [Admin Stories (Role 2)](#3-admin-stories-role-2)
4. [Kitchen Staff Stories (Role 3)](#4-kitchen-staff-stories-role-3)
5. [Waiter Stories (Role 4) ⭐ NEW](#5-waiter-stories-role-4--new)
6. [System-Wide Features](#6-system-wide-features)
7. [API Integration Points](#7-api-integration-points)

---

## 1. Overview of Completed Features

### ✅ Fully Implemented Features

| Feature | Role(s) | Status | Location |
|---------|---------|--------|----------|
| **User Authentication** | All | ✅ Complete | `src/pages/auth/` |
| **Role-Based Access Control** | All | ✅ Complete | `src/components/RoleBasedRoute.tsx` |
| **Menu Browsing** | Customer, Admin, Kitchen, Waiter | ✅ Complete | `src/pages/menu/` |
| **Shopping Cart** | Customer, Waiter | ✅ Complete | `src/components/Cart/` |
| **Order Placement** | Customer, Waiter | ✅ Complete | `src/api/orders.ts` |
| **Order Tracking** | Customer | ✅ Complete | `src/pages/customer/OrderTrackingPage.tsx` |
| **Admin Dashboard** | Admin | ✅ Complete | `src/pages/admin/AdminDashboard.tsx` |
| **Staff Management** | Admin | ✅ Complete | `src/pages/admin/StaffManagement.tsx` |
| **Menu Management** | Admin | ✅ Complete | `src/pages/admin/MenuManagement.tsx` |
| **Category Management** | Admin | ✅ Complete | `src/pages/admin/CategoryManagement.tsx` |
| **Inventory Management** | Admin | ✅ Complete | `src/pages/admin/InventoryManagement.tsx` |
| **Kitchen Dashboard** | Kitchen | ✅ Complete | `src/pages/kitchen/KitchenPage.tsx` |
| **Proxy Orders** | Waiter | ✅ Complete | `src/pages/waiter/ProxyOrder.tsx` |
| **QR Code Generation** | Waiter | ✅ Complete | `src/pages/waiter/ProxyOrder.tsx` |
| **Cashier Cash Receipt** | Admin | ✅ Complete | `src/pages/admin/CashierReceiveCash.tsx` |
| **Error Boundary** | All | ✅ Complete | `src/components/ErrorBoundary.tsx` |
| **Landing Page Redirects** | All | ✅ Complete | `src/components/RootRedirect.tsx` |

---

## 2. Customer Stories (Role 1)

### C-001: Customer Registration
> **As a** new customer  
> **I want to** create an account with my details  
> **So that** I can place orders and have a persistent profile

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Registration page accessible from login
- [x] Required fields: Full Name, Email, Password
- [x] Optional fields: Phone Number
- [x] Email validation and duplicate check
- [x] Password confirmation
- [x] Role automatically set to "Customer" (Role 1)
- [x] Redirects to login on success
- [x] Error messages for invalid inputs

**Test Account:** 
- Email: `customer@test.com`
- Password: `password123`

**API Endpoint:** `POST /api/auth/register`

---

### C-002: Customer Login
> **As a** registered customer  
> **I want to** log into my account  
> **So that** I can access my profile and place orders

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Login form with email/password
- [x] JWT token-based authentication
- [x] Table ID detection from URL `?tableId=X`
- [x] Automatic redirect to menu after login
- [x] Error handling for invalid credentials
- [x] Session persistence via localStorage

**API Endpoint:** `POST /api/auth/login`

---

### C-003: Table ID QR Code Requirement ⭐ CRITICAL
> **As a** customer  
> **I want to** scan a table QR code to identify myself  
> **So that** my orders are associated with my table

**Status:** ✅ IMPLEMENTED - MANDATORY

**Acceptance Criteria:**
- [x] QR code scanning required BEFORE menu access
- [x] QR code format: `http://172.20.10.3:5173/?tableId=5`
- [x] Table ID persists across sessions (localStorage)
- [x] Cannot proceed without valid table ID
- [x] Clear QR scan instruction screen if no table ID
- [x] Automatic redirect to QR scan page if table ID missing

**QR Code URL Format:**
```
http://172.20.10.3:5173/?tableId=5
http://localhost:5173/?tableId=1 (for development)
```

**Implementation:** `src/components/CustomerProtectedRoute.tsx`

---

### C-004: Browse Menu
> **As a** customer  
> **I want to** view all available dishes with descriptions and prices  
> **So that** I can decide what to order

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View all menu items with images
- [x] Filter by category (All, Appetizers, Mains, Desserts, Beverages)
- [x] See item descriptions and prices
- [x] Display availability status
- [x] Show spicy indicator
- [x] Responsive layout for mobile

**API Endpoint:** `GET /api/menu` or `GET /api/menu?categoryId=X`

---

### C-005: Add to Cart & Customize
> **As a** customer  
> **I want to** add items to cart with special notes  
> **So that** I can customize my order

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Click "Add to Cart" on menu items
- [x] Add special notes (e.g., "No onions")
- [x] Confirm quantity
- [x] Cart persists across page refreshes
- [x] View cart via sidebar icon
- [x] See cart item count badge

**Implementation:** `src/context/CartContext.tsx`, `src/components/Cart/Cart.tsx`

---

### C-006: Place Order
> **As a** customer  
> **I want to** place an order from items in my cart  
> **So that** the kitchen can prepare my food

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Review cart items before checkout
- [x] View total amount
- [x] Enter payment method
- [x] Order confirmation with order ID
- [x] Order persists in system
- [x] Receive estimated preparation time

**API Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "tableId": "5",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    }
  ]
}
```

---

### C-007: Track Order
> **As a** customer  
> **I want to** track the status of my order in real-time  
> **So that** I know when my food will be ready

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View order history
- [x] See order status (PLACED, PREPARING, READY, SERVED, COMPLETED)
- [x] View estimated time
- [x] See order details (items, prices)
- [x] Real-time status updates

**API Endpoint:** `GET /api/orders/by-table/{tableId}` or `GET /api/orders/{orderId}`

---

### C-008: View & Edit Profile
> **As a** customer  
> **I want to** view and update my profile information  
> **So that** my details are always up-to-date

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View current profile details
- [x] Edit Full Name
- [x] Edit Phone Number
- [x] Read-only Email (for security)
- [x] Save changes with validation
- [x] Success/error messages
- [x] Data persists on backend

**API Endpoints:**
- `GET /api/profile/me`
- `PUT /api/profile/me`

---

## 3. Admin Stories (Role 2)

### A-001: Admin Dashboard Overview
> **As an** admin  
> **I want to** see a dashboard with key metrics  
> **So that** I can quickly understand system status

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Dashboard displays at `/admin`
- [x] Navigation menu with quick links
- [x] Card-based layout for different management sections
- [x] Cashier section at top for easy access
- [x] Links to Staff, Menu, Categories, Inventory, Orders, Analytics
- [x] Error handling with redirect to dashboard on error

**Implementation:** `src/pages/admin/AdminDashboard.tsx`

---

### A-002: Staff Management
> **As an** admin  
> **I want to** manage staff members (add, edit, delete)  
> **So that** I can control access and roles

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View all staff members in a table
- [x] Add new staff with email, name, phone, role
- [x] Edit staff details
- [x] Delete/deactivate staff
- [x] Filter by role (Admin, Kitchen, Waiter)
- [x] Search by name or email
- [x] Role-based access control (Admin only)

**API Endpoints:**
- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/{id}`
- `DELETE /api/staff/{id}`

---

### A-003: Menu Management
> **As an** admin  
> **I want to** manage menu items  
> **So that** menu stays current and accurate

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Add new menu items
- [x] Edit existing items
- [x] Delete items
- [x] Upload menu item images
- [x] Set prices and availability
- [x] Assign to categories
- [x] Mark as spicy or special

**API Endpoints:**
- `GET /api/menu`
- `POST /api/menu`
- `PUT /api/menu/{id}`
- `DELETE /api/menu/{id}`

---

### A-004: Category Management
> **As an** admin  
> **I want to** organize menu into categories  
> **So that** customers can easily find items

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Create categories
- [x] Edit category names
- [x] Delete categories (if no items assigned)
- [x] View items in each category
- [x] Set category display order

**API Endpoints:**
- `GET /api/menu/categories`
- `POST /api/menu/categories`
- `PUT /api/menu/categories/{id}`
- `DELETE /api/menu/categories/{id}`

---

### A-005: Inventory Management
> **As an** admin  
> **I want to** track inventory levels  
> **So that** I know when to reorder

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View current stock levels
- [x] Update stock quantities
- [x] Set reorder levels
- [x] Mark items out of stock
- [x] View low stock items
- [x] Track inventory history

**API Endpoints:**
- `GET /api/inventory`
- `PUT /api/inventory/{itemId}`
- `POST /api/inventory/reorder`

---

### A-006: Cashier - Receive Cash
> **As a** cashier/admin  
> **I want to** scan waiter QR codes and confirm cash receipt  
> **So that** cash collections are tracked and receipts are issued

**Status:** ✅ IMPLEMENTED - NEW FEATURE

**Acceptance Criteria:**
- [x] Access cashier page at `/admin/cashier`
- [x] Paste/scan waiter QR code data
- [x] Validate QR code format and data
- [x] See cash amount in confirmation modal
- [x] Confirm cash receipt with payment details
- [x] Auto-removed from waiter pending list
- [x] View transaction history with date/time
- [x] See today's total cash received
- [x] Error handling if duplicate scan

**Data Flow:**
1. Waiter creates proxy order → QR generated → saved to localStorage
2. Waiter collects cash from customer
3. Waiter copies QR data using "Copy QR Data" button
4. Cashier pastes QR data into cashier page
5. System validates and shows confirmation modal
6. Cashier confirms → transaction saved → waiter pending list updated

**API Endpoint (Future):** `POST /api/cashier/receive-cash`

**Implementation:** `src/pages/admin/CashierReceiveCash.tsx`

---

### A-007: Order Management & Analytics
> **As an** admin  
> **I want to** view and manage all orders  
> **So that** I can track business and troubleshoot issues

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View all orders with status
- [x] Filter by date range
- [x] Search by order ID or table
- [x] View order details (items, prices, customer)
- [x] Export order data
- [x] View analytics and metrics

**API Endpoints:**
- `GET /api/orders`
- `GET /api/orders/analytics`
- `GET /api/orders/by-date-range`

---

## 4. Kitchen Staff Stories (Role 3)

### K-001: Kitchen Dashboard
> **As a** kitchen staff member  
> **I want to** see a list of orders to prepare  
> **So that** I can manage order workflow efficiently

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View active orders (PLACED, PREPARING)
- [x] See order details (items, quantities, special notes)
- [x] Mark order as PREPARING
- [x] Mark order as READY
- [x] See table number
- [x] Sort by order time (oldest first)
- [x] Sound alert for new orders (optional)

**Implementation:** `src/pages/kitchen/KitchenPage.tsx`

**API Endpoints:**
- `GET /api/orders/active`
- `PUT /api/orders/{id}/status`

---

### K-002: Update Order Status
> **As a** kitchen staff  
> **I want to** update order status as I work  
> **So that** customers know when their food is ready

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Click to mark order as PREPARING
- [x] Click to mark order as READY
- [x] Confirm status changes
- [x] See status update confirmation

**API Endpoint:** `PUT /api/orders/{id}/status`

**Request Body:**
```json
{
  "status": "READY"
}
```

---

## 5. Waiter Stories (Role 4) ⭐ NEW

### W-001: Waiter Dashboard
> **As a** waiter  
> **I want to** see my dashboard with quick access to order and table management  
> **So that** I can efficiently manage customer interactions

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Waiter dashboard at `/waiter`
- [x] Quick links to Serve Orders, Proxy Orders, Table Status
- [x] View today's order summary
- [x] View active tables
- [x] Navigation to role-specific pages
- [x] Error handling with redirect to dashboard on error

**Implementation:** `src/pages/waiter/WaiterDashboard.tsx`

---

### W-002: Proxy Order Creation
> **As a** waiter  
> **I want to** create orders on behalf of customers  
> **So that** I can help them order efficiently

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Browse menu and add items to cart
- [x] Add special notes/customizations
- [x] See total amount
- [x] Place proxy order for specific table
- [x] Order confirmation
- [x] See list of all pending orders I've created

**API Endpoint:** `POST /api/orders` (with waiter context)

**Implementation:** `src/pages/waiter/ProxyOrder.tsx`

---

### W-003: Generate QR Code for Cash Collection
> **As a** waiter  
> **I want to** generate a QR code when placing a proxy order  
> **So that** I can easily collect cash from a customer

**Status:** ✅ IMPLEMENTED - NEW FEATURE

**Acceptance Criteria:**
- [x] QR code auto-generated after placing proxy order
- [x] QR code contains order details (orderId, amount, timestamp)
- [x] QR code displayed in modal
- [x] Can print QR code
- [x] Can copy QR code data to clipboard
- [x] QR code persists even after closing modal
- [x] QR code accessible from "Pending Cash Collections" list

**QR Code Data Format:**
```json
{
  "type": "PROXY_ORDER_PAYMENT",
  "orderId": "ORD-00123",
  "amount": 2500.00,
  "timestamp": "2024-02-16T10:30:00Z",
  "tableId": "5",
  "paymentMethod": "CASH"
}
```

**Implementation:** `src/pages/waiter/ProxyOrder.tsx`

**Data Storage:** localStorage key `waiter_pending_cash_collections`

---

### W-004: Manage Pending Cash Collections
> **As a** waiter  
> **I want to** see and manage all pending cash I need to collect  
> **So that** I don't forget any cash payments

**Status:** ✅ IMPLEMENTED - NEW FEATURE

**Acceptance Criteria:**
- [x] View all pending cash collections in a list
- [x] Each collection shows: Order ID, Amount, Table, Timestamp
- [x] View QR code for any pending collection
- [x] Mark collection as "Handed Over" after giving to cashier
- [x] Collections removed from pending list after cashier confirmation
- [x] Persist across page refreshes and browser restarts
- [x] Orange-themed cards for visual distinction

**Implementation:** `src/pages/waiter/ProxyOrder.tsx` (Pending Collections Section)

**Storage:** localStorage key `waiter_pending_cash_collections`

---

### W-005: Copy QR Data for Cashier Transfer
> **As a** waiter  
> **I want to** easily copy QR code data to send to cashier  
> **So that** I don't have to manually re-enter payment details

**Status:** ✅ IMPLEMENTED - NEW FEATURE

**Acceptance Criteria:**
- [x] "Copy QR Data" button in QR modal
- [x] Copies QR JSON to clipboard
- [x] Visual feedback (tooltip or notification)
- [x] Can paste data directly into cashier page
- [x] Accurate JSON format with all required fields

**Implementation:** `src/pages/waiter/ProxyOrder.tsx` (handleCopyQRData function)

**API Flow (Future Backend Integration):**
```
1. Waiter copies QR data
2. Waiter sends to cashier (via QR code scan or paste)
3. Cashier pastes into CashierReceiveCash page
4. System validates and processes payment
5. Waiter's pending list auto-updated
```

---

### W-006: Serve Orders to Customers
> **As a** waiter  
> **I want to** match ready orders with tables and mark as served  
> **So that** customers get their food

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View ready orders
- [x] See table number for each order
- [x] Mark orders as SERVED
- [x] See served order history

**Implementation:** `src/pages/waiter/ServeOrders.tsx`

**API Endpoint:** `PUT /api/orders/{id}/status`

---

### W-007: Table Status Management
> **As a** waiter  
> **I want to** see and manage table status  
> **So that** I can track which tables need attention

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View all tables and their status
- [x] Mark tables as OCCUPIED, READY_TO_SERVE, or AVAILABLE
- [x] See active orders per table
- [x] Get alerts for tables with completed orders

**Implementation:** `src/pages/waiter/TableStatus.tsx`

---

## 6. System-Wide Features

### S-001: Error Boundary & Error Handling ⭐ NEW
> **As a** user of any role  
> **I want to** have errors handled gracefully  
> **So that** I can recover and get back to my work quickly

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Error boundary catches component errors
- [x] User-friendly error display
- [x] Shows error details for debugging
- [x] "Go to Landing Page" button redirects to role-specific dashboard
- [x] Works for all roles (Customer→Menu, Admin→AdminDashboard, etc.)
- [x] Responsive design for mobile

**Implementation:** `src/components/ErrorBoundary.tsx`, `src/components/ErrorBoundary.css`

**Error Pages per Role:**
- **Customer (Role 1):** Redirects to `/menu`
- **Admin (Role 2):** Redirects to `/admin`
- **Kitchen (Role 3):** Redirects to `/kitchen`
- **Waiter (Role 4):** Redirects to `/waiter`

---

### S-002: Landing Page Redirects
> **As a** user  
> **I want to** be taken to my role-specific landing page on login  
> **So that** I can immediately access my work area

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Customer → `/menu` on login
- [x] Admin → `/admin` on login
- [x] Kitchen Staff → `/kitchen` on login
- [x] Waiter → `/waiter` on login
- [x] QR code URL parameters preserved
- [x] Session persistence

**Implementation:** `src/components/RootRedirect.tsx`

**Logic:**
```typescript
const getRoleBasedPath = (role: number | undefined): string => {
  switch (role) {
    case 1: return '/menu';        // Customer
    case 2: return '/admin';       // Admin
    case 3: return '/kitchen';     // Kitchen
    case 4: return '/waiter';      // Waiter
    default: return '/login';
  }
};
```

---

### S-003: Authentication & Authorization
> **As a** system  
> **I want to** enforce role-based access control  
> **So that** users only access features appropriate for their role

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] JWT token-based authentication
- [x] Automatic token refresh
- [x] Role-based route protection
- [x] Unauthorized access redirects to `/unauthorized`
- [x] Session expiry handling
- [x] Logout functionality

**Implementation:** 
- `src/components/RoleBasedRoute.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/hooks/useAuth.ts`
- `src/utils/jwt.ts`

---

### S-004: Profile Management (All Roles)
> **As a** user of any role  
> **I want to** manage my profile information  
> **So that** my details are current

**Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] View profile for any role
- [x] Edit name and phone
- [x] Email cannot be changed
- [x] Update with validation
- [x] Success/error messages
- [x] Data persists on backend

**API Endpoints:**
- `GET /api/profile/me`
- `PUT /api/profile/me`

---

## 7. API Integration Points

### Core API Endpoints Required

#### Authentication
```
POST /api/auth/register       - Register new user
POST /api/auth/login          - Login user
POST /api/auth/logout         - Logout user
POST /api/auth/refresh        - Refresh access token
```

#### Profile
```
GET  /api/profile/me          - Get current user profile
PUT  /api/profile/me          - Update profile
```

#### Menu
```
GET  /api/menu                - Get all menu items
GET  /api/menu?categoryId=X   - Get items by category
GET  /api/menu/{id}           - Get single item
GET  /api/menu/categories     - Get all categories
POST /api/menu                - Add new menu item (Admin)
PUT  /api/menu/{id}           - Update menu item (Admin)
DELETE /api/menu/{id}         - Delete menu item (Admin)
```

#### Orders
```
GET  /api/orders              - Get all orders (Admin, Kitchen)
GET  /api/orders/by-table/{tableId}  - Get table orders
GET  /api/orders/{id}         - Get order details
POST /api/orders              - Place new order
PUT  /api/orders/{id}/status  - Update order status
GET  /api/orders/active       - Get active orders (Kitchen)
GET  /api/orders/analytics    - Get order analytics (Admin)
```

#### Cashier (New)
```
POST /api/cashier/receive-cash - Confirm cash receipt from QR scan
```

#### Staff (Admin Only)
```
GET  /api/staff               - List all staff
POST /api/staff               - Add new staff
PUT  /api/staff/{id}          - Update staff
DELETE /api/staff/{id}        - Delete staff
```

#### Inventory (Admin Only)
```
GET  /api/inventory           - Get inventory levels
PUT  /api/inventory/{itemId}  - Update stock
POST /api/inventory/reorder   - Mark for reorder
```

---

## 8. Migration from Mock Data to Real API

### Current State
- All API calls use mock data
- Mock implementations in `src/api/` files
- Config switch: `USE_MOCK_API` in `src/utils/config.ts`

### Switch to Real API
1. Update `.env.local`:
   ```
   VITE_API_GATEWAY_URL=http://your-backend:8080/api/
   ```

2. Update `src/utils/config.ts`:
   ```typescript
   export const CONFIG = {
     USE_MOCK_API: false,  // Switch to real API
     API_BASE_URL: import.meta.env.VITE_API_GATEWAY_URL,
   };
   ```

3. Ensure backend has all required endpoints

4. Test authentication flow with real JWT tokens

---

## 9. Next Steps & Roadmap

### Upcoming Features
- [ ] Real-time order status updates (WebSocket)
- [ ] QR code camera scanning (instead of paste)
- [ ] SMS notifications for orders
- [ ] Mobile app notifications
- [ ] Advanced analytics and reporting
- [ ] Inventory forecasting
- [ ] Reservation system
- [ ] Loyalty program integration

### Backend Integration Priority
1. **Phase 1 (Critical):** Auth, Orders, Menu, Profile
2. **Phase 2 (Important):** Cashier, Staff Management, Inventory
3. **Phase 3 (Enhancement):** Analytics, Notifications, Real-time updates

