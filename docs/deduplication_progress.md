# De-duplication Progress Report

## Overview
This document tracks the progress of code de-duplication efforts across the frontend codebase.

## Completed De-duplications

### ✅ 1. Route Guards Consolidation
**Date Completed:** Current session  
**Files Modified:**
- `src/components/RoleProtectedRoute.tsx` - Reduced from 56 lines to 13 lines (thin wrapper)
- `src/components/index.ts` - Removed RoleProtectedRoute export
- `src/App.tsx` - Uses RoleBasedRoute directly

**Impact:**
- Single source of truth: `RoleBasedRoute` is canonical implementation
- `RoleProtectedRoute` kept as compatibility wrapper for existing code
- Reduced code duplication by ~43 lines
- **Updated:** Now uses `hasRole` and `getRolePath` from constants/roles.ts

**Decision:**
- **Canonical:** `RoleBasedRoute` (full implementation with role checking logic)
- **Deprecated:** `RoleProtectedRoute` (thin wrapper, not exported from components barrel)

---

### ✅ 2. Order Pages Consolidation
**Date Completed:** Current session  
**Files Deleted:**
- `src/pages/order/OrdersPage.tsx` - Removed (was placeholder)
- `src/pages/order/OrdersPage.css` - Removed (was placeholder)

**Files Modified:**
- `src/App.tsx` - Updated routes to use MyOrdersPage
- `src/pages/order/index.ts` - Removed exports, added deprecation note

**Impact:**
- Eliminated duplicate order display page
- Single order view for customers: `MyOrdersPage`
- Reduced code duplication by ~150 lines

**Decision:**
- **Canonical:** `src/pages/customer/MyOrdersPage.tsx` (full implementation with order tracking, status display)
- **Deleted:** `src/pages/order/OrdersPage.tsx` (was incomplete placeholder)

---

### ✅ 3. Shared Order Helpers Utility
**Date Completed:** Current session  
**New File Created:**
- `src/utils/orderHelpers.ts` (3 exported functions)
- **Updated:** Now uses constants from `src/constants/orderStatus.ts`

**Functions Extracted:**
1. `getOrderStatusBadgeClass(status)` - Maps order status to CSS class names (uses ORDER_STATUS_BADGE_CLASSES)
2. `getOrderStatusLabel(status)` - Maps order status to display labels with emoji (uses ORDER_STATUS_LABELS)
3. `formatRelativeDate(dateString)` - Formats dates as relative time ("5 min ago")

**Files Refactored to Use Shared Helper:**
- `src/pages/customer/MyOrdersPage.tsx` - Removed duplicate status helpers (~56 lines)
- `src/pages/waiter/WaiterOrderOverview.tsx` - Replaced getStatusColor with shared helper (~18 lines)
- `src/pages/admin/OrderOverview.tsx` - Replaced getStatusColor with shared helper (~10 lines)

**Impact:**
- Eliminated ~84 lines of duplicate status handling code
- Consistent status badge styling across all order views
- Single source of truth for order status mappings

**Status Mappings (from constants/orderStatus.ts):**
```typescript
PENDING   → ⏳ Pending         → badge-pending
CONFIRMED → ✔️ Confirmed       → badge-confirmed
PREPARING → 👨‍🍳 Preparing      → badge-preparing
READY     → 🔔 Ready           → badge-ready
SERVED    → 🍽️ Served          → badge-served
COMPLETED → ✅ Completed       → badge-completed
CANCELLED → ❌ Cancelled       → badge-cancelled
PAID      → 💳 Paid            → badge-paid
```

---

### ✅ 4. Shared Menu Helpers Utility
**Date Completed:** Current session  
**New File Created:**
- `src/utils/menuHelpers.ts` (1 exported function)

**Functions Extracted:**
1. `getMenuItemNameById(menuItemId)` - Looks up menu item name from MOCK_MENU_ITEMS

**Files Refactored to Use Shared Helper:**
- `src/pages/customer/MyOrdersPage.tsx` - Removed duplicate getMenuItemName (~4 lines)
- `src/pages/kitchen/KitchenPage.tsx` - Removed duplicate getMenuItemName (~4 lines)

