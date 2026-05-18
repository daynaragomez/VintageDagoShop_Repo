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
    <div className="product-page">
      <Navbar />
      <main className="product-main">
        <div className="container">
          <button className="btn-back" onClick={() => navigate("/")}>Back to Shop</button>
          <div className="product-detail">
            <div className="product-detail-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-detail-info">
              <span className="product-category">{product.category}</span>
              <h1>{product.name}</h1>
              <p className="product-detail-price">${parseFloat(product.price).toFixed(2)}</p>
              <p className="product-detail-description">{product.description}</p>
              <p className="product-detail-details">{product.details}</p>
              <p className="product-detail-stock">
                {product.stock - qty > 0 ? `${product.stock - qty} items in stock` : qty > 0 ? "All in cart" : "Out of stock"}
              </p>

              {qty > 0 ? (
                <div className="detail-qty-controls">
                  <button className="btn-qty" onClick={() => updateQuantity(product.id, qty - 1)}>-</button>
                  <span className="qty-value">{qty} in cart</span>
                  <button className="btn-qty" onClick={() => addToCart(product)} disabled={qty >= product.stock}>+</button>
                  <button className="btn-go-cart" onClick={() => navigate("/cart")}>View Cart</button>
                </div>
              ) : (
                <button
                  className="btn-add-to-cart-detail"
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
