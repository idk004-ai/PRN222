import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          {/* Placeholder routes for future pages */}
          <Route path="orders" element={<div className="p-6"><h2 className="text-2xl font-bold">Orders Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<div className="p-6"><h2 className="text-2xl font-bold">Customers Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
          <Route path="analytics" element={<div className="p-6"><h2 className="text-2xl font-bold">Analytics Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
          <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-bold">Settings Page</h2><p className="text-gray-600">Coming soon...</p></div>} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900">404</h1><p className="text-gray-600">Page not found</p></div></div>} />
      </Routes>
    </Router>
  );
};

export default App;