**Impact:**
- Eliminated ~8 lines of duplicate menu lookup code
- Consistent menu item name resolution
- Centralized dependency on MOCK_MENU_ITEMS

---

## Summary Statistics

### Code Reduction (Steps 1-3 Combined)
- **Step 1 (Helpers & Consolidation):**
  - Lines removed: ~305
  - Lines added: ~60 (shared utilities)
  - Net reduction: ~245 lines

- **Step 2 (UI Components):**
  - Lines removed: ~330
  - Lines added: ~200 (shared components)
  - Net reduction: ~130 lines

- **Step 3 (Shared Constants):**
  - Lines removed: ~65 (eliminated hardcoded constants)
  - Lines added: ~200 (constants files: roles.ts ~60, storage.ts ~70, orderStatus.ts ~70)
  - Net reduction: Net +135 lines (but gained type safety, maintainability, zero duplication)

- **Total:**
  - **Combined lines removed:** ~700 lines
  - **Combined lines added:** ~460 lines (reusable, type-safe code)
  - **Net reduction:** ~240 lines
  - **Quality improvement:** Type safety (enums), autocomplete, single source of truth

### Files Impacted (Cumulative - Steps 1-3)
- **Files deleted:** 2 (OrdersPage.tsx, OrdersPage.css)
- **Files created:** 12
  - Utilities: orderHelpers.ts, menuHelpers.ts (2 files)
  - Components: OrderStatsRow.tsx/css, OrderStatusFilter.tsx/css, OrderCard.tsx/css (6 files)
  - Constants: roles.ts, storage.ts, orderStatus.ts, index.ts (4 files)
  - Documentation: deduplication_progress.md (already existed, updated)
- **Files modified:** 16
  - Step 1: App.tsx, RoleProtectedRoute.tsx, components/index.ts, MyOrdersPage.tsx, WaiterOrderOverview.tsx, OrderOverview.tsx (Admin), KitchenPage.tsx (7 files)
  - Step 2: MyOrdersPage.tsx, WaiterOrderOverview.tsx, OrderOverview.tsx, components/index.ts (4 files, overlap with Step 1)
  - Step 3: orderHelpers.ts, RoleBasedRoute.tsx, AuthContext.tsx, CartContext.tsx, CustomerProtectedRoute.tsx, Login.tsx (6 files)

### Consistency Improvements
- ✅ **Route Guards:** Single canonical implementation (RoleBasedRoute) with role constants
- ✅ **Role Checks:** Using `UserRole` enum instead of hardcoded numbers
- ✅ **Storage Keys:** Using `STORAGE_KEYS` constant instead of scattered strings
- ✅ **Order Pages:** Single canonical implementation (MyOrdersPage)
- ✅ **Status Helpers:** Centralized in orderHelpers.ts with constants
- ✅ **Menu Helpers:** Centralized in menuHelpers.ts
- ✅ **Stats Display:** Centralized in OrderStatsRow component
- ✅ **Status Filters:** Centralized in OrderStatusFilter component
- ✅ **Order Cards:** Centralized in OrderCard component
- ✅ **Type Safety:** Enums for roles, order statuses, payment statuses

---

## Remaining De-duplication Opportunities

### ✅ Step 2: Extract Shared UI Components (COMPLETED)
**Date Completed:** Current session  
**Priority:** High  
**Effort:** Medium

**Components Created:**

1. **OrderStatsRow Component** ✅
   - Location: `src/components/OrderStatsRow.tsx` + CSS
   - Purpose: Displays order statistics in horizontal card layout
   - Props: `stats: StatItem[]`, `className?: string`
   - StatItem: `{ value: string | number, label: string, highlight?: boolean, className?: string }`
   - Used in: WaiterOrderOverview, OrderOverview (Admin)

2. **OrderStatusFilter Component** ✅
   - Location: `src/components/OrderStatusFilter.tsx` + CSS
   - Purpose: Filter buttons for order status with count badges
   - Props: `options: FilterOption[]`, `activeFilter: string`, `onFilterChange: (value: string) => void`
   - FilterOption: `{ value: string, label: string, count?: number }`
   - Used in: WaiterOrderOverview, OrderOverview (Admin)

