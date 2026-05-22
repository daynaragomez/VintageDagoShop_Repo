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
      <div className="cart-page" data-testid="cart-page">
        <Navbar />
        <div className="cart-empty" data-testid="cart-empty">
          <h2 data-testid="cart-empty-msg">Your cart is empty</h2>
          <button className="btn-shop" data-testid="btn-browse" onClick={() => navigate('/')}>Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" data-testid="cart-page">
      <Navbar />
      <main className="cart-main">
        <div className="container">
          <h1 data-testid="cart-title">Shopping Cart</h1>
          <div className="cart-layout">
            <div className="cart-items-list" data-testid="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-row" data-testid={`cart-row-${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-row-image"
                    data-testid={`cart-item-image-${item.id}`}
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                  <div className="cart-row-info">
                    <h3 data-testid={`cart-item-name-${item.id}`} onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                    <p className="cart-row-price" data-testid={`cart-item-price-${item.id}`}>${parseFloat(item.price).toFixed(2)} each</p>
                  </div>
                  <div className="cart-row-qty" data-testid={`cart-item-qty-controls-${item.id}`}>
                    <button className="btn-qty" data-testid={`btn-qty-minus-${item.id}`} onClick={() => updateQuantity(item.id, item.quantity - 1)}>&minus;</button>
                    <span data-testid={`cart-item-qty-${item.id}`}>{item.quantity}</span>
                    <button className="btn-qty" data-testid={`btn-qty-plus-${item.id}`} onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                  </div>
                  <span className="cart-row-subtotal" data-testid={`cart-item-subtotal-${item.id}`}>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  <button className="btn-remove" data-testid={`btn-remove-${item.id}`} onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="cart-summary-panel" data-testid="cart-summary-panel">
              <h2>Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="summary-line" data-testid={`summary-line-${item.id}`}>
                  <span>{item.name} &times; {item.quantity}</span>
                  <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-total" data-testid="cart-total">
                <strong>Total</strong>
                <strong data-testid="cart-total-value">${getCartTotal().toFixed(2)}</strong>
              </div>
              <button className="btn-checkout" data-testid="btn-checkout" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
              <button className="btn-continue-shopping" data-testid="btn-continue-shopping" onClick={() => navigate('/')}>
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
