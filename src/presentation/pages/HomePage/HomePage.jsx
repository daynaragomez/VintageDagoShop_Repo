import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import Navbar from "../../components/layout/Navbar/Navbar";
import { fetchProducts } from "../../../infrastructure/api/productService";
import "./HomePage.css";

const HomePage = () => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProducts({
      q: debouncedSearch,
      category: activeCategory,
        minPrice,
        maxPrice,
      page: currentPage,
      limit: 12,
    })
      .then((result) => {
        setProducts(result.products);
        setPagination(result.pagination);
        setCategories(['All', ...(result.categories || [])]);
      })
      .catch(() => setError("Could not load products. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, [debouncedSearch, activeCategory, currentPage]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setCurrentPage(1);
  }

  function handleCategory(cat) {
    setActiveCategory(cat);
    setCurrentPage(1);
  }

  function handleMinPrice(e) {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  }

  function handleMaxPrice(e) {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  }

  const totalPages = useMemo(() => pagination.totalPages || 1, [pagination.totalPages]);

  return (
    <div className="homepage">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <h2>Featured Vintage Clothing</h2>

          <div className="search-filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search products…"
              value={search}
              onChange={handleSearch}
              data-testid="search-input"
            />
            <div className="price-filters" data-testid="price-filters">
              <input
                type="number"
                min="0"
                step="0.01"
                className="price-input"
                placeholder="Min price"
                value={minPrice}
                onChange={handleMinPrice}
                data-testid="min-price-input"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                className="price-input"
                placeholder="Max price"
                value={maxPrice}
                onChange={handleMaxPrice}
                data-testid="max-price-input"
              />
            </div>
            <div className="category-filters" data-testid="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn${activeCategory === cat ? ' category-btn--active' : ''}`}
                  onClick={() => handleCategory(cat)}
                  data-testid={`category-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="status-msg">Loading products...</p>}
          {error && <p className="status-msg error">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="status-msg" data-testid="no-results">No products match your search.</p>
          )}

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

          {totalPages > 1 && (
            <div className="pagination" data-testid="pagination">
              <button
                className="pagination__btn"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                data-testid="pagination-prev"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination__btn${currentPage === page ? ' pagination__btn--active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                  data-testid={`pagination-page-${page}`}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination__btn"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                data-testid="pagination-next"
              >
                Next →
              </button>
            </div>
          )}

          {!loading && !error && pagination.total > 0 && (
            <p className="status-msg" style={{ paddingTop: 0 }}>
              Showing {products.length} of {pagination.total} products
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