3. **OrderCard Component** ✅
   - Location: `src/components/OrderCard.tsx` + CSS
   - Purpose: Reusable order display card with customizable sections
   - Props: 
     - `order: Order` (required)
     - `showTable?: boolean` (default: true)
     - `showTotal?: boolean` (default: true)
     - `showEstimatedTime?: boolean` (default: true)
     - `showDate?: boolean` (default: true)
     - `actionButton?: React.ReactNode`
     - `onClick?: () => void`
     - `className?: string`
   - Used in: MyOrdersPage
   - Auto-uses shared helpers: `getOrderStatusBadgeClass`, `getOrderStatusLabel`, `formatRelativeDate`, `getMenuItemNameById`

**Files Refactored:**
- ✅ `src/pages/waiter/WaiterOrderOverview.tsx` - Now uses OrderStatsRow & OrderStatusFilter
- ✅ `src/pages/admin/OrderOverview.tsx` - Now uses OrderStatsRow & OrderStatusFilter
- ✅ `src/pages/customer/MyOrdersPage.tsx` - Now uses OrderCard component

**Code Reduction:**
- **Before:** ~330 lines of duplicate UI code across 3 files
- **After:** ~200 lines in 3 shared components (exported from components/index.ts)
- **Net reduction:** ~130 lines (39.4% reduction in UI duplication)

**Benefits:**
- Single source of truth for order statistics display
- Consistent filter UI across admin/waiter views
- Reusable order card reduces duplication by ~50 lines per usage
- All components automatically use shared orderHelpers and menuHelpers
- Easy to update styling globally (change CSS in one place)

**Component Exports:**
Updated `src/components/index.ts` to export:
- `export { OrderStatsRow } from './OrderStatsRow';`
- `export { OrderStatusFilter } from './OrderStatusFilter';`
- `export { OrderCard } from './OrderCard';`

---

### ✅ 5. Shared Constants (Step 3) - COMPLETED
**Date Completed:** Current session  
**Priority:** High  
**Effort:** Low

**New Files Created:**

1. **`src/constants/roles.ts`** ✅
   - `UserRole` enum: `CUSTOMER = 1, ADMIN = 2, KITCHEN = 3, WAITER = 4`
   - `ROLE_NAMES`: Maps role ID to display name (e.g., "Customer", "Admin")
   - `ROLE_PATHS`: Maps role ID to default dashboard path (e.g., "/customer", "/admin")
   - Helper functions:
     - `getRoleName(role)`: Get role display name
     - `getRolePath(role)`: Get default path for role
     - `hasRole(userRole, requiredRoles)`: Check if user has required role

2. **`src/constants/storage.ts`** ✅
   - `STORAGE_KEYS`: Centralized localStorage key constants
     - TOKEN, USER, CART, THEME, LANGUAGE, LAST_ROUTE, TABLE_NUMBER, SESSION_ID
   - `storage` object: Type-safe storage operations
     - `get<T>(key)`: Get and parse item
     - `set<T>(key, value)`: Set item with JSON serialization
     - `remove(key)`: Remove item
     - `clear()`: Clear all storage
     - `has(key)`: Check if key exists
   - Specific helpers:
     - `tokenStorage`: Token-specific operations
     - `userStorage`: User profile operations
     - `cartStorage`: Cart operations

3. **`src/constants/orderStatus.ts`** ✅
   - `OrderStatus` enum: PENDING, CONFIRMED, PREPARING, READY, SERVED, COMPLETED, CANCELLED, PAID
   - `ORDER_STATUS_LABELS`: Maps status to display label with emoji
   - `ORDER_STATUS_BADGE_CLASSES`: Maps status to CSS class names
   - `PaymentStatus` enum: PENDING, PAID, FAILED, REFUNDED
   - `PAYMENT_STATUS_LABELS`: Maps payment status to display labels
   - `ORDER_STATUS_FLOW`: Maps each status to allowed next statuses
   - `ORDER_STATUS_PRIORITY`: Sorting priority for statuses
   - Helper functions:
     - `getNextStatuses(currentStatus)`: Get valid next statuses
     - `isValidStatusTransition(from, to)`: Validate status changes
     - `getStatusPriority(status)`: Get sort priority

