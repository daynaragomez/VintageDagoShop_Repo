import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import Navbar from '../../components/layout/Navbar/Navbar';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <button className="btn-shop" onClick={() => navigate('/')}>Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      <main className="cart-main">
        <div className="container">
          <h1>Shopping Cart</h1>
          <div className="cart-layout">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-row-image"
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                  <div className="cart-row-info">
                    <h3 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                    <p className="cart-row-price">${parseFloat(item.price).toFixed(2)} each</p>
                  </div>
                  <div className="cart-row-qty">
                    <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                  </div>
                  <span className="cart-row-subtotal">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="cart-summary-panel">
              <h2>Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="summary-line">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Total</strong>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </div>
              <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
              <button className="btn-continue-shopping" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
