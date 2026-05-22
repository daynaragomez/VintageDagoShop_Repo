import { test, expect } from '../../fixtures/index.js';
import { CONSTANTS }    from '../utils/constants.js';
import { testData }     from '../utils/testData.js';

const { LEATHER_JACKET } = CONSTANTS.PRODUCTS;

test.describe('API — Products', { tag: ['@api', '@smoke'] }, () => {

  test('GET /api/products returns 3 products', { tag: '@smoke' },
    async ({ productApi }) => {
      const products = await productApi.getAll();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(3);
    }
  );

  test('each product has id, name, price and stock',
    async ({ productApi }) => {
      const products = await productApi.getAll();
      for (const p of products) {
        expect(p).toHaveProperty('id');
        expect(p).toHaveProperty('name');
        expect(p).toHaveProperty('price');
        expect(p).toHaveProperty('stock');
      }
    }
  );

  test('GET /api/products/:id returns correct product',
    async ({ productApi }) => {
      const product = await productApi.getById(LEATHER_JACKET.id);
      expect(product.name).toBe(LEATHER_JACKET.name);
      expect(parseFloat(product.price)).toBeCloseTo(LEATHER_JACKET.price, 2);
    }
  );
});

test.describe('API — Orders', { tag: ['@api', '@inventory'] }, () => {

  test('POST /api/orders decrements stock by quantity ordered',
    { tag: '@critical' },
    // eslint-disable-next-line no-unused-vars
    async ({ db, productApi, orderApi }) => {
      const before = await productApi.getById(LEATHER_JACKET.id);
      await orderApi.placeOrderExpectSuccess({
        name:    testData.validCustomer.name,
        email:   testData.validCustomer.email,
        address: testData.validCustomer.address,
        items:   testData.orderItems(LEATHER_JACKET.id, 1, LEATHER_JACKET.price),
      });
      const after = await productApi.getById(LEATHER_JACKET.id);
      expect(parseInt(after.stock)).toBe(parseInt(before.stock) - 1);
    }
  );

  test('POST /api/orders returns 400 when quantity exceeds stock',
    { tag: '@boundary' },
    // eslint-disable-next-line no-unused-vars
    async ({ db, orderApi }) => {
      const { status, body } = await orderApi.placeOrder({
        name:    testData.validCustomer.name,
        email:   testData.validCustomer.email,
        address: testData.validCustomer.address,
        items:   testData.orderItems(LEATHER_JACKET.id, 999, LEATHER_JACKET.price),
      });
      expect(status).toBe(400);
      expect(body.error).toBeTruthy();
    }
  );
});