4. **`src/constants/index.ts`** ✅
   - Central export point: `export * from './roles'`, `export * from './storage'`, `export * from './orderStatus'`

**Files Refactored:**
- ✅ `src/utils/orderHelpers.ts` - Now uses `ORDER_STATUS_LABELS` and `ORDER_STATUS_BADGE_CLASSES` from constants
- ✅ `src/components/RoleBasedRoute.tsx` - Now uses `hasRole` and `getRolePath` from constants
- ✅ `src/context/AuthContext.tsx` - Now uses `STORAGE_KEYS` and `storage` from constants
- ✅ `src/context/CartContext.tsx` - Now uses `cartStorage` from constants
- ✅ `src/components/CustomerProtectedRoute.tsx` - Now uses `STORAGE_KEYS` and `storage` from constants
- ✅ `src/pages/auth/Login.tsx` - Now uses `STORAGE_KEYS`, `storage`, and `UserRole` from constants

**Impact:**
- **Eliminated hardcoded values:** ~40+ instances of hardcoded role numbers, localStorage keys
- **Type safety:** Enums prevent typos (e.g., `UserRole.CUSTOMER` instead of `1`)
- **Maintainability:** Single source of truth for all constants
- **Code reduction:** ~25 lines (eliminated duplicate constant definitions)
- **Developer experience:** Autocomplete for role names, storage keys, order statuses

**Benefits:**
- Refactor role checks from `user.role === 1` to `user.role === UserRole.CUSTOMER` (more readable)
- Storage keys centralized: No more scattered `'restaurantTableId'` strings
- Order status workflow validation built-in
- Easy to extend: Add new roles/statuses in one place

---

## Remaining De-duplication Opportunities

### 🚧 Step 4: API Layer Normalization
**Priority:** Medium  
**Effort:** Medium-High

**Current Issues:**
- Some files use `getActiveOrders()` from `api/orders`
- Some files use `MOCK_ORDERS` directly from `mockDataGenerator`
- Inconsistent error handling patterns
- No centralized API response type definitions

**Proposal:**
1. Create `src/api/types.ts` for shared API types
2. Normalize all API calls to use api layer (avoid direct mock access)
3. Create shared error handling utility
4. Add response interceptors for common patterns

**Estimated Impact:** Better maintainability, easier gateway integration

---

### 🚧 Step 5: Date/Time Formatting Utilities
**Priority:** Low  
**Effort:** Low

**Current Status:**
- ✅ `formatRelativeDate` extracted to orderHelpers.ts
- ❓ Other date formatting patterns exist (e.g., `toLocaleDateString()`, `toLocaleTimeString()`)

**Future Enhancement:**
- Consider creating `src/utils/dateHelpers.ts` if more date utilities emerge
- Could include: formatTime, formatDate, formatDateTime, parseISO, etc.

---

## Next Steps (Priority Order)

### ✅ COMPLETED - Step 1: Extract Shared Helpers
- ✅ Created orderHelpers.ts and menuHelpers.ts
- ✅ Refactored 5 pages to use shared utilities
- ✅ Consolidated route guards and order pages

### ✅ COMPLETED - Step 2: Extract Shared UI Components
- ✅ Created OrderStatsRow component
- ✅ Created OrderStatusFilter component  
- ✅ Created OrderCard component
- ✅ Refactored 3 pages to use new components

### 🎯 NEXT - Step 3: Create Shared Constants/Enums (High Priority, Low Effort)
- Create `src/constants/roles.ts`, `storage.ts`, `orderStatus.ts`
- Refactor all references
- Estimated time: 30-40 minutes

### 📋 Step 4: API Layer Normalization (Before Gateway Integration)
- Should be completed before moving to API gateway integration
- Estimated time: 2-3 hours

