import { test, expect } from '../../fixtures/index.js';
import { CONSTANTS }    from '../utils/constants.js';
import { testData }     from '../utils/testData.js';

/**
 * API-level tests — validate backend directly without UI.
 */
test.describe('API — Products', () => {
  test('GET /api/products returns 3 products', async ({ productApi }) => {
    const products = await productApi.getAll();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(3);
  });

  test('each product has required fields', async ({ productApi }) => {
    const products = await productApi.getAll();
    for (const p of products) {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('price');
      expect(p).toHaveProperty('stock');
    }
  });

  test('GET /api/products/:id returns correct product', async ({ productApi }) => {
    const product = await productApi.getById(CONSTANTS.PRODUCTS.LEATHER_JACKET.id);
    expect(product.name).toBe(CONSTANTS.PRODUCTS.LEATHER_JACKET.name);
    expect(parseFloat(product.price)).toBeCloseTo(CONSTANTS.PRODUCTS.LEATHER_JACKET.price, 2);
  });
});

test.describe('API — Orders', () => {
  test('POST /api/orders creates order and decrements stock', async ({ productApi, orderApi, db }) => {
    const before = await productApi.getById(CONSTANTS.PRODUCTS.LEATHER_JACKET.id);

    await orderApi.placeOrderExpectSuccess({
      name:    testData.validCustomer.name,
      email:   testData.validCustomer.email,
      address: testData.validCustomer.address,
      items:   testData.orderItems(CONSTANTS.PRODUCTS.LEATHER_JACKET.id, 1, CONSTANTS.PRODUCTS.LEATHER_JACKET.price),
    });

    const after = await productApi.getById(CONSTANTS.PRODUCTS.LEATHER_JACKET.id);
    expect(parseInt(after.stock)).toBe(parseInt(before.stock) - 1);
  });

  test('POST /api/orders fails when stock is insufficient', async ({ orderApi, db }) => {
    const { status, body } = await orderApi.placeOrder({
      name:    testData.validCustomer.name,
      email:   testData.validCustomer.email,
      address: testData.validCustomer.address,
      items:   testData.orderItems(CONSTANTS.PRODUCTS.LEATHER_JACKET.id, 999, CONSTANTS.PRODUCTS.LEATHER_JACKET.price),
    });
    expect(status).toBe(400);
    expect(body.error).toBeTruthy();
  });
});