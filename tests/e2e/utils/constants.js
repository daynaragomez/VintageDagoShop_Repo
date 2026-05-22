export const CONSTANTS = {
  BASE_URL:     'http://localhost:5173',
  API_BASE_URL: 'http://localhost:3000/api',

  PRODUCTS: {
    LEATHER_JACKET: { id: 1, name: 'Vintage Leather Jacket', price: 89.99, stock: 5 },
    DENIM_JEANS:    { id: 2, name: 'Retro Denim Jeans',      price: 45.50, stock: 8 },
    BAND_TSHIRT:    { id: 3, name: 'Vintage Band T-Shirt',   price: 29.99, stock: 12 },
  },

  ROUTES: {
    HOME:         '/',
    CART:         '/cart',
    CHECKOUT:     '/checkout',
    CONFIRMATION: '/confirmation',
    PRODUCT:      (id) => `/product/${id}`,
  },

  TIMEOUTS: {
    SHORT:  3000,
    MEDIUM: 8000,
    LONG:   15000,
  },
};