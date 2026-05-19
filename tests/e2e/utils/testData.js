export const testData = {
  validCustomer: {
    name:    'Jane Doe',
    email:   'jane@test.com',
    address: '123 Vintage Ave, Retro City',
    card:    '4111 1111 1111 1111',
  },

  invalidCustomer: {
    missingName:  { name: '',       email: 'jane@test.com', address: '123 Main St', card: '4111 1111 1111 1111' },
    badEmail:     { name: 'Jane',   email: 'not-an-email',  address: '123 Main St', card: '4111 1111 1111 1111' },
    missingCard:  { name: 'Jane',   email: 'jane@test.com', address: '123 Main St', card: '' },
  },

  orderItems: (productId, quantity, unitPrice) => [
    { productId, quantity, unitPrice },
  ],
};