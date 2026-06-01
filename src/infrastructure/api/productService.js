const BASE_URL = '/api';

export async function fetchProducts(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  const res = await fetch(`${BASE_URL}/products${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();

  if (Array.isArray(data)) {
    return {
      products: data,
      pagination: {
        page: 1,
        limit: data.length || 12,
        total: data.length,
        totalPages: 1,
      },
      categories: Array.from(new Set(data.map((product) => product.category))).filter(Boolean).sort(),
      filters: {},
    };
  }

  return {
    products: data.products ?? [],
    pagination: data.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 1 },
    categories: data.categories ?? [],
    filters: data.filters ?? {},
  };
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function placeOrder({ name, email, phone, address, items }) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, address, items }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to place order');
  return data;
}
