/**
 * Main App Component
 * Sets up routing and authentication context
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Cart } from './components';
import { ROUTES } from './config/routes';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProfilePage from './pages/auth/ProfilePage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MenuPage from './pages/menu/MenuPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import QRScannerPage from './pages/customer/QRScannerPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffManagement from './pages/admin/StaffManagement';
import MenuManagement from './pages/admin/MenuManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import OrderOverview from './pages/admin/OrderOverview';
import Analytics from './pages/admin/Analytics';
import CashierReceiveCash from './pages/admin/CashierReceiveCash';

// Kitchen Pages
import KitchenPage from './pages/kitchen/KitchenPage';

// Waiter Pages
import WaiterDashboard from './pages/waiter/WaiterDashboard';
import ServeOrders from './pages/waiter/ServeOrders';
import ProxyOrder from './pages/waiter/ProxyOrder';
import TableStatus from './pages/waiter/TableStatus';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';

// Route Protection
import ProtectedRoute from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';
import RootRedirect from './components/RootRedirect';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Cart />
          <ErrorBoundary>
            <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN.path} element={<Login />} />
            <Route path={ROUTES.REGISTER.path} element={<Register />} />

          {/* Customer Dashboard */}
          <Route
            path="/customer"
            element={
              <RoleBasedRoute requiredRoles={[1]}>
                <CustomerDashboard />
              </RoleBasedRoute>
            }
          />

          {/* Menu - accessible to all authenticated users */}
          <Route
            path={ROUTES.MENU.path}
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />

          {/* QR Scanner - accessible to all authenticated users */}
          <Route
            path="/qr-scan"
            element={
              <ProtectedRoute>
                <QRScannerPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Customer Routes - require tableId */}
          <Route
            path="/checkout"
            element={
              <CustomerProtectedRoute>
                <CheckoutPage />
              </CustomerProtectedRoute>
            }
          />
          {/* Order history and tracking - accessible without tableId */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ORDER.path}
            element={
              <CustomerProtectedRoute>
                <MyOrdersPage />
              </CustomerProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE.path}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard & Routes */}
          <Route
            path="/admin"
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_DASHBOARD.path}
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <StaffManagement />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <MenuManagement />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <CategoryManagement />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <InventoryManagement />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <OrderOverview />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <Analytics />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/cashier"
            element={
              <RoleBasedRoute requiredRoles={[2]}>
                <CashierReceiveCash />
              </RoleBasedRoute>
            }
          />

          {/* Kitchen Routes */}
          <Route
            path={ROUTES.KITCHEN.path}
            element={
              <RoleBasedRoute requiredRoles={[3]}>
                <KitchenPage />
              </RoleBasedRoute>
            }
          />

          {/* Waiter Dashboard & Routes */}
          <Route
            path="/waiter"
            element={
              <RoleBasedRoute requiredRoles={[4]}>
                <WaiterDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/waiter/serve"
            element={
              <RoleBasedRoute requiredRoles={[4]}>
                <ServeOrders />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/waiter/proxy-order"
            element={
              <RoleBasedRoute requiredRoles={[4]}>
                <ProxyOrder />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/waiter/tables"
            element={
              <RoleBasedRoute requiredRoles={[4]}>
                <TableStatus />
              </RoleBasedRoute>
            }
          />

          {/* Error Pages */}
          <Route path={ROUTES.UNAUTHORIZED.path} element={<UnauthorizedPage />} />
          <Route path={ROUTES.NOT_FOUND.path} element={<NotFoundPage />} />

          {/* Default Route - Handle QR scan, redirect based on auth */}
          <Route path="/" element={<RootRedirect />} />
          {/* Catch all - 404 */}
          <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
