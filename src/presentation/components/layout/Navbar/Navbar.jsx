import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { getCartCount, getCartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const count = getCartCount();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <span className="navbar-logo" onClick={() => navigate('/')}>Vintage Dago Shop</span>
        <nav className="navbar-links">
          <span className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('/')}>Shop</span>
          <span className={location.pathname === '/cart' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('/cart')}>
            Cart {count > 0 && <span className="cart-badge">{count}</span>}
            {count > 0 && <span className="navbar-cart-total">${getCartTotal().toFixed(2)}</span>}
          </span>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
