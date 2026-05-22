import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const order     = state || {};

  return (
    <div className="confirmation-page" data-testid="confirmation-page">
      <div className="confirmation-card" data-testid="confirmation-card">
        <div className="confirmation-icon" data-testid="confirmation-icon">&#x2713;</div>
        <h1 data-testid="confirmation-heading">Order Confirmed!</h1>
        <p data-testid="confirmation-message">Thank you for your purchase. You will receive a confirmation email shortly.</p>

        {order.orderId && (
          <div className="confirmation-summary" data-testid="confirmation-summary">
            <div className="confirmation-row" data-testid="confirmation-order-id">
              <span>Order #</span>
              <span data-testid="confirmation-order-id-value">{order.orderId}</span>
            </div>
            <div className="confirmation-row" data-testid="confirmation-subtotal">
              <span>Subtotal</span>
              <span data-testid="confirmation-subtotal-value">${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="confirmation-row" data-testid="confirmation-tax">
              <span>Tax (15%)</span>
              <span data-testid="confirmation-tax-value">${Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="confirmation-row confirmation-total" data-testid="confirmation-total">
              <strong>Total</strong>
              <strong data-testid="confirmation-total-value">${Number(order.total).toFixed(2)}</strong>
            </div>
          </div>
        )}

        <button className="btn-continue" data-testid="btn-shop-again" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
