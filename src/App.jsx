import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './presentation/pages/HomePage/HomePage';
import ProductPage from './presentation/pages/ProductPage/ProductPage';
import CartPage from './presentation/pages/CartPage/CartPage';
import CheckoutPage from './presentation/pages/CheckoutPage/CheckoutPage';
import ConfirmationPage from './presentation/pages/ConfirmationPage/ConfirmationPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;


