const BASE_URL = '/api';

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function placeOrder({ name, email, address, items }) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, address, items }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to place order');
  return data;
}
