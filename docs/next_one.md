# Next Actions: De-duplication + Gateway Readiness

**Document Version:** 1.0
**Last Updated:** February 16, 2026
**Purpose:** List actionable steps to remove code/file duplication and prepare frontend for API gateway integration

---

## 1. Detect and Remove Duplicated Files

### 1.1 Identify duplicate implementations
- Search for duplicated feature files across roles (menu, orders, profile, auth flows)
- Compare similar pages: waiter vs customer menu/order flows
- Compare cashier/waiter cash flows for shared logic

### 1.2 Consolidate shared logic
- Move common logic into shared hooks or helpers:
  - API request logic
  - QR data parsing/validation
  - Date/time formatting
  - Currency formatting
  - Order status mapping

### 1.3 Consolidate shared UI components
- Extract repeated UI blocks into reusable components:
  - Order card
  - Summary cards
  - Modal dialogs
  - Status badges
  - Empty state panels

---

## 2. Normalize API Layer (Gateway Ready)

### 2.1 Centralize API client usage
- Ensure all data calls go through `fetchWithAuth`
- Remove direct `fetch()` calls in pages
- Ensure all endpoints use `VITE_API_GATEWAY_URL`

### 2.2 Standardize endpoint map
- Create a single `apiEndpoints.ts` with base paths
- Avoid hardcoded strings in pages ("/api/menu", etc.)

### 2.3 Standardize request/response models
- Create `types/api.ts` for shared API contracts
- Normalize error shape
- Add request/response validators (zod or manual)

---

## 3. Unify Role-Based Routing and RBAC

### 3.1 Consolidate role logic
- Move role mapping to single source (e.g. `roles.ts`)
- Avoid role IDs scattered across files
- Standardize role names and labels

### 3.2 Ensure gateway-aligned RBAC
- Document gateway role rules in frontend constants
- Enforce same role rules in backend gateway

---

## 4. Remove Mock/Real API Drift

### 4.1 Align mock APIs with real endpoints
- Ensure mock response shapes match backend contracts
- Remove unused mock endpoints
- Ensure all endpoints are in `docs/services_architecture.md`

### 4.2 Switch toggle readiness
- Validate `CONFIG.USE_MOCK_API` logic
- Ensure mock and real share same interface signatures

---

## 5. Data Flow Consistency

### 5.1 Single source for formats
- QR payment payload format in one utility
- Order status enum in one file
- Payment methods enum in one file

### 5.2 Storage key registry
- Define all localStorage keys in one file
- Avoid hardcoded key strings

---

## 6. API Gateway Integration Checklist

### 6.1 Environment variables
- Add `VITE_API_GATEWAY_URL` in all env files
- Ensure production/staging URLs are defined

### 6.2 CORS and auth token flow
- Confirm Authorization header format
- Confirm refresh token endpoint
- Confirm gateway error response shape

### 6.3 Status and error handling
- Standardize error messages shown to users
- Map gateway errors to UI alerts consistently

---

## 7. File and Folder Cleanup

### 7.1 Remove unused files
- Delete unused components, CSS, and mocks
- Remove legacy unused docs

### 7.2 Align folder naming
- Use consistent naming convention
- Avoid duplicate feature folders (e.g. orders vs order)

---

## 8. Final Integration Steps

### 8.1 Create gateway contract docs
- Confirm endpoints, methods, payloads
- Validate request/response samples

### 8.2 End-to-end test plan
- Auth → Menu → Cart → Order → Kitchen → Serve → Cash
- Admin → Staff → Menu → Inventory → Analytics

### 8.3 Performance and monitoring
- Add request logging
- Add error reporting
- Add loading and retry handling

---

## 9. Optional Improvements

- Replace JSON paste QR flow with camera scan
- Add WebSocket for real-time order updates
- Add global error boundary fallback routing rules
- Add caching layer for menu and categories
