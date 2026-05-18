import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import Navbar from "../../components/layout/Navbar/Navbar";
import { placeOrder } from "../../../infrastructure/api/productService";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "", card: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (form.card.replace(/\s/g, "").length !== 16) e.card = "Card must be 16 digits";
    return e;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError(null);
    try {
      await placeOrder({
        name: form.name,
        email: form.email,
        address: form.address,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price),
        })),
      });
      clearCart();
      navigate("/confirmation");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <button className="btn-back-shop" onClick={() => navigate("/")}>Back to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <main className="checkout-main">
        <div className="container checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <h2>Shipping & Payment</h2>

            {apiError && <div className="api-error">{apiError}</div>}

            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Shipping Address</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, City" />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <input name="card" value={form.card} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19} />
              {errors.card && <span className="form-error">{errors.card}</span>}
            </div>

            <button type="submit" className="btn-place-order" disabled={submitting}>
              {submitting ? "Placing Order..." : `Place Order - $${getCartTotal().toFixed(2)}`}
            </button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <span>{item.name} x{item.quantity}</span>
                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Total</strong>
              <strong>${getCartTotal().toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
