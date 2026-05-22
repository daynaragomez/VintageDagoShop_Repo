import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CartProvider } from '../../../src/context/CartContext';
import HomePage from '../../../src/presentation/pages/HomePage/HomePage';

const renderHomePage = () =>
  render(
    <CartProvider>
      <HomePage />
    </CartProvider>
  );

describe('HomePage', () => {
  test('renders the shop title', () => {
    renderHomePage();
    expect(screen.getByText('Vintage Dago Shop')).toBeInTheDocument();
  });

  test('renders all 3 products', () => {
    renderHomePage();
    expect(screen.getByText('Vintage Leather Jacket')).toBeInTheDocument();
    expect(screen.getByText('Retro Denim Jeans')).toBeInTheDocument();
    expect(screen.getByText('Vintage Band T-Shirt')).toBeInTheDocument();
  });

  test('shows Cart (0) initially', () => {
    renderHomePage();
    expect(screen.getByText('Cart (0)')).toBeInTheDocument();
  });

  test('cart summary is not visible when cart is empty', () => {
    renderHomePage();
    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument();
  });

  test('adds product to cart and shows cart summary', () => {
    renderHomePage();
    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  test('cart count updates after adding product', () => {
    renderHomePage();
    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    expect(screen.getByText('Cart (1)')).toBeInTheDocument();
  });

  test('removes product from cart', () => {
    renderHomePage();
    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument();
  });
});
