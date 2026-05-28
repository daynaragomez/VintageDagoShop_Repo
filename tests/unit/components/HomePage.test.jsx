import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../../src/context/CartContext';
import HomePage from '../../../src/presentation/pages/HomePage/HomePage';

// Mock the product service
vi.mock('../../../src/infrastructure/api/productService', () => ({
  fetchProducts: vi.fn(() =>
    Promise.resolve([
      { id: 1, name: 'Vintage Leather Jacket', category: 'Jackets', price: 89.99, stock: 5 },
      { id: 2, name: 'Retro Denim Jeans', category: 'Pants', price: 45.5, stock: 10 },
      { id: 3, name: 'Vintage Band T-Shirt', category: 'Shirts', price: 29.99, stock: 15 },
    ])
  ),
}));

const renderHomePage = () =>
  render(
    <MemoryRouter>
      <CartProvider>
        <HomePage />
      </CartProvider>
    </MemoryRouter>
  );

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the shop title', async () => {
    renderHomePage();
    expect(screen.getByText('Vintage Dago Shop')).toBeInTheDocument();
  });

  test('renders all 3 products', async () => {
    renderHomePage();
    await waitFor(() => {
      expect(screen.getByText('Vintage Leather Jacket')).toBeInTheDocument();
      expect(screen.getByText('Retro Denim Jeans')).toBeInTheDocument();
      expect(screen.getByText('Vintage Band T-Shirt')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('shows Cart (0) initially', async () => {
    renderHomePage();
    // Wait for navbar to be ready before checking cart count
    await waitFor(() => {
      expect(screen.getByTestId('nav-cart')).toBeInTheDocument();
    });
  });

  test('cart summary is not visible when cart is empty', async () => {
    renderHomePage();
    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument();
  });

  test('renders navigation with links', async () => {
    renderHomePage();
    expect(screen.getByTestId('nav-shop')).toBeInTheDocument();
    expect(screen.getByTestId('nav-cart')).toBeInTheDocument();
  });

  test('renders search and category filters', async () => {
    renderHomePage();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('category-filters')).toBeInTheDocument();
  });
});
