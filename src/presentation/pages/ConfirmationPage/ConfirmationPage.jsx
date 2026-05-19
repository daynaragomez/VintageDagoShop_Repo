import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className=""confirmation-page"" data-testid=""confirmation-page"">
      <div className=""confirmation-card"" data-testid=""confirmation-card"">
        <div className=""confirmation-icon"" data-testid=""confirmation-icon"">&#x2713;</div>
        <h1 data-testid=""confirmation-heading"">Order Confirmed!</h1>
        <p data-testid=""confirmation-message"">Thank you for your purchase. You will receive a confirmation email shortly.</p>
        <button className=""btn-continue"" data-testid=""btn-shop-again"" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );
};

export default ConfirmationPage;