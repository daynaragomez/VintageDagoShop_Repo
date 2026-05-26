import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../../infrastructure/api/orderService';
import './AdminOrdersPage.css';

const STATUS_LABELS = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  shipped:   'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-orders-loading">Loading orders…</div>;
  if (error)   return <div className="admin-orders-error">Error: {error}</div>;

  return (
    <div className="admin-orders">
      <h1 className="admin-orders__title">Order Management</h1>

      {orders.length === 0 ? (
        <p className="admin-orders__empty">No orders yet.</p>
      ) : (
        <table className="admin-orders__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={`admin-orders__row admin-orders__row--${order.status}`}>
                <td data-testid={`order-id-${order.id}`}>{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.customer_name}</td>
                <td>{order.customer_email}</td>
                <td>${Number(order.total).toFixed(2)}</td>
                <td>
                  <span className={`admin-orders__badge admin-orders__badge--${order.status}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="admin-orders__view-link"
                    data-testid={`view-order-${order.id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
