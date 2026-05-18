import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
        <button className="btn-continue" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
