import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import Navbar from "../../components/layout/Navbar/Navbar";
import { fetchProduct } from "../../../infrastructure/api/productService";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="product-page"><Navbar /><p className="status-msg">Loading...</p></div>;
  if (error || !product) return (
    <div className="product-page">
      <Navbar />
      <div className="product-not-found">
        <h2>{error || "Product not found"}</h2>
        <button className="btn-back" onClick={() => navigate("/")}>Back to Shop</button>
      </div>
    </div>
  );

  const cartItem = cartItems.find((i) => i.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="product-page" data-testid="product-page">
      <Navbar />
      <main className="product-main">
        <div className="container">
          <button className="btn-back" data-testid="btn-back" onClick={() => navigate("/")}>Back to Shop</button>
          <div className="product-detail">
            <div className="product-detail-image">
              <img src={product.image} alt={product.name} data-testid="product-detail-image" />
            </div>
            <div className="product-detail-info">
              <span className="product-category" data-testid="product-detail-category">{product.category}</span>
              <h1 data-testid="product-detail-name">{product.name}</h1>
              <p className="product-detail-price" data-testid="product-detail-price">${parseFloat(product.price).toFixed(2)}</p>
              <p className="product-detail-description" data-testid="product-detail-desc">{product.description}</p>
              <p className="product-detail-details" data-testid="product-detail-details">{product.details}</p>
              <p className="product-detail-stock" data-testid="product-detail-stock">
                {product.stock - qty > 0 ? `${product.stock - qty} items in stock` : qty > 0 ? "All in cart" : "Out of stock"}
              </p>

              {qty > 0 ? (
                <div className="detail-qty-controls" data-testid="qty-controls">
                  <button className="btn-qty" data-testid="btn-qty-minus" onClick={() => updateQuantity(product.id, qty - 1)}>-</button>
                  <span className="qty-value" data-testid="qty-value">{qty} in cart</span>
                  <button className="btn-qty" data-testid="btn-qty-plus" onClick={() => addToCart(product)} disabled={qty >= product.stock}>+</button>
                  <button className="btn-go-cart" data-testid="btn-view-cart" onClick={() => navigate("/cart")}>View Cart</button>
                </div>
              ) : (
                <button
                  className="btn-add-to-cart-detail"
                  data-testid="btn-add-to-cart"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
