import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { aggregateOrderItems } = require('../../backend/src/utils/orderItems');

describe('aggregateOrderItems', () => {
  it('combines duplicate product lines before stock validation', () => {
    expect(aggregateOrderItems([
      { productId: '3', quantity: '2', unitPrice: 12.5 },
      { productId: 3, quantity: 4, unitPrice: 12.5 },
      { productId: 7, quantity: 1, unitPrice: 3 },
    ])).toEqual([
      { productId: 3, quantity: 6, unitPrice: 12.5 },
      { productId: 7, quantity: 1, unitPrice: 3 },
    ]);
  });
});