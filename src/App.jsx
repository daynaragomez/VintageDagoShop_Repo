import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './presentation/pages/HomePage/HomePage';
import ProductPage from './presentation/pages/ProductPage/ProductPage';
import CartPage from './presentation/pages/CartPage/CartPage';
import CheckoutPage from './presentation/pages/CheckoutPage/CheckoutPage';
import ConfirmationPage from './presentation/pages/ConfirmationPage/ConfirmationPage';
import AdminOrdersPage from './presentation/pages/AdminOrdersPage/AdminOrdersPage';
import AdminOrderDetailPage from './presentation/pages/AdminOrderDetailPage/AdminOrderDetailPage';
import AdminLoginPage from './presentation/pages/AdminLoginPage/AdminLoginPage';
import PrivateRoute from './presentation/components/common/PrivateRoute/PrivateRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/orders"
                element={(
                  <PrivateRoute requireAdmin>
                    <AdminOrdersPage />
                  </PrivateRoute>
                )}
              />
              <Route
                path="/admin/orders/:id"
                element={(
                  <PrivateRoute requireAdmin>
                    <AdminOrderDetailPage />
                  </PrivateRoute>
                )}
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