---

## Original Next Steps Reference

1. ~~**Extract OrderStatsRow Component** (High Priority)~~ ✅ DONE
   - ~~Create `src/components/OrderStatsRow.tsx`~~
   - ~~Refactor AdminDashboard, WaiterDashboard, KitchenPage~~
   - ~~Estimated time: 30-45 minutes~~

2. ~~**Extract OrderStatusFilter Component** (High Priority)~~ ✅ DONE
   - ~~Create `src/components/OrderStatusFilter.tsx`~~
   - ~~Refactor WaiterOrderOverview, OrderOverview~~
   - ~~Estimated time: 20-30 minutes~~

3. ~~**Extract OrderCard Component** (High Priority)~~ ✅ DONE
   - ~~Create `src/components/OrderCard.tsx`~~
   - ~~Refactor MyOrdersPage, WaiterOrderOverview, OrderOverview~~
   - ~~Estimated time: 45-60 minutes~~

4. **Create Shared Constants** (High Priority, Low Effort)
   - Create `src/constants/roles.ts`, `storage.ts`, `orderStatus.ts`
   - Refactor all references
   - Estimated time: 30-40 minutes

5. **API Layer Normalization** (Before Gateway Integration)
   - Should be completed before moving to API gateway integration
   - Estimated time: 2-3 hours

---

## Benefits Achieved So Far

### Developer Experience
- ✅ Easier to maintain status display logic (single source)
- ✅ Consistent UI behavior across customer, admin, waiter, kitchen views
- ✅ Clear canonical implementations for routes and pages
- ✅ Reduced cognitive load (fewer duplicates to synchronize)

### Code Quality
- ✅ Better TypeScript type safety with shared utilities
- ✅ Reduced code duplication by ~245 lines
- ✅ Improved testability (shared helpers easier to unit test)
- ✅ Clearer separation of concerns

### Future Readiness
- ✅ Foundation for API gateway integration
- ✅ Easier to add new order status types (change in one place)
- ✅ Clearer migration path for real backend integration
- ✅ Better prepared for component library extraction

---

## Testing Recommendations

After completing each de-duplication step, verify:

1. **Manual Testing:**
   - Customer: View orders at `/orders` route → verify status badges and item names display
   - Waiter: View order overview → verify filter buttons and status colors work
   - Admin: View order overview → verify stats cards and order list display
   - Kitchen: View kitchen dashboard → verify menu item names in order cards

2. **Build Verification:**
   - Run `npm run build` to ensure no TypeScript errors
   - Check console for import resolution issues

3. **Visual Regression:**
   - Compare before/after screenshots of order pages
   - Verify emoji icons still appear in status labels
   - Confirm CSS class names applied correctly

4. **Functionality Testing:**
   - Place new order → verify appears in all relevant views
   - Update order status → verify status badge changes consistently
   - Filter orders → verify filter logic works across all pages

---

## Migration Notes

### For Future Developers

**If you need to add a new order status:**
1. Add to `src/utils/orderHelpers.ts`:
   - Add to `STATUS_BADGE_CLASS` map
   - Add to `STATUS_LABEL` map with emoji
2. Update TypeScript type in `mockDataGenerator.ts` if needed
3. No need to modify individual pages (they auto-update)

**If you need to change status badge styling:**
1. Find CSS class in global styles or component CSS
2. CSS class names follow pattern: `status-badge--{status-lowercase}`
3. All pages using `getOrderStatusBadgeClass` will auto-update

**If you need to add a new menu field:**
1. Update `MOCK_MENU_ITEMS` in `mockDataGenerator.ts`
2. Update `getMenuItemNameById` in `menuHelpers.ts` if needed
3. All pages using the helper will auto-update

---

## References

- **Original De-duplication Plan:** `docs/next_one.md`
- **Services Architecture:** `docs/services_architecture.md`
- **Data Flow Documentation:** `docs/data_flow.md`
- **Shared Utilities:**
  - Order helpers: `src/utils/orderHelpers.ts`
  - Menu helpers: `src/utils/menuHelpers.ts`
