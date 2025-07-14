import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { UserLayout } from './components/layout/UserLayout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Categories } from './pages/Categories';
import { Login } from './pages/Login';
import { UserDashboard } from './pages/UserDashboard';
import { Cart } from './pages/Cart';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login route */}
          <Route path="/login" element={<Login />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<div className="p-6"><h2 className="text-2xl font-bold">Orders Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="customers" element={<div className="p-6"><h2 className="text-2xl font-bold">Customers Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
            <Route path="analytics" element={<div className="p-6"><h2 className="text-2xl font-bold">Analytics Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-bold">Settings Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
          </Route>

          {/* User routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<div className="p-6"><h2 className="text-2xl font-bold">Profile Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
            <Route path="orders" element={<div className="p-6"><h2 className="text-2xl font-bold">Orders Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
            <Route path="wishlist" element={<div className="p-6"><h2 className="text-2xl font-bold">Wishlist Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-bold">Settings Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<div className="flex items-center justify-center h-screen"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900">404</h1><p className="text-gray-600">Page not found</p></div></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;