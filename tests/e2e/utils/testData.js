export const testData = {
  validCustomer: {
    name:    'Jane Doe',
    email:   'jane@test.com',
    phone:   '514-555-0100',
    street:  '123 Vintage Ave',
    city:    'Montreal',
    state:   'Quebec',
    zipCode: 'H3B 1A1',
    country: 'Canada',
    card:    '4111 1111 1111 1111',
  },

  invalidCustomer: {
    missingName: { name: '',     email: 'jane@test.com', street: '123 Main St', city: 'Montreal', country: 'Canada', card: '4111 1111 1111 1111' },
    badEmail:    { name: 'Jane', email: 'not-an-email',  street: '123 Main St', city: 'Montreal', country: 'Canada', card: '4111 1111 1111 1111' },
    missingCard: { name: 'Jane', email: 'jane@test.com', street: '123 Main St', city: 'Montreal', country: 'Canada', card: '' },
  },

  orderItems: (productId, quantity, unitPrice) => [
    { productId, quantity, unitPrice },
  ],
};