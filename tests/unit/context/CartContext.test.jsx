import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from '../../../src/context/CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartItems).toHaveLength(0);
  });

  test('addToCart adds a new item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
    });
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(1);
  });

  test('addToCart increments quantity for existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
    });
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
  });

  test('removeFromCart removes item by id', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
      result.current.removeFromCart(1);
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  test('updateQuantity changes item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
      result.current.updateQuantity(1, 5);
    });
    expect(result.current.cartItems[0].quantity).toBe(5);
  });

  test('updateQuantity with 0 removes item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
      result.current.updateQuantity(1, 0);
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  test('clearCart empties all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
      result.current.addToCart({ id: 2, name: 'Jeans', price: 45.5 });
      result.current.clearCart();
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  test('getCartTotal calculates correct total', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
      result.current.addToCart({ id: 2, name: 'Jeans', price: 45.5 });
    });
    expect(result.current.getCartTotal()).toBeCloseTo(135.49, 2);
  });

  test('getCartCount returns total quantity across all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
      result.current.addToCart({ id: 1, name: 'Jacket', price: 89.99 });
      result.current.addToCart({ id: 2, name: 'Jeans', price: 45.5 });
    });
    expect(result.current.getCartCount()).toBe(3);
  });

  test('useCart throws when used outside provider', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within a CartProvider'
    );
  });
});
