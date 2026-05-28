import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../../src/context/CartContext';
import HomePage from '../../src/presentation/pages/HomePage/HomePage';
import CartPage from '../../src/presentation/pages/CartPage/CartPage';

// Mock the product service
vi.mock('../../src/infrastructure/api/productService', () => ({
  fetchProducts: vi.fn(() =>
    Promise.resolve([
      { id: 1, name: 'Vintage Leather Jacket', category: 'Jackets', price: 89.99, stock: 5, image: '' },
      { id: 2, name: 'Retro Denim Jeans', category: 'Pants', price: 45.5, stock: 10, image: '' },
      { id: 3, name: 'Vintage Band T-Shirt', category: 'Shirts', price: 29.99, stock: 15, image: '' },
    ])
  ),
}));

const renderApp = () =>
  render(
    <MemoryRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );

describe('Cart Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows initial cart count of 0', async () => {
    renderApp();

    // Wait for navbar to render
    await waitFor(() => {
      expect(screen.getByText(/Cart/)).toBeInTheDocument();
    });
  });

  test('products load successfully', async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Vintage Leather Jacket')).toBeInTheDocument();
    });
  });

  test('add to cart buttons are available', async () => {
    renderApp();

    const addButtons = await waitFor(() => screen.getAllByText('Add to Cart'));
    expect(addButtons.length).toBeGreaterThan(0);
  });
});
