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
      <div className=""cart-page"" data-testid=""cart-page"">
        <Navbar />
        <div className=""cart-empty"" data-testid=""cart-empty"">
          <h2 data-testid=""cart-empty-msg"">Your cart is empty</h2>
          <button className=""btn-shop"" data-testid=""btn-browse"" onClick={() => navigate('/')}>Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className=""cart-page"" data-testid=""cart-page"">
      <Navbar />
      <main className=""cart-main"">
        <div className=""container"">
          <h1 data-testid=""cart-title"">Shopping Cart</h1>
          <div className=""cart-layout"">
            <div className=""cart-items-list"" data-testid=""cart-items-list"">
              {cartItems.map((item) => (
                <div key={item.id} className=""cart-row"" data-testid={cart-row-}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className=""cart-row-image""
                    data-testid={cart-item-image-}
                    onClick={() => navigate(/product/)}
                  />
                  <div className=""cart-row-info"">
                    <h3 data-testid={cart-item-name-} onClick={() => navigate(/product/)}>{item.name}</h3>
                    <p className=""cart-row-price"" data-testid={cart-item-price-}> each</p>
                  </div>
                  <div className=""cart-row-qty"" data-testid={cart-item-qty-controls-}>
                    <button className=""btn-qty"" data-testid={tn-qty-minus-} onClick={() => updateQuantity(item.id, item.quantity - 1)}>&minus;</button>
                    <span data-testid={cart-item-qty-}>{item.quantity}</span>
                    <button className=""btn-qty"" data-testid={tn-qty-plus-} onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                  </div>
                  <span className=""cart-row-subtotal"" data-testid={cart-item-subtotal-}></span>
                  <button className=""btn-remove"" data-testid={tn-remove-} onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
            </div>

            <div className=""cart-summary-panel"" data-testid=""cart-summary-panel"">
              <h2>Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className=""summary-line"" data-testid={summary-line-}>
                  <span>{item.name} &times; {item.quantity}</span>
                  <span></span>
                </div>
              ))}
              <div className=""summary-total"" data-testid=""cart-total"">
                <strong>Total</strong>
                <strong data-testid=""cart-total-value""></strong>
              </div>
              <button className=""btn-checkout"" data-testid=""btn-checkout"" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
              <button className=""btn-continue-shopping"" data-testid=""btn-continue-shopping"" onClick={() => navigate('/')}>
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