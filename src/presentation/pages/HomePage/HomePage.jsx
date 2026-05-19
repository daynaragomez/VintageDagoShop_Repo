import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import Navbar from "../../components/layout/Navbar/Navbar";
import { fetchProducts } from "../../../infrastructure/api/productService";
import "./HomePage.css";

const HomePage = () => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <h2>Featured Vintage Clothing</h2>

          {loading && <p className="status-msg">Loading products...</p>}
          {error && <p className="status-msg error">{error}</p>}

          <div className="products-grid" data-testid="products-grid">
            {products.map((product) => {
              const cartItem = cartItems.find((i) => i.id === product.id);
              const inCart = cartItem ? cartItem.quantity : 0;
              const remaining = product.stock - inCart;
              return (
              <div key={product.id} className="product-card" data-testid={`product-card-${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  data-testid={`product-image-${product.id}`}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <div className="product-info">
                  <h3 data-testid={`product-name-${product.id}`} onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
                  <p className="product-description" data-testid={`product-desc-${product.id}`}>{product.description}</p>
                  <p className="product-price" data-testid={`product-price-${product.id}`}>${parseFloat(product.price).toFixed(2)}</p>
                  <p className="product-stock" data-testid={`product-stock-${product.id}`}>
                    {remaining > 0 ? `${remaining} in stock` : inCart > 0 ? "All in cart" : "Out of stock"}
                  </p>
                  <div className="product-actions">
                    <button className="btn-view" data-testid={`btn-view-${product.id}`} onClick={() => navigate(`/product/${product.id}`)}>
                      View Details
                    </button>
                    <button
                      className="btn-add-to-cart"
                      data-testid={`btn-add-to-cart-${product.id}`}
                      onClick={() => addToCart(product)}
                      disabled={remaining <= 0}
                    >
                      {inCart > 0 ? `In Cart (${inCart})` : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
