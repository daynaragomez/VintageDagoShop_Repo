import { authenticatedFetch } from './authService';

const BASE_URL = '/api/orders';

/**
 * Fetch all orders (requires authentication)
 */
export async function fetchOrders() {
  const res = await authenticatedFetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

/**
 * Fetch single order by ID (requires authentication)
 */
export async function fetchOrder(id) {
  const res = await authenticatedFetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

/**
 * Update order status (requires authentication)
 */
export async function updateOrderStatus(id, status) {
  const res = await authenticatedFetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update order status');
  return data;
}
