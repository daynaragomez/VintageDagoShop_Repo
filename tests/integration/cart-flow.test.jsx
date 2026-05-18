import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CartProvider } from '../../src/context/CartContext';
import HomePage from '../../src/presentation/pages/HomePage/HomePage';

const renderApp = () =>
  render(
    <CartProvider>
      <HomePage />
    </CartProvider>
  );

describe('Cart Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('full flow: add two products, verify total, remove one', () => {
    renderApp();

    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[1]);

    expect(screen.getByText('Cart (2)')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(screen.getByText('Cart (1)')).toBeInTheDocument();
  });

  test('adding same product multiple times increments quantity', () => {
    renderApp();

    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);

    expect(screen.getByText('Cart (3)')).toBeInTheDocument();

    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(1);
  });

  test('cart total reflects correct sum after multiple adds', () => {
    renderApp();

    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[2]);

    expect(screen.getByText(/\$29\.99/)).toBeInTheDocument();
  });

  test('cart persists correct state across add and remove operations', () => {
    renderApp();

    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[1]);
    fireEvent.click(addButtons[2]);

    let removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(3);

    fireEvent.click(removeButtons[1]);

    removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(2);
    expect(screen.getByText('Cart (2)')).toBeInTheDocument();
  });
});
